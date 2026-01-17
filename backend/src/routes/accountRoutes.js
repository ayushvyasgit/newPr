const express = require('express');
const accountController = require('../controllers/accountController');
const { authenticate } = require('../middleware/auth');
const { schemas, validate } = require('../utils/validators');

const router = express.Router();

router.use(authenticate);

router.get('/me', accountController.getAccount);
router.post('/deposit', validate(schemas.deposit), accountController.deposit);

module.exports = router;