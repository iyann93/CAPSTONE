'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const SORT_MAP = { nama: 'g.nama_lengkap', nip: 'g.nip', created_at: 'g.created_at', mata_pelajaran: 'g.jabatan_tugas' };

const GuruRepository = {
  findAll: async ({ limit, offset, search, sort, jenisKelamin, isActive }) => {
    const wb = whereBuilder();
    wb.addLike(search, ['g.nama_lengkap', 'g.nip', 'g.email_pribadi', 'g.jabatan_tugas']);
    wb.addExact(jenisKelamin, 'g.jenis_kelamin');
    // wb.addBool(isActive, 'g.is_active'); // Not in schema
    const { where, values, nextIdx } = wb.build();
    const orderBy = buildOrderBy(sort, SORT_MAP, 'g.nama_lengkap ASC');

    const sql = `
      SELECT id, nip, nama_lengkap as nama, jenis_kelamin, tanggal_lahir,
             alamat, no_telepon, email_pribadi as email, jabatan_tugas as mata_pelajaran, true as is_active, created_at
      FROM academic.guru g
      ${where}
      ${orderBy}
      LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
    `;
    const countSql = `SELECT COUNT(*) FROM academic.guru g ${where}`;

    const [data, count] = await Promise.all([
      query(sql, [...values, limit, offset]),
      query(countSql, values),
    ]);
    return { rows: data.rows, total: parseInt(count.rows[0].count, 10) };
  },

  findById: async (id) => {
    const result = await query('SELECT id, nip, nama_lengkap as nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email_pribadi as email, jabatan_tugas as mata_pelajaran, true as is_active, created_at FROM academic.guru WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  findByNip: async (nip, excludeId = null) => {
    const sql = excludeId
      ? 'SELECT id FROM academic.guru WHERE nip = $1 AND id != $2'
      : 'SELECT id FROM academic.guru WHERE nip = $1';
    const result = await query(sql, excludeId ? [nip, excludeId] : [nip]);
    return result.rows[0] || null;
  },

  create: async ({ nip, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, mataPelajaran }) => {
    const sql = `
      INSERT INTO academic.guru
        (nip, nama_lengkap, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email_pribadi, jabatan_tugas, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING id, nip, nama_lengkap as nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email_pribadi as email, jabatan_tugas as mata_pelajaran, true as is_active, created_at
    `;
    const result = await query(sql, [nip, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, mataPelajaran]);
    return result.rows[0];
  },

  update: async (id, { nip, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, mataPelajaran, isActive }) => {
    const sql = `
      UPDATE academic.guru
      SET nip            = COALESCE($1, nip),
          nama_lengkap   = COALESCE($2, nama_lengkap),
          jenis_kelamin  = COALESCE($3, jenis_kelamin),
          tanggal_lahir  = COALESCE($4, tanggal_lahir),
          alamat         = COALESCE($5, alamat),
          no_telepon     = COALESCE($6, no_telepon),
          email_pribadi  = COALESCE($7, email_pribadi),
          jabatan_tugas  = COALESCE($8, jabatan_tugas)
      WHERE id = $9 RETURNING id, nip, nama_lengkap as nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email_pribadi as email, jabatan_tugas as mata_pelajaran, true as is_active, created_at
    `;
    const result = await query(sql, [nip, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, mataPelajaran, id]);
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM academic.guru WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  },
};

module.exports = GuruRepository;
