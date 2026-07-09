'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const SORT_MAP = { nama: 'm.nama', kode: 'm.kode', kelompok: 'm.kelompok' };

const MapelRepository = {
  findAll: async ({ limit, offset, search, sort, kelompok, tingkat }) => {
    const wb = whereBuilder();
    wb.addLike(search, ['m.nama', 'm.kode']);
    wb.addExact(kelompok, 'm.kelompok');
    wb.addExact(tingkat, 'm.tingkat');
    if (arguments[0].kurikulum_id) wb.addExact(arguments[0].kurikulum_id, 'm.kurikulum_id');
    const { where, values, nextIdx } = wb.build();
    const orderBy = buildOrderBy(sort, SORT_MAP, 'm.kelompok ASC, m.nama ASC');

    const sql = `
      SELECT m.id, m.kode, m.nama, m.kelompok, m.kkm, m.jumlah_jam, m.tingkat, m.guru_pengampu_id, m.kurikulum_id,
             g.nama_lengkap as guru_nama
      FROM academic.mata_pelajaran m
      LEFT JOIN academic.guru g ON m.guru_pengampu_id = g.id
      ${where}
      ${orderBy}
      LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
    `;
    const countSql = `SELECT COUNT(*) FROM academic.mata_pelajaran m ${where}`;

    const [data, count] = await Promise.all([
      query(sql, [...values, limit, offset]),
      query(countSql, values),
    ]);
    return { rows: data.rows, total: parseInt(count.rows[0].count, 10) };
  },

  findById: async (id) => {
    const sql = `
      SELECT m.*, g.nama_lengkap as guru_nama
      FROM academic.mata_pelajaran m
      LEFT JOIN academic.guru g ON m.guru_pengampu_id = g.id
      WHERE m.id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  findByKode: async (kode, excludeId = null) => {
    const sql = excludeId
      ? 'SELECT id FROM academic.mata_pelajaran WHERE kode = $1 AND id != $2'
      : 'SELECT id FROM academic.mata_pelajaran WHERE kode = $1';
    const result = await query(sql, excludeId ? [kode, excludeId] : [kode]);
    return result.rows[0] || null;
  },

  create: async ({ kode, nama, kelompok, kkm, jumlahJam, tingkat, guruPengampuId, kurikulum_id }) => {
    const sql = `
      INSERT INTO academic.mata_pelajaran (kode, nama, kelompok, kkm, jumlah_jam, tingkat, guru_pengampu_id, kurikulum_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `;
    const result = await query(sql, [kode, nama, kelompok, kkm || 75, jumlahJam || 2, tingkat, guruPengampuId || null, kurikulum_id || null]);
    return result.rows[0];
  },

  update: async (id, { kode, nama, kelompok, kkm, jumlahJam, tingkat, guruPengampuId, kurikulum_id }) => {
    const sql = `
      UPDATE academic.mata_pelajaran
      SET kode             = COALESCE($1, kode),
          nama             = COALESCE($2, nama),
          kelompok         = COALESCE($3, kelompok),
          kkm              = COALESCE($4, kkm),
          jumlah_jam       = COALESCE($5, jumlah_jam),
          tingkat          = COALESCE($6, tingkat),
          guru_pengampu_id = $7,
          kurikulum_id     = $8
      WHERE id = $9 RETURNING *
    `;
    const result = await query(sql, [kode, nama, kelompok, kkm, jumlahJam, tingkat, guruPengampuId || null, kurikulum_id !== undefined ? kurikulum_id : null, id]);
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM academic.mata_pelajaran WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  },
};

module.exports = MapelRepository;
