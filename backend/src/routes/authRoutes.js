const express = require('express');
const authController = require('../controllers/authController');
const { schemas, validate } = require('../utils/validators');

const router = express.Router();

router.post('/register', validate(schemas.register), authController.register);
router.post('/login', validate(schemas.login), authController.login);

module.exports = router;