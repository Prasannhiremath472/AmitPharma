require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Start listening FIRST — Hostinger health checks need the port open immediately
  const server = app.listen(PORT, () => {
    console.log(`\n Server running on port ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` API Base: http://localhost:${PORT}/api\n`);
  });

  // Test DB connection AFTER server is up — don't crash if DB is temporarily unavailable
  try {
    await testConnection();
    console.log('Database connected successfully\n');
  } catch (error) {
    console.error('WARNING: Database connection failed:', error.message);
    console.error('Server is running but DB-dependent routes will fail.');
    console.error('Check DB_HOST, DB_USER, DB_PASSWORD, DB_NAME environment variables.\n');
    // Do NOT exit — let the server stay up for health checks and debugging
  }

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
    // Force exit after 10s if graceful shutdown fails
    setTimeout(() => process.exit(1), 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err.message);
  // Don't exit — log and continue
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  // Don't exit for non-critical errors
});

startServer();
