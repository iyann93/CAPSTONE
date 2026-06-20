'use strict';

const { query, getClient } = require('../config/db');

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
      SELECT p.id, p.nama_permission, p.modul, p.aksi
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
  },

  // === ALL USERS (CRUD) ===
  getAllUsers: async (filters = {}) => {
    const sql = `
      SELECT u.id, u.nama as name, u.email, u.is_active, u.created_at, u.last_login_at as "lastLogin",
             COALESCE(u.email, u.nama) as user,
             STRING_AGG(r.nama_role, ', ') as role,
             j.nama as nama_jabatan
      FROM shared.users u
      LEFT JOIN shared.user_roles ur ON u.id = ur.user_id
      LEFT JOIN shared.roles r ON ur.role_id = r.id
      LEFT JOIN shared.jabatan j ON u.jabatan_id = j.id
      GROUP BY u.id, j.nama
      ORDER BY u.created_at DESC
    `;
    const res = await query(sql);
    return res.rows;
  },

  createUserWithRole: async ({ nama, email, passwordHash, roleId }) => {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      const insertUser = `
        INSERT INTO shared.users (nama, email, password_hash, is_active, created_at)
        VALUES ($1, $2, $3, true, NOW())
        RETURNING id
      `;
      const resUser = await client.query(insertUser, [nama, email, passwordHash]);
      const newUserId = resUser.rows[0].id;

      if (roleId) {
        const insertRole = `INSERT INTO shared.user_roles (user_id, role_id) VALUES ($1, $2)`;
        await client.query(insertRole, [newUserId, roleId]);
      }

      await client.query('COMMIT');
      return { id: newUserId };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  updateUserWithRole: async (userId, { nama, email, roleId, isActive }) => {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      const updateUser = `
        UPDATE shared.users 
        SET nama = COALESCE($1, nama),
            email = COALESCE($2, email),
            is_active = COALESCE($3, is_active)
        WHERE id = $4
      `;
      await client.query(updateUser, [nama, email, isActive, userId]);

      if (roleId !== undefined) {
        await client.query(`DELETE FROM shared.user_roles WHERE user_id = $1`, [userId]);
        if (roleId) {
          await client.query(`INSERT INTO shared.user_roles (user_id, role_id) VALUES ($1, $2)`, [userId, roleId]);
        }
      }

      await client.query('COMMIT');
      return { id: userId };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  deleteUser: async (userId) => {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM shared.user_roles WHERE user_id = $1', [userId]);
      await client.query('DELETE FROM shared.users WHERE id = $1', [userId]);
      await client.query('COMMIT');
      return true;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
};

module.exports = SystemRepository;
