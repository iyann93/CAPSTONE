'use strict';

const { query } = require('../config/db');

const TemplateGajiRepository = {
  // Ambil semua template untuk jabatan tertentu
  findByJabatanId: async (jabatanId) => {
    const sql = `
      SELECT t.id, t.jabatan_id, t.komponen_gaji_id, t.nominal,
             k.nama AS komponen_nama, k.tipe AS komponen_tipe, k.kategori, k.formula_tipe, k.nilai_satuan
      FROM finance.template_gaji_jabatan t
      INNER JOIN finance.komponen_gaji k ON t.komponen_gaji_id = k.id
      WHERE t.jabatan_id = $1
      ORDER BY k.tipe, k.nama
    `;
    const res = await query(sql, [jabatanId]);
    return res.rows;
  },

  // Simpan atau update template gaji (Upsert)
  upsert: async ({ jabatan_id, komponen_gaji_id, nominal }) => {
    const sql = `
      INSERT INTO finance.template_gaji_jabatan (jabatan_id, komponen_gaji_id, nominal, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (jabatan_id, komponen_gaji_id) 
      DO UPDATE SET nominal = EXCLUDED.nominal, updated_at = NOW()
      RETURNING *
    `;
    const res = await query(sql, [jabatan_id, komponen_gaji_id, nominal]);
    return res.rows[0];
  },

  delete: async (id) => {
    const sql = `DELETE FROM finance.template_gaji_jabatan WHERE id = $1 RETURNING *`;
    const res = await query(sql, [id]);
    return res.rows[0] || null;
  }
};

module.exports = TemplateGajiRepository;
