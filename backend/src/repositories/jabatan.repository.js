'use strict';

const { query } = require('../config/db');

const JabatanRepository = {
  findAll: async () => {
    const sql = `
      SELECT * FROM shared.jabatan
      ORDER BY nama ASC
    `;
    const res = await query(sql);
    return res.rows;
  },

  findById: async (id) => {
    const sql = `SELECT * FROM shared.jabatan WHERE id = $1`;
    const res = await query(sql, [id]);
    return res.rows[0] || null;
  },

  create: async ({ nama, deskripsi }) => {
    const sql = `
      INSERT INTO shared.jabatan (nama, deskripsi)
      VALUES ($1, $2)
      RETURNING *
    `;
    const res = await query(sql, [nama, deskripsi]);
    return res.rows[0];
  },

  update: async (id, { nama, deskripsi }) => {
    const sql = `
      UPDATE shared.jabatan
      SET nama = COALESCE($1, nama),
          deskripsi = COALESCE($2, deskripsi),
          updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    const res = await query(sql, [nama, deskripsi, id]);
    return res.rows[0] || null;
  },

  delete: async (id) => {
    const sql = `DELETE FROM shared.jabatan WHERE id = $1 RETURNING *`;
    const res = await query(sql, [id]);
    return res.rows[0] || null;
  }
};

module.exports = JabatanRepository;
