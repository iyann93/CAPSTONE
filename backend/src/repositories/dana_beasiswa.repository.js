'use strict';

const { query } = require('../config/db');

const DanaBeasiswaRepository = {
  findAll: async () => {
    const sql = `
      SELECT id, sumber, nominal, tanggal, keterangan, dibuat_at 
      FROM finance.dana_beasiswa 
      ORDER BY tanggal DESC, dibuat_at DESC
    `;
    const result = await query(sql);
    return result.rows;
  },

  create: async (data) => {
    const { sumber, nominal, tanggal, keterangan } = data;
    const sql = `
      INSERT INTO finance.dana_beasiswa (sumber, nominal, tanggal, keterangan)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await query(sql, [sumber, nominal, tanggal, keterangan]);
    return result.rows[0];
  },

  delete: async (id) => {
    const sql = `DELETE FROM finance.dana_beasiswa WHERE id = $1 RETURNING id`;
    const result = await query(sql, [id]);
    return result.rows[0];
  }
};

module.exports = DanaBeasiswaRepository;
