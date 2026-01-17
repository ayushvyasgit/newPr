const accountModel = require('../models/accountModel');
const scheduledTransferModel = require('../models/scheduledTransferModel');
const executionModel = require('../models/executionModel');
const transferModel = require('../models/transferModel');
const db = require('../config/database');

const calculateNextExecutionDate = (currentDate, frequency) => {
  const next = new Date(currentDate);
  
  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'once':
      return null;
  }
  
  return next.toISOString().split('T')[0];
};

const createScheduledTransfer = async (userId, toAccountNumber, amount, frequency, description, startDate, endDate) => {
  const fromAccount = await accountModel.findByUserId(userId);
  if (!fromAccount) {
    throw new Error('Your account not found');
  }

  const toAccount = await accountModel.findByAccountNumber(toAccountNumber);
  if (!toAccount) {
    throw new Error('Recipient account not found');
  }

  if (fromAccount.id === toAccount.id) {
    throw new Error('Cannot schedule transfer to same account');
  }

  const scheduledTransfer = await scheduledTransferModel.create(
    fromAccount.id,
    toAccount.id,
    amount,
    frequency,
    description,
    startDate,
    endDate
  );

  return scheduledTransfer;
};

const getScheduledTransfers = async (userId) => {
  const account = await accountModel.findByUserId(userId);
  if (!account) {
    throw new Error('Account not found');
  }

  return await scheduledTransferModel.findByAccountId(account.id);
};

const getScheduledTransferDetails = async (userId, scheduledTransferId) => {
  const scheduledTransfer = await scheduledTransferModel.findById(scheduledTransferId);
  if (!scheduledTransfer) {
    throw new Error('Scheduled transfer not found');
  }

  const account = await accountModel.findByUserId(userId);
  if (scheduledTransfer.from_account_id !== account.id) {
    throw new Error('Unauthorized access');
  }

  return scheduledTransfer;
};

const pauseScheduledTransfer = async (userId, scheduledTransferId) => {
  await getScheduledTransferDetails(userId, scheduledTransferId);
  return await scheduledTransferModel.updateStatus(scheduledTransferId, 'paused');
};

const resumeScheduledTransfer = async (userId, scheduledTransferId) => {
  await getScheduledTransferDetails(userId, scheduledTransferId);
  return await scheduledTransferModel.updateStatus(scheduledTransferId, 'active');
};

const cancelScheduledTransfer = async (userId, scheduledTransferId) => {
  await getScheduledTransferDetails(userId, scheduledTransferId);
  return await scheduledTransferModel.updateStatus(scheduledTransferId, 'cancelled');
};

const getExecutionHistory = async (userId, scheduledTransferId) => {
  await getScheduledTransferDetails(userId, scheduledTransferId);
  return await executionModel.findByScheduledTransferId(scheduledTransferId);
};

const executeScheduledTransfer = async (scheduledTransfer) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const fromAccountResult = await client.query(
      'SELECT * FROM accounts WHERE id = $1',
      [scheduledTransfer.from_account_id]
    );
    const fromAccount = fromAccountResult.rows[0];

    if (fromAccount.balance < scheduledTransfer.amount) {
      await executionModel.create(
        client,
        scheduledTransfer.id,
        null,
        'failed',
        'Insufficient balance'
      );
      await client.query('COMMIT');
      return;
    }

    await accountModel.updateBalance(client, scheduledTransfer.from_account_id, -scheduledTransfer.amount);
    await accountModel.updateBalance(client, scheduledTransfer.to_account_id, scheduledTransfer.amount);

    const transfer = await transferModel.create(
      client,
      scheduledTransfer.from_account_id,
      scheduledTransfer.to_account_id,
      scheduledTransfer.amount,
      scheduledTransfer.description,
      'scheduled',
      scheduledTransfer.id
    );

    await executionModel.create(client, scheduledTransfer.id, transfer.id, 'success');

    const nextDate = calculateNextExecutionDate(scheduledTransfer.next_execution_date, scheduledTransfer.frequency);
    
    if (!nextDate || (scheduledTransfer.end_date && nextDate > scheduledTransfer.end_date)) {
      await scheduledTransferModel.updateStatus(scheduledTransfer.id, 'completed');
    } else {
      await scheduledTransferModel.updateNextExecutionDate(scheduledTransfer.id, nextDate);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    
    try {
      const errorClient = await db.getClient();
      await errorClient.query('BEGIN');
      await executionModel.create(errorClient, scheduledTransfer.id, null, 'failed', error.message);
      await errorClient.query('COMMIT');
      errorClient.release();
    } catch (logError) {
      console.error('Failed to log execution error:', logError);
    }
    
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  createScheduledTransfer,
  getScheduledTransfers,
  getScheduledTransferDetails,
  pauseScheduledTransfer,
  resumeScheduledTransfer,
  cancelScheduledTransfer,
  getExecutionHistory,
  executeScheduledTransfer,
};