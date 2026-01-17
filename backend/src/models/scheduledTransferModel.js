const db = require('../config/database');

const create = async (fromAccountId, toAccountId, amount, frequency, description, startDate, endDate) => {
  const result = await db.query(
    `INSERT INTO scheduled_transfers (from_account_id, to_account_id, amount, frequency, description, start_date, end_date, next_execution_date) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [fromAccountId, toAccountId, amount, frequency, description, startDate, endDate, startDate]
  );
  return result.rows[0];
};

const findByAccountId = async (accountId) => {
  const result = await db.query(
    `SELECT st.*, 
            fa.account_number as from_account_number,
            ta.account_number as to_account_number
     FROM scheduled_transfers st
     JOIN accounts fa ON st.from_account_id = fa.id
     JOIN accounts ta ON st.to_account_id = ta.id
     WHERE st.from_account_id = $1
     ORDER BY st.created_at DESC`,
    [accountId]
  );
  return result.rows;
};

const findById = async (id) => {
  const result = await db.query(
    `SELECT st.*, 
            fa.account_number as from_account_number,
            ta.account_number as to_account_number
     FROM scheduled_transfers st
     JOIN accounts fa ON st.from_account_id = fa.id
     JOIN accounts ta ON st.to_account_id = ta.id
     WHERE st.id = $1`,
    [id]
  );
  return result.rows[0];
};

const updateStatus = async (id, status) => {
  const result = await db.query(
    'UPDATE scheduled_transfers SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
};

const updateNextExecutionDate = async (id, nextDate) => {
  const result = await db.query(
    'UPDATE scheduled_transfers SET next_execution_date = $1 WHERE id = $2 RETURNING *',
    [nextDate, id]
  );
  return result.rows[0];
};

const findDueTransfers = async () => {
  const result = await db.query(
    `SELECT * FROM scheduled_transfers 
     WHERE status = 'active' 
     AND next_execution_date <= CURRENT_DATE`
  );
  return result.rows;
};

module.exports = {
  create,
  findByAccountId,
  findById,
  updateStatus,
  updateNextExecutionDate,
  findDueTransfers,
};