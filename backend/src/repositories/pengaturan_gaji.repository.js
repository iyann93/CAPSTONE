'use strict';

const { query } = require('../config/db');

const PengaturanGajiRepository = {
  // Ambil semua override untuk user tertentu
  findByUserId: async (userId) => {
    const sql = `
      SELECT p.id, p.user_id, p.komponen_gaji_id, p.nominal,
             k.nama AS komponen_nama, k.tipe AS komponen_tipe, k.kategori, k.formula_tipe, k.nilai_satuan
      FROM finance.pengaturan_gaji_user p
      INNER JOIN finance.komponen_gaji k ON p.komponen_gaji_id = k.id
      WHERE p.user_id = $1
      ORDER BY k.tipe, k.nama
    `;
    const res = await query(sql, [userId]);
    return res.rows;
  },

  // Simpan atau update override (Upsert)
  upsert: async ({ user_id, komponen_gaji_id, nominal }) => {
    const sql = `
      INSERT INTO finance.pengaturan_gaji_user (user_id, komponen_gaji_id, nominal, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (user_id, komponen_gaji_id) 
      DO UPDATE SET nominal = EXCLUDED.nominal, updated_at = NOW()
      RETURNING *
    `;
    const res = await query(sql, [user_id, komponen_gaji_id, nominal]);
    return res.rows[0];
  },

  delete: async (id) => {
    const sql = `DELETE FROM finance.pengaturan_gaji_user WHERE id = $1 RETURNING *`;
    const res = await query(sql, [id]);
    return res.rows[0] || null;
  }
};

module.exports = PengaturanGajiRepository;
