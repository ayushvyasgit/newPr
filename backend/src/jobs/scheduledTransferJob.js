const cron = require('node-cron');
const scheduledTransferModel = require('../models/scheduledTransferModel');
const scheduledTransferService = require('../services/scheduledTransferService');

const executeScheduledTransfers = async () => {
  try {
    console.log('Running scheduled transfer job...');
    
    const dueTransfers = await scheduledTransferModel.findDueTransfers();
    
    console.log(`Found ${dueTransfers.length} due transfers`);

    for (const transfer of dueTransfers) {
      try {
        await scheduledTransferService.executeScheduledTransfer(transfer);
        console.log(`Executed scheduled transfer ${transfer.id}`);
      } catch (error) {
        console.error(`Failed to execute scheduled transfer ${transfer.id}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Scheduled transfer job error:', error);
  }
};

const startScheduledTransferJob = () => {
  cron.schedule('* * * * *', executeScheduledTransfers);
  console.log('Scheduled transfer job started (runs every minute)');
};

module.exports = { startScheduledTransferJob };