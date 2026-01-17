const db = require('../config/database');

const create = async (client, scheduledTransferId, transferId, status, errorMessage = null) => {
  const result = await client.query(
    `INSERT INTO scheduled_transfer_executions (scheduled_transfer_id, transfer_id, execution_date, status, error_message) 
     VALUES ($1, $2, NOW(), $3, $4) RETURNING *`,
    [scheduledTransferId, transferId, status, errorMessage]
  );
  return result.rows[0];
};

const findByScheduledTransferId = async (scheduledTransferId) => {
  const result = await db.query(
    `SELECT e.*, t.amount, t.status as transfer_status
     FROM scheduled_transfer_executions e
     LEFT JOIN transfers t ON e.transfer_id = t.id
     WHERE e.scheduled_transfer_id = $1
     ORDER BY e.execution_date DESC`,
    [scheduledTransferId]
  );
  return result.rows;
};

module.exports = { create, findByScheduledTransferId };