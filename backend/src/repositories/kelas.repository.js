'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const SORT_MAP = { nama: 'k.nama_kelas', tingkat: 'k.tingkat', tahun_ajaran: 'k.tahun_ajaran', created_at: 'k.created_at' };

const KelasRepository = {
  findAll: async ({ limit, offset, search, sort, jurusanId, tingkat }) => {
    const wb = whereBuilder();
    wb.addLike(search, ['k.nama_kelas']);
    wb.addExact(jurusanId, 'k.jurusan_id');
    wb.addExact(tingkat, 'k.tingkat');
    const { where, values, nextIdx } = wb.build();
    const orderBy = buildOrderBy(sort, SORT_MAP, 'k.tingkat ASC, k.nama_kelas ASC');

    const sql = `
      SELECT k.id, k.nama_kelas, k.tingkat, k.tahun_ajaran,
             j.nama_jurusan, j.kode_jurusan, k.jurusan_id, k.created_at
      FROM academic.kelas k
      LEFT JOIN academic.jurusan j ON k.jurusan_id = j.id
      ${where}
      ${orderBy}
      LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
    `;
    const countSql = `SELECT COUNT(*) FROM academic.kelas k LEFT JOIN academic.jurusan j ON k.jurusan_id = j.id ${where}`;

    const [data, count] = await Promise.all([
      query(sql, [...values, limit, offset]),
      query(countSql, values),
    ]);
    return { rows: data.rows, total: parseInt(count.rows[0].count, 10) };
  },

  findById: async (id) => {
    const sql = `
      SELECT k.*, j.nama_jurusan, j.kode_jurusan
      FROM academic.kelas k LEFT JOIN academic.jurusan j ON k.jurusan_id = j.id
      WHERE k.id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  create: async ({ namaKelas, tingkat, tahunAjaran, jurusanId }) => {
    const sql = `
      INSERT INTO academic.kelas (nama_kelas, tingkat, tahun_ajaran, jurusan_id, created_at)
      VALUES ($1, $2, $3, $4, NOW()) RETURNING *
    `;
    const result = await query(sql, [namaKelas, tingkat, tahunAjaran, jurusanId]);
    return result.rows[0];
  },

  update: async (id, { namaKelas, tingkat, tahunAjaran, jurusanId }) => {
    const sql = `
      UPDATE academic.kelas
      SET nama_kelas   = COALESCE($1, nama_kelas),
          tingkat      = COALESCE($2, tingkat),
          tahun_ajaran = COALESCE($3, tahun_ajaran),
          jurusan_id   = COALESCE($4, jurusan_id)
      WHERE id = $5 RETURNING *
    `;
    const result = await query(sql, [namaKelas, tingkat, tahunAjaran, jurusanId, id]);
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM academic.kelas WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  },
};

module.exports = KelasRepository;
