const accountService = require('../services/accountService');

const getAccount = async (req, res, next) => {
  try {
    const account = await accountService.getAccountByUserId(req.user.userId);
    res.json({ account });
  } catch (error) {
    next(error);
  }
};

const deposit = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const account = await accountService.deposit(req.user.userId, amount);
    
    res.json({
      message: 'Deposit successful',
      account,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAccount, deposit };