const db = require('../config/database');

const create = async (userId, accountNumber) => {
  const result = await db.query(
    'INSERT INTO accounts (user_id, account_number) VALUES ($1, $2) RETURNING *',
    [userId, accountNumber]
  );
  return result.rows[0];
};

const findByUserId = async (userId) => {
  const result = await db.query(
    'SELECT * FROM accounts WHERE user_id = $1',
    [userId]
  );
  return result.rows[0];
};

const findByAccountNumber = async (accountNumber) => {
  const result = await db.query(
    'SELECT * FROM accounts WHERE account_number = $1',
    [accountNumber]
  );
  return result.rows[0];
};

const updateBalance = async (client, accountId, amount) => {
  const result = await client.query(
    'UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING *',
    [amount, accountId]
  );
  return result.rows[0];
};

module.exports = { create, findByUserId, findByAccountNumber, updateBalance };