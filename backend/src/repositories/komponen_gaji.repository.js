'use strict';

const { query } = require('../config/db');

const KomponenGajiRepository = {
  findAll: async () => {
    const sql = `
      SELECT * FROM finance.komponen_gaji
      ORDER BY tipe ASC, nama ASC
    `;
    const res = await query(sql);
    return res.rows;
  },

  findById: async (id) => {
    const sql = `SELECT * FROM finance.komponen_gaji WHERE id = $1`;
    const res = await query(sql, [id]);
    return res.rows[0];
  },

  create: async (data) => {
    const { nama, tipe, kategori, nominal_default, is_aktif, formula_tipe, nilai_satuan } = data;
    const sql = `
      INSERT INTO finance.komponen_gaji
        (nama, tipe, kategori, nominal_default, is_aktif, formula_tipe, nilai_satuan)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const res = await query(sql, [
      nama, tipe, kategori, nominal_default || 0, is_aktif ?? true, formula_tipe || 'flat', nilai_satuan || 0
    ]);
    return res.rows[0];
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const key of ['nama', 'tipe', 'kategori', 'nominal_default', 'is_aktif', 'formula_tipe', 'nilai_satuan']) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${idx}`);
        values.push(data[key]);
        idx++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const sql = `
      UPDATE finance.komponen_gaji
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *
    `;
    const res = await query(sql, values);
    return res.rows[0];
  },

  delete: async (id) => {
    // Note: should check if it's referenced by detail_slip_gaji before deleting?
    // Postgres will throw foreign key error if referenced, which will be caught by errorHandler
    const sql = `DELETE FROM finance.komponen_gaji WHERE id = $1 RETURNING *`;
    const res = await query(sql, [id]);
    return res.rows[0];
  }
};

module.exports = KomponenGajiRepository;
