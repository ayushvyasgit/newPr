const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const accountModel = require('../models/accountModel');
const { generateAccountNumber } = require('../utils/accountGenerator');

const register = async (email, password, fullName) => {
  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.create(email, passwordHash, fullName);

  const accountNumber = generateAccountNumber();
  await accountModel.create(user.id, accountNumber);

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { user, token };
};

const login = async (email, password) => {
  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  delete user.password_hash;
  return { user, token };
};

module.exports = { register, login };