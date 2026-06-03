'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const SORT_MAP = { nama: 'j.nama_jurusan', kode: 'j.kode_jurusan', created_at: 'j.created_at' };

const JurusanRepository = {
  findAll: async ({ limit, offset, search, sort }) => {
    const wb = whereBuilder();
    wb.addLike(search, ['j.nama_jurusan', 'j.kode_jurusan']);
    const { where, values, nextIdx } = wb.build();
    const orderBy = buildOrderBy(sort, SORT_MAP, 'j.nama_jurusan ASC');

    const sql = `
      SELECT j.id, j.kode_jurusan, j.nama_jurusan, j.kepala_jurusan, j.created_at
      FROM academic.jurusan j
      ${where}
      ${orderBy}
      LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
    `;
    const countSql = `SELECT COUNT(*) FROM academic.jurusan j ${where}`;

    const [data, count] = await Promise.all([
      query(sql, [...values, limit, offset]),
      query(countSql, values),
    ]);
    return { rows: data.rows, total: parseInt(count.rows[0].count, 10) };
  },

  findById: async (id) => {
    const result = await query('SELECT * FROM academic.jurusan WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  findByKode: async (kode, excludeId = null) => {
    const sql = excludeId
      ? 'SELECT id FROM academic.jurusan WHERE kode_jurusan = $1 AND id != $2'
      : 'SELECT id FROM academic.jurusan WHERE kode_jurusan = $1';
    const params = excludeId ? [kode, excludeId] : [kode];
    const result = await query(sql, params);
    return result.rows[0] || null;
  },

  create: async ({ kodeJurusan, namaJurusan, kepalaJurusan }) => {
    const sql = `
      INSERT INTO academic.jurusan (kode_jurusan, nama_jurusan, kepala_jurusan, created_at)
      VALUES ($1, $2, $3, NOW()) RETURNING *
    `;
    const result = await query(sql, [kodeJurusan, namaJurusan, kepalaJurusan]);
    return result.rows[0];
  },

  update: async (id, { kodeJurusan, namaJurusan, kepalaJurusan }) => {
    const sql = `
      UPDATE academic.jurusan
      SET kode_jurusan   = COALESCE($1, kode_jurusan),
          nama_jurusan   = COALESCE($2, nama_jurusan),
          kepala_jurusan = COALESCE($3, kepala_jurusan)
      WHERE id = $4 RETURNING *
    `;
    const result = await query(sql, [kodeJurusan, namaJurusan, kepalaJurusan, id]);
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM academic.jurusan WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  },
};

module.exports = JurusanRepository;
