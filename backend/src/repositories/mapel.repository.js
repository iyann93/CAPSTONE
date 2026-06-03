'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const SORT_MAP = { nama: 'm.nama_mapel', kode: 'm.kode_mapel', created_at: 'm.created_at' };

const MapelRepository = {
  findAll: async ({ limit, offset, search, sort, jurusanId, tingkat }) => {
    const wb = whereBuilder();
    wb.addLike(search, ['m.nama_mapel', 'm.kode_mapel']);
    wb.addExact(jurusanId, 'm.jurusan_id');
    wb.addExact(tingkat, 'm.tingkat');
    const { where, values, nextIdx } = wb.build();
    const orderBy = buildOrderBy(sort, SORT_MAP, 'm.nama_mapel ASC');

    const sql = `
      SELECT m.id, m.kode_mapel, m.nama_mapel, m.tingkat, m.deskripsi,
             m.jurusan_id, j.nama_jurusan, m.created_at
      FROM academic.mapel m
      LEFT JOIN academic.jurusan j ON m.jurusan_id = j.id
      ${where}
      ${orderBy}
      LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
    `;
    const countSql = `
      SELECT COUNT(*) FROM academic.mapel m
      LEFT JOIN academic.jurusan j ON m.jurusan_id = j.id
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
      SELECT m.*, j.nama_jurusan FROM academic.mapel m
      LEFT JOIN academic.jurusan j ON m.jurusan_id = j.id
      WHERE m.id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  findByKode: async (kode, excludeId = null) => {
    const sql = excludeId
      ? 'SELECT id FROM academic.mapel WHERE kode_mapel = $1 AND id != $2'
      : 'SELECT id FROM academic.mapel WHERE kode_mapel = $1';
    const result = await query(sql, excludeId ? [kode, excludeId] : [kode]);
    return result.rows[0] || null;
  },

  create: async ({ kodeMapel, namaMapel, tingkat, deskripsi, jurusanId }) => {
    const sql = `
      INSERT INTO academic.mapel (kode_mapel, nama_mapel, tingkat, deskripsi, jurusan_id, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *
    `;
    const result = await query(sql, [kodeMapel, namaMapel, tingkat, deskripsi, jurusanId]);
    return result.rows[0];
  },

  update: async (id, { kodeMapel, namaMapel, tingkat, deskripsi, jurusanId }) => {
    const sql = `
      UPDATE academic.mapel
      SET kode_mapel  = COALESCE($1, kode_mapel),
          nama_mapel  = COALESCE($2, nama_mapel),
          tingkat     = COALESCE($3, tingkat),
          deskripsi   = COALESCE($4, deskripsi),
          jurusan_id  = COALESCE($5, jurusan_id)
      WHERE id = $6 RETURNING *
    `;
    const result = await query(sql, [kodeMapel, namaMapel, tingkat, deskripsi, jurusanId, id]);
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM academic.mapel WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  },
};

module.exports = MapelRepository;
