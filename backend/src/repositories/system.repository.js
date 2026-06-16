'use strict';

const { query } = require('../config/db');

const SystemRepository = {
  // === AUDIT LOGS ===
  getAuditLogs: async (filters = {}) => {
    let sql = `
      SELECT a.*, u.nama as user_name, u.email as user_email
      FROM shared.audit_log a
      LEFT JOIN shared.users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramIdx = 1;

    if (filters.modul) {
      sql += ` AND a.modul = $${paramIdx++}`;
      params.push(filters.modul);
    }
    
    // Default order by latest
    sql += ` ORDER BY a.created_at DESC LIMIT 100`;

    const res = await query(sql, params);
    return res.rows;
  },

  // === RBAC / ROLES ===
  getAllRoles: async () => {
    const sql = `
      SELECT r.*, COUNT(ur.user_id) as users_count
      FROM shared.roles r
      LEFT JOIN shared.user_roles ur ON r.id = ur.role_id
      GROUP BY r.id
      ORDER BY r.nama_role ASC
    `;
    const res = await query(sql);
    return res.rows;
  },

  getPermissionsForRole: async (roleId) => {
    const sql = `
      SELECT p.id, p.nama_permission, p.deskripsi
      FROM shared.permissions p
      JOIN shared.role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = $1
    `;
    const res = await query(sql, [roleId]);
    return res.rows;
  },

  // === USERS FOR ACTIVATION ===
  getPendingUsers: async () => {
    // is_active = false
    const sql = `
      SELECT u.id, u.nama, u.email, u.created_at, u.is_active,
             STRING_AGG(r.nama_role, ', ') as roles
      FROM shared.users u
      LEFT JOIN shared.user_roles ur ON u.id = ur.user_id
      LEFT JOIN shared.roles r ON ur.role_id = r.id
      WHERE u.is_active = false
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `;
    const res = await query(sql);
    return res.rows;
  },

  updateUserStatus: async (userId, isActive) => {
    const sql = `UPDATE shared.users SET is_active = $1 WHERE id = $2 RETURNING *`;
    const res = await query(sql, [isActive, userId]);
    return res.rows[0];
  }
};

module.exports = SystemRepository;
