const Joi = require('joi');

const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    full_name: Joi.string().min(2).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  deposit: Joi.object({
    amount: Joi.number().positive().required(),
  }),

  transfer: Joi.object({
    to_account_number: Joi.string().required(),
    amount: Joi.number().positive().required(),
    description: Joi.string().allow('').optional(),
  }),

  scheduledTransfer: Joi.object({
    to_account_number: Joi.string().required(),
    amount: Joi.number().positive().required(),
    frequency: Joi.string().valid('daily', 'weekly', 'monthly', 'once').required(),
    description: Joi.string().allow('').optional(),
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().min(Joi.ref('start_date')).optional(),
  }),

  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
  };
};

module.exports = { schemas, validate };