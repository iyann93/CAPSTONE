'use strict';

const logger = require('../utils/logger');
const response = require('../utils/response');

// eslint-disable-next-line no-unused-vars
const fs = require('fs');
const errorHandler = (err, req, res, next) => {
  try { fs.appendFileSync('error.log', new Date().toISOString() + ' ' + err.stack + '\n'); } catch (e) {}
  logger.error(`${err.message}`, { stack: err.stack, url: req.originalUrl });

  // Validation errors from express-validator (passed as array)
  if (err.type === 'validation') {
    return response.error(res, 422, 'Validation failed', err.errors);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return response.error(res, 401, 'Token tidak valid');
  }
  if (err.name === 'TokenExpiredError') {
    return response.error(res, 401, 'Token sudah kadaluarsa');
  }

  // PostgreSQL unique constraint
  if (err.code === '23505') {
    return response.error(res, 409, 'Data sudah ada (duplikat)');
  }
  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return response.error(res, 409, 'Data ini tidak dapat dihapus karena masih digunakan/direferensikan oleh data lain (misalnya dalam template gaji).');
  }

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Internal Server Error';

  return response.error(res, statusCode, message);
};

module.exports = errorHandler;
