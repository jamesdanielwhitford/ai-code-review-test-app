// IMPORTANT: Import instrument.js first for automatic instrumentation
require('./instrument.js');

const Sentry = require("@sentry/node");
const express = require('express');
const cors = require('cors');

const app = express();

// Regular middleware
app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/calculate-conversion', (req, res) => {
  const { conversions, visitors } = req.body;

  try {
    // This is where the bug occurs - division by zero when visitors = 0
    if (visitors === 0) {
      throw new Error('Cannot calculate conversion rate: visitor count is zero. This may indicate a data synchronization issue or tracking misconfiguration.');
    }

    const rate = ((conversions / visitors) * 100).toFixed(2);
    res.json({ rate: parseFloat(rate) });
  } catch (error) {
    // Capture error in Sentry with additional context
    Sentry.captureException(error, {
      tags: {
        endpoint: 'calculate-conversion',
        error_type: 'division_by_zero',
      },
      extra: {
        conversions,
        visitors,
      },
    });

    res.status(400).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Sentry error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Sentry is ${process.env.SENTRY_DSN ? 'enabled' : 'disabled'}`);
});
