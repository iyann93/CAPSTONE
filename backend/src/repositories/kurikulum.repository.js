'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const SORT_MAP = { nama: 'k.nama_kurikulum', kode: 'k.kode_kurikulum', status: 'k.status' };

const KurikulumRepository = {
  findAll: async ({ limit, offset, search, sort, tahunAjaranId, status }) => {
    const wb = whereBuilder();
    wb.addLike(search, ['k.nama_kurikulum', 'k.kode_kurikulum']);
    wb.addExact(tahunAjaranId, 'k.tahun_ajaran_id');
    wb.addExact(status, 'k.status');
    const { where, values, nextIdx } = wb.build();
    const orderBy = buildOrderBy(sort, SORT_MAP, 'k.created_at DESC');

    const sql = `
      SELECT k.id, k.kode_kurikulum, k.nama_kurikulum, k.tahun_ajaran_id, k.status, k.deskripsi, k.created_at, k.updated_at,
             ta.nama AS tahun_ajaran_nama
      FROM academic.kurikulum k
      LEFT JOIN academic.tahun_ajaran ta ON k.tahun_ajaran_id = ta.id
      ${where}
      ${orderBy}
      LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
    `;
    const countSql = `SELECT COUNT(*) FROM academic.kurikulum k ${where}`;

    const [data, count] = await Promise.all([
      query(sql, [...values, limit, offset]),
      query(countSql, values),
    ]);
    return { rows: data.rows, total: parseInt(count.rows[0].count, 10) };
  },

  findById: async (id) => {
    const sql = `
      SELECT k.*, ta.nama AS tahun_ajaran_nama
      FROM academic.kurikulum k
      LEFT JOIN academic.tahun_ajaran ta ON k.tahun_ajaran_id = ta.id
      WHERE k.id = $1
    `;
    const res = await query(sql, [id]);
    return res.rows[0];
  },

  create: async (data) => {
    const sql = `
      INSERT INTO academic.kurikulum (kode_kurikulum, nama_kurikulum, tahun_ajaran_id, status, deskripsi)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [data.kode_kurikulum, data.nama_kurikulum, data.tahun_ajaran_id, data.status, data.deskripsi];
    const res = await query(sql, values);
    return res.rows[0];
  },

  update: async (id, data) => {
    const sql = `
      UPDATE academic.kurikulum
      SET kode_kurikulum = COALESCE($1, kode_kurikulum),
          nama_kurikulum = COALESCE($2, nama_kurikulum),
          tahun_ajaran_id = COALESCE($3, tahun_ajaran_id),
          status = COALESCE($4, status),
          deskripsi = COALESCE($5, deskripsi),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;
    const values = [data.kode_kurikulum, data.nama_kurikulum, data.tahun_ajaran_id, data.status, data.deskripsi, id];
    const res = await query(sql, values);
    return res.rows[0];
  },

  delete: async (id) => {
    const res = await query('DELETE FROM academic.kurikulum WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
  },

  findByStatusAndTahunAjaran: async (status, tahunAjaranId) => {
    const sql = `SELECT * FROM academic.kurikulum WHERE status = $1 AND tahun_ajaran_id = $2`;
    const res = await query(sql, [status, tahunAjaranId]);
    return res.rows;
  },

  findByKode: async (kode, excludeId = null) => {
    const sql = excludeId
      ? 'SELECT id FROM academic.kurikulum WHERE kode_kurikulum = $1 AND id != $2'
      : 'SELECT id FROM academic.kurikulum WHERE kode_kurikulum = $1';
    const res = await query(sql, excludeId ? [kode, excludeId] : [kode]);
    return res.rows[0];
  }
};

module.exports = KurikulumRepository;
