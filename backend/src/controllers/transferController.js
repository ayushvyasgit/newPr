const transferService = require('../services/transferService');

const createTransfer = async (req, res, next) => {
  try {
    const { to_account_number, amount, description } = req.body;
    const transfer = await transferService.createTransfer(
      req.user.userId,
      to_account_number,
      amount,
      description
    );
    
    res.status(201).json({
      message: 'Transfer successful',
      transfer,
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await transferService.getTransactionHistory(
      req.user.userId,
      page,
      limit
    );
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { createTransfer, getTransactionHistory };