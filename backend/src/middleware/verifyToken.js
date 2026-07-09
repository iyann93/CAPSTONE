'use strict';

const { verifyAccessToken } = require('../utils/jwt');
const { query } = require('../config/db');
const response = require('../utils/response');

/**
 * Middleware: Verify JWT Access Token from Authorization header.
 * Sets req.user = { userId, email, nama, role } on success.
 * Role selalu diambil dari DB agar token lama tetap berfungsi.
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.error(res, 401, 'Akses ditolak. Token tidak ditemukan.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    // Selalu ambil role terbaru dari DB (tidak bergantung pada isi token)
    const roleRes = await query(
      `SELECT r.nama_role FROM shared.user_roles ur
       JOIN shared.roles r ON ur.role_id = r.id
       WHERE ur.user_id = $1 LIMIT 1`,
      [decoded.userId]
    );

    req.user = {
      ...decoded,
      role: roleRes.rows[0]?.nama_role || decoded.role || null
    };

    next();
  } catch (err) {
    return next(err);
  }
};

module.exports = verifyToken;
