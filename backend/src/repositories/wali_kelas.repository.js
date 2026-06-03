'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const SORT_MAP = { guru_nama: 'g.nama', kelas_nama: 'k.nama_kelas', created_at: 'wk.created_at' };

const WaliKelasRepository = {
  findAll: async ({ limit, offset, search, sort, kelasId, tahunAjaranId }) => {
    const wb = whereBuilder();
    wb.addLike(search, ['g.nama', 'k.nama_kelas']);
    wb.addExact(kelasId, 'wk.kelas_id');
    wb.addExact(tahunAjaranId, 'wk.tahun_ajaran_id');
    const { where, values, nextIdx } = wb.build();
    const orderBy = buildOrderBy(sort, SORT_MAP, 'k.nama_kelas ASC');

    const sql = `
      SELECT wk.id, wk.guru_id, wk.kelas_id, wk.tahun_ajaran_id, wk.created_at,
             g.nama AS guru_nama, g.nip,
             k.nama_kelas, k.tingkat,
             ta.nama AS tahun_ajaran_nama
      FROM academic.wali_kelas wk
      LEFT JOIN academic.guru g ON wk.guru_id = g.id
      LEFT JOIN academic.kelas k ON wk.kelas_id = k.id
      LEFT JOIN academic.tahun_ajaran ta ON wk.tahun_ajaran_id = ta.id
      ${where}
      ${orderBy}
      LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
    `;
    const countSql = `
      SELECT COUNT(*) FROM academic.wali_kelas wk
      LEFT JOIN academic.guru g ON wk.guru_id = g.id
      LEFT JOIN academic.kelas k ON wk.kelas_id = k.id
      LEFT JOIN academic.tahun_ajaran ta ON wk.tahun_ajaran_id = ta.id
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
      SELECT wk.*, g.nama AS guru_nama, g.nip, k.nama_kelas, k.tingkat, ta.nama AS tahun_ajaran_nama
      FROM academic.wali_kelas wk
      LEFT JOIN academic.guru g ON wk.guru_id = g.id
      LEFT JOIN academic.kelas k ON wk.kelas_id = k.id
      LEFT JOIN academic.tahun_ajaran ta ON wk.tahun_ajaran_id = ta.id
      WHERE wk.id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  findByKelasAndTahun: async (kelasId, tahunAjaranId, excludeId = null) => {
    const sql = excludeId
      ? 'SELECT id FROM academic.wali_kelas WHERE kelas_id = $1 AND tahun_ajaran_id = $2 AND id != $3'
      : 'SELECT id FROM academic.wali_kelas WHERE kelas_id = $1 AND tahun_ajaran_id = $2';
    const params = excludeId ? [kelasId, tahunAjaranId, excludeId] : [kelasId, tahunAjaranId];
    const result = await query(sql, params);
    return result.rows[0] || null;
  },

  create: async ({ guruId, kelasId, tahunAjaranId }) => {
    const sql = `
      INSERT INTO academic.wali_kelas (guru_id, kelas_id, tahun_ajaran_id, created_at)
      VALUES ($1, $2, $3, NOW()) RETURNING *
    `;
    const result = await query(sql, [guruId, kelasId, tahunAjaranId]);
    return result.rows[0];
  },

  update: async (id, { guruId, kelasId, tahunAjaranId }) => {
    const sql = `
      UPDATE academic.wali_kelas
      SET guru_id         = COALESCE($1, guru_id),
          kelas_id        = COALESCE($2, kelas_id),
          tahun_ajaran_id = COALESCE($3, tahun_ajaran_id)
      WHERE id = $4 RETURNING *
    `;
    const result = await query(sql, [guruId, kelasId, tahunAjaranId, id]);
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM academic.wali_kelas WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  },
};

module.exports = WaliKelasRepository;
