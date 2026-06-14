'use strict';

require('dotenv').config();

const app = require('./src/app');
const { pool } = require('./src/config/db');
const logger = require('./src/utils/logger');
const env = require('./src/config/env');

const PORT = env.port;

const start = async () => {
  try {
    // Verify DB connection before starting HTTP server
    try {
      await pool.query('SELECT 1');
      logger.info('Database connection verified ✓');
    } catch (dbErr) {
      if (env.nodeEnv === 'development') {
        logger.warn('⚠️  Database tidak tersedia — server tetap berjalan dalam mode development.');
        logger.warn('   Pastikan PostgreSQL sudah diinstall dan berjalan untuk fitur DB.');
      } else {
        throw dbErr; // Di production, tetap crash jika DB tidak ada
      }
    }

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} [${env.nodeEnv}]`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
      logger.info(`API base:     http://localhost:${PORT}/api/v1`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.warn(`${signal} received — shutting down gracefully...`);
      server.close(async () => {
        await pool.end();
        logger.info('Database pool closed. Process exiting.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));

    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Rejection:', err.message);
      if (env.nodeEnv === 'production') {
        server.close(() => process.exit(1));
      }
      // In development, log but keep server alive
    });

  } catch (err) {
    logger.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

start();
