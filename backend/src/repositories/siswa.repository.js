'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const SORT_MAP = { nama_lengkap: 's.nama_lengkap', nis: 's.nis', created_at: 's.created_at', tanggal_lahir: 's.tanggal_lahir' };

const SiswaRepository = {
  findAll: async ({ limit, offset, search, sort, kelasId, jenisKelamin, status }) => {
    const wb = whereBuilder();
    wb.addLike(search, ['s.nama_lengkap', 's.nis']);
    wb.addExact(kelasId, 's.kelas_id');
    wb.addExact(jenisKelamin, 's.jenis_kelamin');
    wb.addExact(status, 's.status');
    const { where, values, nextIdx } = wb.build();
    const orderBy = buildOrderBy(sort, SORT_MAP, 's.nama_lengkap ASC');

    const sql = `
      SELECT s.id, s.nis, s.nama_lengkap, s.jenis_kelamin, s.tempat_lahir, s.tanggal_lahir,
             s.alamat, s.status,
             k.nama_kelas, j.nama AS nama_jurusan, s.kelas_id, s.created_at
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
      SELECT s.*, k.nama_kelas, j.nama AS nama_jurusan, j.kode AS kode_jurusan
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

  create: async ({ nis, nisn, nama_lengkap, jenisKelamin, tempatLahir, tanggalLahir, alamat, status, kelasId }) => {
    const sql = `
      INSERT INTO academic.siswa
        (nis, nisn, nama_lengkap, jenis_kelamin, tempat_lahir, tanggal_lahir, alamat, kelas_id, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, 'aktif'), NOW()) RETURNING *
    `;
    const result = await query(sql, [nis, nisn, nama_lengkap, jenisKelamin, tempatLahir, tanggalLahir, alamat, kelasId, status]);
    return result.rows[0];
  },

  update: async (id, { nis, nisn, nama_lengkap, jenisKelamin, tempatLahir, tanggalLahir, alamat, status, kelasId }) => {
    const sql = `
      UPDATE academic.siswa
      SET nis           = COALESCE($1, nis),
          nisn          = COALESCE($2, nisn),
          nama_lengkap  = COALESCE($3, nama_lengkap),
          jenis_kelamin = COALESCE($4, jenis_kelamin),
          tempat_lahir  = COALESCE($5, tempat_lahir),
          tanggal_lahir = COALESCE($6, tanggal_lahir),
          alamat        = COALESCE($7, alamat),
          kelas_id      = COALESCE($8, kelas_id),
          status        = COALESCE($9, status)
      WHERE id = $10 RETURNING *
    `;
    const result = await query(sql, [nis, nisn, nama_lengkap, jenisKelamin, tempatLahir, tanggalLahir, alamat, kelasId, status, id]);
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM academic.siswa WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  },
};

module.exports = SiswaRepository;
