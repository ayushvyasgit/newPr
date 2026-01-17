const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transferRoutes = require('./routes/transferRoutes');
const scheduledTransferRoutes = require('./routes/scheduledTransferRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
});

app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/scheduled-transfers', scheduledTransferRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use(errorHandler);

module.exports = app;