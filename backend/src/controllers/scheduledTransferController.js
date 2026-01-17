const scheduledTransferService = require('../services/scheduledTransferService');

const create = async (req, res, next) => {
  try {
    const { to_account_number, amount, frequency, description, start_date, end_date } = req.body;
    
    const scheduledTransfer = await scheduledTransferService.createScheduledTransfer(
      req.user.userId,
      to_account_number,
      amount,
      frequency,
      description,
      start_date,
      end_date
    );
    
    res.status(201).json({
      message: 'Scheduled transfer created successfully',
      scheduledTransfer,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const scheduledTransfers = await scheduledTransferService.getScheduledTransfers(req.user.userId);
    res.json({ scheduledTransfers });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const scheduledTransfer = await scheduledTransferService.getScheduledTransferDetails(
      req.user.userId,
      req.params.id
    );
    res.json({ scheduledTransfer });
  } catch (error) {
    next(error);
  }
};

const pause = async (req, res, next) => {
  try {
    const scheduledTransfer = await scheduledTransferService.pauseScheduledTransfer(
      req.user.userId,
      req.params.id
    );
    res.json({
      message: 'Scheduled transfer paused',
      scheduledTransfer,
    });
  } catch (error) {
    next(error);
  }
};

const resume = async (req, res, next) => {
  try {
    const scheduledTransfer = await scheduledTransferService.resumeScheduledTransfer(
      req.user.userId,
      req.params.id
    );
    res.json({
      message: 'Scheduled transfer resumed',
      scheduledTransfer,
    });
  } catch (error) {
    next(error);
  }
};

const cancel = async (req, res, next) => {
  try {
    const scheduledTransfer = await scheduledTransferService.cancelScheduledTransfer(
      req.user.userId,
      req.params.id
    );
    res.json({
      message: 'Scheduled transfer cancelled',
      scheduledTransfer,
    });
  } catch (error) {
    next(error);
  }
};

const getExecutions = async (req, res, next) => {
  try {
    const executions = await scheduledTransferService.getExecutionHistory(
      req.user.userId,
      req.params.id
    );
    res.json({ executions });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getAll, getById, pause, resume, cancel, getExecutions };