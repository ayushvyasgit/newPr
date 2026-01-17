const accountModel = require('../models/accountModel');
const db = require('../config/database');

const getAccountByUserId = async (userId) => {
  const account = await accountModel.findByUserId(userId);
  if (!account) {
    throw new Error('Account not found');
  }
  return account;
};

const deposit = async (userId, amount) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');

    const account = await accountModel.findByUserId(userId);
    if (!account) {
      throw new Error('Account not found');
    }

    const updatedAccount = await accountModel.updateBalance(client, account.id, amount);

    await client.query('COMMIT');
    return updatedAccount;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { getAccountByUserId, deposit };