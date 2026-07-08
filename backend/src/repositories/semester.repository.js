'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const SORT_MAP = { nama: 'sm.nama', tanggal_mulai: 'sm.tanggal_mulai' };

const SemesterRepository = {
  findAll: async ({ limit, offset, search, sort, tahunAjaranId, is_aktif }) => {
    const wb = whereBuilder();
    wb.addLike(search, ['sm.nama']);
    wb.addExact(tahunAjaranId, 'sm.tahun_ajaran_id');
    wb.addBool(is_aktif, 'sm.is_aktif');
    const { where, values, nextIdx } = wb.build();
    const orderBy = buildOrderBy(sort, SORT_MAP, 'sm.tanggal_mulai DESC');

    const sql = `
      SELECT sm.id, sm.nama, sm.tahun_ajaran_id, sm.tanggal_mulai, sm.tanggal_selesai,
             sm.is_aktif,
             ta.nama AS tahun_ajaran_nama
      FROM academic.semester sm
      LEFT JOIN academic.tahun_ajaran ta ON sm.tahun_ajaran_id = ta.id
      ${where}
      ${orderBy}
      LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
    `;
    const countSql = `
      SELECT COUNT(*) FROM academic.semester sm
      LEFT JOIN academic.tahun_ajaran ta ON sm.tahun_ajaran_id = ta.id
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
      SELECT sm.*, ta.nama AS tahun_ajaran_nama
      FROM academic.semester sm
      LEFT JOIN academic.tahun_ajaran ta ON sm.tahun_ajaran_id = ta.id
      WHERE sm.id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  findByNamaAndTahun: async (nama, tahunAjaranId, excludeId = null) => {
    const sql = excludeId
      ? 'SELECT id FROM academic.semester WHERE nama = $1 AND tahun_ajaran_id = $2 AND id != $3'
      : 'SELECT id FROM academic.semester WHERE nama = $1 AND tahun_ajaran_id = $2';
    const params = excludeId ? [nama, tahunAjaranId, excludeId] : [nama, tahunAjaranId];
    const result = await query(sql, params);
    return result.rows[0] || null;
  },

  /**
   * Set active semester — uses transaction to deactivate all first
   */
  setActive: async (id) => {
    const client = await require('../config/db').getClient();
    try {
      await client.query('BEGIN');
      
      // Get the tahun_ajaran_id of this semester
      const sm = await client.query('SELECT tahun_ajaran_id FROM academic.semester WHERE id = $1', [id]);
      if (sm.rows.length === 0) throw new Error('Semester tidak ditemukan');
      
      // Deactivate all semesters IN THE SAME TAHUN AJARAN
      await client.query('UPDATE academic.semester SET is_aktif = false WHERE tahun_ajaran_id = $1', [sm.rows[0].tahun_ajaran_id]);
      
      const result = await client.query(
        'UPDATE academic.semester SET is_aktif = true WHERE id = $1 RETURNING *',
        [id]
      );
      await client.query('COMMIT');
      return result.rows[0] || null;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  create: async ({ nama, tahunAjaranId, tanggalMulai, tanggalSelesai }) => {
    const sql = `
      INSERT INTO academic.semester (nama, tahun_ajaran_id, tanggal_mulai, tanggal_selesai, is_aktif)
      VALUES ($1, $2, $3, $4, false) RETURNING *
    `;
    const result = await query(sql, [nama, tahunAjaranId, tanggalMulai, tanggalSelesai]);
    return result.rows[0];
  },

  update: async (id, { nama, tahunAjaranId, tanggalMulai, tanggalSelesai }) => {
    const sql = `
      UPDATE academic.semester
      SET nama            = COALESCE($1, nama),
          tahun_ajaran_id = COALESCE($2, tahun_ajaran_id),
          tanggal_mulai   = COALESCE($3, tanggal_mulai),
          tanggal_selesai = COALESCE($4, tanggal_selesai)
      WHERE id = $5 RETURNING *
    `;
    const result = await query(sql, [nama, tahunAjaranId, tanggalMulai, tanggalSelesai, id]);
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM academic.semester WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  },
};

module.exports = SemesterRepository;
