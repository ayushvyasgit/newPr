const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { email, password, full_name } = req.body;
    const result = await authService.register(email, password, full_name);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    res.json({
      message: 'Login successful',
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };