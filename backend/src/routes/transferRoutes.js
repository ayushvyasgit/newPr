const express = require('express');
const transferController = require('../controllers/transferController');
const { authenticate } = require('../middleware/auth');
const { schemas, validate } = require('../utils/validators');

const router = express.Router();

router.use(authenticate);

router.post('/', validate(schemas.transfer), transferController.createTransfer);
router.get('/history', transferController.getTransactionHistory);

module.exports = router;