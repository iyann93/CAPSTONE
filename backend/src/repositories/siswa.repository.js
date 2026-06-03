'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const SORT_MAP = { nama: 's.nama', nis: 's.nis', created_at: 's.created_at', tanggal_lahir: 's.tanggal_lahir' };

const SiswaRepository = {
  findAll: async ({ limit, offset, search, sort, kelasId, jenisKelamin, isActive }) => {
    const wb = whereBuilder();
    wb.addLike(search, ['s.nama', 's.nis', 's.email']);
    wb.addExact(kelasId, 's.kelas_id');
    wb.addExact(jenisKelamin, 's.jenis_kelamin');
    wb.addBool(isActive, 's.is_active');
    const { where, values, nextIdx } = wb.build();
    const orderBy = buildOrderBy(sort, SORT_MAP, 's.nama ASC');

    const sql = `
      SELECT s.id, s.nis, s.nama, s.jenis_kelamin, s.tanggal_lahir,
             s.alamat, s.no_telepon, s.email, s.is_active,
             k.nama_kelas, j.nama_jurusan, s.kelas_id, s.created_at
      FROM academic.siswa s
      LEFT JOIN academic.kelas k ON s.kelas_id = k.id
      LEFT JOIN academic.jurusan j ON k.jurusan_id = j.id
      ${where}
      ${orderBy}
      LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
    `;
    const countSql = `
      SELECT COUNT(*) FROM academic.siswa s
      LEFT JOIN academic.kelas k ON s.kelas_id = k.id
      LEFT JOIN academic.jurusan j ON k.jurusan_id = j.id
      ${where}
    `;
    const [data, count] = await Promise.all([
      query(sql, [...values, limit, offset]),
      query(countSql, values),
    ]);
    return { rows: data.rows, total: parseInt(count.rows[0].count, 10) };
  },

  findById: async (id) => {
    const sql = `
      SELECT s.*, k.nama_kelas, j.nama_jurusan, j.kode_jurusan
      FROM academic.siswa s
      LEFT JOIN academic.kelas k ON s.kelas_id = k.id
      LEFT JOIN academic.jurusan j ON k.jurusan_id = j.id
      WHERE s.id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  findByNis: async (nis, excludeId = null) => {
    const sql = excludeId
      ? 'SELECT id FROM academic.siswa WHERE nis = $1 AND id != $2'
      : 'SELECT id FROM academic.siswa WHERE nis = $1';
    const result = await query(sql, excludeId ? [nis, excludeId] : [nis]);
    return result.rows[0] || null;
  },

  create: async ({ nis, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, kelasId }) => {
    const sql = `
      INSERT INTO academic.siswa
        (nis, nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email, kelas_id, is_active, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW()) RETURNING *
    `;
    const result = await query(sql, [nis, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, kelasId]);
    return result.rows[0];
  },

  update: async (id, { nis, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, kelasId, isActive }) => {
    const sql = `
      UPDATE academic.siswa
      SET nis           = COALESCE($1, nis),
          nama          = COALESCE($2, nama),
          jenis_kelamin = COALESCE($3, jenis_kelamin),
          tanggal_lahir = COALESCE($4, tanggal_lahir),
          alamat        = COALESCE($5, alamat),
          no_telepon    = COALESCE($6, no_telepon),
          email         = COALESCE($7, email),
          kelas_id      = COALESCE($8, kelas_id),
          is_active     = COALESCE($9, is_active)
      WHERE id = $10 RETURNING *
    `;
    const result = await query(sql, [nis, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, kelasId, isActive, id]);
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM academic.siswa WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  },
};

module.exports = SiswaRepository;
