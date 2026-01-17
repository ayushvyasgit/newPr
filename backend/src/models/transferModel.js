const db = require('../config/database');

const create = async (client, fromAccountId, toAccountId, amount, description, type = 'instant', scheduledTransferId = null) => {
  const result = await client.query(
    `INSERT INTO transfers (from_account_id, to_account_id, amount, description, transaction_type, scheduled_transfer_id) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [fromAccountId, toAccountId, amount, description, type, scheduledTransferId]
  );
  return result.rows[0];
};

const findByAccountId = async (accountId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const result = await db.query(
    `SELECT t.*, 
            fa.account_number as from_account_number,
            ta.account_number as to_account_number
     FROM transfers t
     JOIN accounts fa ON t.from_account_id = fa.id
     JOIN accounts ta ON t.to_account_id = ta.id
     WHERE t.from_account_id = $1 OR t.to_account_id = $1
     ORDER BY t.created_at DESC
     LIMIT $2 OFFSET $3`,
    [accountId, limit, offset]
  );
  return result.rows;
};

const countByAccountId = async (accountId) => {
  const result = await db.query(
    'SELECT COUNT(*) FROM transfers WHERE from_account_id = $1 OR to_account_id = $1',
    [accountId]
  );
  return parseInt(result.rows[0].count);
};

module.exports = { create, findByAccountId, countByAccountId };