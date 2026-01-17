const db = require('../config/database');

const create = async (email, passwordHash, fullName) => {
  const result = await db.query(
    'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name, created_at',
    [email, passwordHash, fullName]
  );
  return result.rows[0];
};

const findByEmail = async (email) => {
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await db.query(
    'SELECT id, email, full_name, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

module.exports = { create, findByEmail, findById };