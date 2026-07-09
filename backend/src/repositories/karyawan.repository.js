'use strict';

const { query } = require('../config/db');

const KaryawanRepository = {
  findAll: async ({ limit = 20, offset = 0 }) => {
    const sql = `
      SELECT id, nip, nama, jenis_kelamin, tanggal_lahir,
             alamat, no_telepon, email, jabatan, departemen, is_active, created_at
      FROM academic.karyawan
      ORDER BY nama ASC
      LIMIT $1 OFFSET $2
    `;
    const countSql = `SELECT COUNT(*) FROM academic.karyawan`;
    const [data, count] = await Promise.all([query(sql, [limit, offset]), query(countSql)]);
    return { rows: data.rows, total: parseInt(count.rows[0].count, 10) };
  },

  findById: async (id) => {
    const result = await query('SELECT * FROM academic.karyawan WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  findByNip: async (nip) => {
    const result = await query('SELECT id FROM academic.karyawan WHERE nip = $1', [nip]);
    return result.rows[0] || null;
  },

  create: async ({ nip, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, jabatan, departemen }) => {
    const sql = `
      INSERT INTO academic.karyawan
        (nip, nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email, jabatan, departemen, is_active, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, NOW())
      RETURNING *
    `;
    const result = await query(sql, [nip, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, jabatan, departemen]);
    return result.rows[0];
  },

  update: async (id, { nip, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, jabatan, departemen, isActive }) => {
    const sql = `
      UPDATE academic.karyawan
      SET nip           = COALESCE($1, nip),
          nama          = COALESCE($2, nama),
          jenis_kelamin = COALESCE($3, jenis_kelamin),
          tanggal_lahir = COALESCE($4, tanggal_lahir),
          alamat        = COALESCE($5, alamat),
          no_telepon    = COALESCE($6, no_telepon),
          email         = COALESCE($7, email),
          jabatan       = COALESCE($8, jabatan),
          departemen    = COALESCE($9, departemen),
          is_active     = COALESCE($10, is_active)
      WHERE id = $11
      RETURNING *
    `;
    const result = await query(sql, [nip, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, jabatan, departemen, isActive, id]);
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM academic.karyawan WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  },
};

module.exports = KaryawanRepository;
