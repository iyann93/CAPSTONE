'use strict';

const env = require('../config/env');

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = env.nodeEnv === 'production' ? LEVELS.warn : LEVELS.debug;

const timestamp = () => new Date().toISOString();

const logger = {
  error: (msg, meta = '') => {
    if (currentLevel >= LEVELS.error)
      console.error(`[${timestamp()}] [ERROR] ${msg}`, meta);
  },
  warn: (msg, meta = '') => {
    if (currentLevel >= LEVELS.warn)
      console.warn(`[${timestamp()}] [WARN]  ${msg}`, meta);
  },
  info: (msg, meta = '') => {
    if (currentLevel >= LEVELS.info)
      console.log(`[${timestamp()}] [INFO]  ${msg}`, meta);
  },
  debug: (msg, meta = '') => {
    if (currentLevel >= LEVELS.debug)
      console.log(`[${timestamp()}] [DEBUG] ${msg}`, meta);
  },
  http: (req, res, duration) => {
    if (currentLevel >= LEVELS.info)
      console.log(
        `[${timestamp()}] [HTTP]  ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
      );
  },
};

module.exports = logger;
