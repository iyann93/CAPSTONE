'use strict';

const { query, getClient } = require('../config/db');

const UsersRepository = {
  findAll: async ({ limit = 20, offset = 0 }) => {
    const sql = `
      SELECT id, nama, email, no_telepon, alamat_lengkap, is_active, created_at, last_login_at
      FROM shared.users
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const countSql = `SELECT COUNT(*) FROM shared.users`;
    const [data, count] = await Promise.all([query(sql, [limit, offset]), query(countSql)]);
    return { rows: data.rows, total: parseInt(count.rows[0].count, 10) };
  },

  findById: async (id) => {
    const sql = `
      SELECT id, nama, email, no_telepon, alamat_lengkap, is_active, created_at, last_login_at
      FROM shared.users WHERE id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  findByEmail: async (email) => {
    const result = await query('SELECT id FROM shared.users WHERE email = $1', [email]);
    return result.rows[0] || null;
  },

  create: async ({ nama, email, passwordHash, noTelepon, alamatLengkap }) => {
    const sql = `
      INSERT INTO shared.users (nama, email, password_hash, no_telepon, alamat_lengkap, is_active, created_at)
      VALUES ($1, $2, $3, $4, $5, true, NOW())
      RETURNING id, nama, email, no_telepon, alamat_lengkap, is_active, created_at
    `;
    const result = await query(sql, [nama, email, passwordHash, noTelepon, alamatLengkap]);
    return result.rows[0];
  },

  update: async (id, { nama, noTelepon, alamatLengkap, isActive }) => {
    const sql = `
      UPDATE shared.users
      SET nama = COALESCE($1, nama),
          no_telepon = COALESCE($2, no_telepon),
          alamat_lengkap = COALESCE($3, alamat_lengkap),
          is_active = COALESCE($4, is_active)
      WHERE id = $5
      RETURNING id, nama, email, no_telepon, alamat_lengkap, is_active
    `;
    const result = await query(sql, [nama, noTelepon, alamatLengkap, isActive, id]);
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM shared.users WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  },
};

module.exports = UsersRepository;
