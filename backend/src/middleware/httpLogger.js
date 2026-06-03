'use strict';

const logger = require('../utils/logger');

/**
 * HTTP request logger middleware.
 * Logs method, URL, status code and response time.
 */
const httpLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(req, res, duration);
  });
  next();
};

module.exports = httpLogger;
