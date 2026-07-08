'use strict';

const { query } = require('../config/db');

const OperasionalRepository = {
  findAll: async () => {
    const res = await query(`
      SELECT * FROM finance.operasional_transactions
      ORDER BY id DESC
    `);
    return res.rows.map(row => ({
      ...row,
      bukti: (() => {
        try {
          if (!row.bukti) return [];
          if (Array.isArray(row.bukti)) return row.bukti;
          return JSON.parse(row.bukti);
        } catch (_) { return []; }
      })()
    }));
  },

  create: async (data) => {
    const { tipe, tanggal, nama, kategori, nominal, sumber_dana, keterangan, bukti } = data;
    const res = await query(`
      INSERT INTO finance.operasional_transactions 
      (tipe, tanggal, nama, kategori, nominal, sumber_dana, keterangan, bukti)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [tipe, tanggal, nama, kategori, nominal, sumber_dana, keterangan, bukti ? JSON.stringify(bukti) : '[]']);
    return res.rows[0];
  },

  deleteMultiple: async (ids) => {
    // ids is an array of IDs
    const res = await query(`
      DELETE FROM finance.operasional_transactions
      WHERE id = ANY($1::int[])
      RETURNING id
    `, [ids]);
    return res.rows; // return deleted rows to know how many were deleted
  }
};

module.exports = OperasionalRepository;
