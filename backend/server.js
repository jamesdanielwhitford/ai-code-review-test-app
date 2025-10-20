const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Initialize Sentry BEFORE other middleware
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
  ],
  // Send structured logs to Sentry
  enableLogs: true,
  // Tracing
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  // Set sampling rate for profiling - this is evaluated only once per SDK.init call
  profileSessionSampleRate: 1.0,
  // Trace lifecycle automatically enables profiling during active traces
  profileLifecycle: 'trace',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  // Environment
  environment: "production",
});

// Sentry request handler must be the first middleware
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// Regular middleware
app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/calculate-conversion', (req, res) => {
  const { conversions, visitors } = req.body;

  // Add span for calculation
  const span = Sentry.startInactiveSpan({
    name: 'calculate-conversion-rate',
    op: 'function',
  });

  try {
    // This is where the bug occurs - division by zero when visitors = 0
    if (visitors === 0) {
      throw new Error('Cannot calculate conversion rate: visitor count is zero. This may indicate a data synchronization issue or tracking misconfiguration.');
    }

    const rate = ((conversions / visitors) * 100).toFixed(2);

    span?.end();

    res.json({ rate: parseFloat(rate) });
  } catch (error) {
    span?.end();

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

// Sentry error handler must be before any other error middleware
app.use(Sentry.Handlers.errorHandler());

// Optional: Additional error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Sentry is ${process.env.SENTRY_DSN ? 'enabled' : 'disabled'}`);
});
