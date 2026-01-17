const express = require('express');
const scheduledTransferController = require('../controllers/scheduledTransferController');
const { authenticate } = require('../middleware/auth');
const { schemas, validate } = require('../utils/validators');

const router = express.Router();

router.use(authenticate);

router.post('/', validate(schemas.scheduledTransfer), scheduledTransferController.create);
router.get('/', scheduledTransferController.getAll);
router.get('/:id', scheduledTransferController.getById);
router.patch('/:id/pause', scheduledTransferController.pause);
router.patch('/:id/resume', scheduledTransferController.resume);
router.delete('/:id', scheduledTransferController.cancel);
router.get('/:id/executions', scheduledTransferController.getExecutions);

module.exports = router;