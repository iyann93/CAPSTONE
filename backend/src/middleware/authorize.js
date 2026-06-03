'use strict';

const { query } = require('../config/db');
const response = require('../utils/response');

/**
 * RBAC Middleware Factory.
 * Checks if the authenticated user has the required permission code.
 * Permissions are fetched from DB — never hardcoded.
 *
 * @param {string} permissionCode - e.g. 'pengumuman.create'
 * @returns {Function} Express middleware
 *
 * @example
 * router.post('/pengumuman', verifyToken, authorize('pengumuman.create'), controller.create);
 */
const authorize = (permissionCode) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return response.error(res, 401, 'Akses ditolak. User tidak terautentikasi.');
      }

      // Fetch all permission codes assigned to user via their roles
      const sql = `
        SELECT DISTINCT p.code
        FROM shared.permissions p
        INNER JOIN shared.role_permissions rp ON rp.permission_id = p.id
        INNER JOIN shared.user_roles ur ON ur.role_id = rp.role_id
        WHERE ur.user_id = $1
      `;
      const result = await query(sql, [userId]);

      const userPermissions = result.rows.map((r) => r.code);

      if (!userPermissions.includes(permissionCode)) {
        return response.error(
          res,
          403,
          `Akses ditolak. Permission '${permissionCode}' tidak dimiliki.`
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = authorize;
