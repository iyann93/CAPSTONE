'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const SORT_MAP = { nama: 'ta.nama', tanggal_mulai: 'ta.tanggal_mulai', created_at: 'ta.created_at' };

const TahunAjaranRepository = {
  findAll: async ({ limit, offset, search, sort, isActive }) => {
    const wb = whereBuilder();
    wb.addLike(search, ['ta.nama']);
    wb.addBool(isActive, 'ta.is_active');
    const { where, values, nextIdx } = wb.build();
    const orderBy = buildOrderBy(sort, SORT_MAP, 'ta.tanggal_mulai DESC');

    const sql = `
      SELECT ta.id, ta.nama, ta.tanggal_mulai, ta.tanggal_selesai, ta.is_active, ta.created_at
      FROM academic.tahun_ajaran ta
      ${where}
      ${orderBy}
      LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
    `;
    const countSql = `SELECT COUNT(*) FROM academic.tahun_ajaran ta ${where}`;

    const [data, count] = await Promise.all([
      query(sql, [...values, limit, offset]),
      query(countSql, values),
    ]);
    return { rows: data.rows, total: parseInt(count.rows[0].count, 10) };
  },

  findById: async (id) => {
    const result = await query('SELECT * FROM academic.tahun_ajaran WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  findByNama: async (nama, excludeId = null) => {
    const sql = excludeId
      ? 'SELECT id FROM academic.tahun_ajaran WHERE nama = $1 AND id != $2'
      : 'SELECT id FROM academic.tahun_ajaran WHERE nama = $1';
    const result = await query(sql, excludeId ? [nama, excludeId] : [nama]);
    return result.rows[0] || null;
  },

  findActive: async () => {
    const result = await query('SELECT * FROM academic.tahun_ajaran WHERE is_active = true LIMIT 1');
    return result.rows[0] || null;
  },

  /**
   * Deactivate all tahun_ajaran, then activate the given one (transaction)
   */
  setActive: async (id) => {
    const client = await require('../config/db').getClient();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE academic.tahun_ajaran SET is_active = false');
      const result = await client.query(
        'UPDATE academic.tahun_ajaran SET is_active = true WHERE id = $1 RETURNING *',
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

  create: async ({ nama, tanggalMulai, tanggalSelesai }) => {
    const sql = `
      INSERT INTO academic.tahun_ajaran (nama, tanggal_mulai, tanggal_selesai, is_active, created_at)
      VALUES ($1, $2, $3, false, NOW()) RETURNING *
    `;
    const result = await query(sql, [nama, tanggalMulai, tanggalSelesai]);
    return result.rows[0];
  },

  update: async (id, { nama, tanggalMulai, tanggalSelesai }) => {
    const sql = `
      UPDATE academic.tahun_ajaran
      SET nama             = COALESCE($1, nama),
          tanggal_mulai    = COALESCE($2, tanggal_mulai),
          tanggal_selesai  = COALESCE($3, tanggal_selesai)
      WHERE id = $4 RETURNING *
    `;
    const result = await query(sql, [nama, tanggalMulai, tanggalSelesai, id]);
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM academic.tahun_ajaran WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  },
};

module.exports = TahunAjaranRepository;
