require('dotenv').config();
const app = require('./app');
const { startScheduledTransferJob } = require('./jobs/scheduledTransferJob');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startScheduledTransferJob();
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});