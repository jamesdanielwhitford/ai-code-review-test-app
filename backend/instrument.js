const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");
require('dotenv').config();

// Initialize Sentry - MUST be done before requiring any other packages
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
    // httpIntegration and expressIntegration are automatically enabled in v8
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
