const accountModel = require('../models/accountModel');
const transferModel = require('../models/transferModel');
const db = require('../config/database');

const createTransfer = async (userId, toAccountNumber, amount, description) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const fromAccount = await accountModel.findByUserId(userId);
    if (!fromAccount) {
      throw new Error('Your account not found');
    }

    const toAccount = await accountModel.findByAccountNumber(toAccountNumber);
    if (!toAccount) {
      throw new Error('Recipient account not found');
    }

    if (fromAccount.id === toAccount.id) {
      throw new Error('Cannot transfer to same account');
    }

    if (fromAccount.balance < amount) {
      throw new Error('Insufficient balance');
    }

    await accountModel.updateBalance(client, fromAccount.id, -amount);
    await accountModel.updateBalance(client, toAccount.id, amount);

    const transfer = await transferModel.create(
      client,
      fromAccount.id,
      toAccount.id,
      amount,
      description
    );

    await client.query('COMMIT');
    return transfer;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getTransactionHistory = async (userId, page, limit) => {
  const account = await accountModel.findByUserId(userId);
  if (!account) {
    throw new Error('Account not found');
  }

  const transfers = await transferModel.findByAccountId(account.id, page, limit);
  const total = await transferModel.countByAccountId(account.id);

  return {
    transfers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = { createTransfer, getTransactionHistory };