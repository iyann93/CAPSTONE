'use strict';

const { verifyAccessToken } = require('../utils/jwt');
const response = require('../utils/response');

/**
 * Middleware: Verify JWT Access Token from Authorization header.
 * Sets req.user = { userId, email, nama } on success.
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.error(res, 401, 'Akses ditolak. Token tidak ditemukan.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    req.user = decoded; // { userId, email, nama, iat, exp }
    next();
  } catch (err) {
    return next(err); // Handled by errorHandler (JWT errors)
  }
};

module.exports = verifyToken;
