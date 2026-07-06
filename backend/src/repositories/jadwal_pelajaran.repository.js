'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const SORT_MAP = { hari: 'jp.hari', jam_mulai: 'jp.jam_mulai' };

const JadwalPelajaranRepository = {
  findAll: async ({ limit, offset, search, sort, kelasId, guruId, mapelId, semesterId, hari }) => {
    const wb = whereBuilder();
    wb.addLike(search, ['g.nama_lengkap', 'm.nama', 'k.nama_kelas']);
    wb.addExact(kelasId, 'jp.kelas_id');
    wb.addExact(guruId, 'jp.guru_id');
    wb.addExact(mapelId, 'jp.mata_pelajaran_id');
    wb.addExact(semesterId, 'jp.semester_id');
    wb.addExact(hari, 'jp.hari');
    const { where, values, nextIdx } = wb.build();
    const orderBy = buildOrderBy(sort, SORT_MAP, 'jp.hari ASC, jp.jam_mulai ASC');

    const sql = `
      SELECT jp.id, jp.hari, jp.jam_mulai, jp.jam_selesai,
             jp.kelas_id, k.nama_kelas, k.tingkat,
             jp.mata_pelajaran_id, m.nama AS nama_mapel, m.kode AS kode_mapel,
             jp.guru_id, g.nama_lengkap AS guru_nama, g.nip,
             jp.semester_id, sm.nama AS semester_nama
      FROM academic.jadwal_pelajaran jp
      LEFT JOIN academic.kelas k ON jp.kelas_id = k.id
      LEFT JOIN academic.mata_pelajaran m ON jp.mata_pelajaran_id = m.id
      LEFT JOIN academic.guru g ON jp.guru_id = g.id
      LEFT JOIN academic.semester sm ON jp.semester_id = sm.id
      ${where}
      ${orderBy}
      LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
    `;
    const countSql = `
      SELECT COUNT(*) FROM academic.jadwal_pelajaran jp
      LEFT JOIN academic.kelas k ON jp.kelas_id = k.id
      LEFT JOIN academic.mata_pelajaran m ON jp.mata_pelajaran_id = m.id
      LEFT JOIN academic.guru g ON jp.guru_id = g.id
      LEFT JOIN academic.semester sm ON jp.semester_id = sm.id
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
      SELECT jp.*,
             k.nama_kelas, k.tingkat,
             m.nama AS nama_mapel, m.kode AS kode_mapel,
             g.nama_lengkap AS guru_nama, g.nip,
             sm.nama AS semester_nama
      FROM academic.jadwal_pelajaran jp
      LEFT JOIN academic.kelas k ON jp.kelas_id = k.id
      LEFT JOIN academic.mata_pelajaran m ON jp.mata_pelajaran_id = m.id
      LEFT JOIN academic.guru g ON jp.guru_id = g.id
      LEFT JOIN academic.semester sm ON jp.semester_id = sm.id
      WHERE jp.id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  /**
   * Check for scheduling conflict (same kelas, hari, and overlapping jam)
   */
  checkConflict: async ({ kelasId, hari, jamMulai, jamSelesai, excludeId = null }) => {
    const sql = `
      SELECT id FROM academic.jadwal_pelajaran
      WHERE kelas_id = $1
        AND hari = $2
        AND NOT ($3 >= jam_selesai OR $4 <= jam_mulai)
        ${excludeId ? 'AND id != $5' : ''}
      LIMIT 1
    `;
    const params = excludeId
      ? [kelasId, hari, jamMulai, jamSelesai, excludeId]
      : [kelasId, hari, jamMulai, jamSelesai];
    const result = await query(sql, params);
    return result.rows[0] || null;
  },

  create: async ({ kelasId, mapelId, guruId, semesterId, hari, jamMulai, jamSelesai }) => {
    const sql = `
      INSERT INTO academic.jadwal_pelajaran
        (kelas_id, mata_pelajaran_id, guru_id, semester_id, hari, jam_mulai, jam_selesai)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `;
    const result = await query(sql, [kelasId, mapelId, guruId, semesterId, hari, jamMulai, jamSelesai]);
    return result.rows[0];
  },

  update: async (id, { kelasId, mapelId, guruId, semesterId, hari, jamMulai, jamSelesai }) => {
    const sql = `
      UPDATE academic.jadwal_pelajaran
      SET kelas_id   = COALESCE($1, kelas_id),
          mata_pelajaran_id   = COALESCE($2, mata_pelajaran_id),
          guru_id    = COALESCE($3, guru_id),
          semester_id = COALESCE($4, semester_id),
          hari       = COALESCE($5, hari),
          jam_mulai  = COALESCE($6, jam_mulai),
          jam_selesai = COALESCE($7, jam_selesai)
      WHERE id = $8 RETURNING *
    `;
    const result = await query(sql, [kelasId, mapelId, guruId, semesterId, hari, jamMulai, jamSelesai, id]);
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM academic.jadwal_pelajaran WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  },
};

module.exports = JadwalPelajaranRepository;
