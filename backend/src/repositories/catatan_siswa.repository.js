'use strict';

const { query } = require('../config/db');

const CatatanSiswaRepository = {
  findAll: async ({ limit, offset, siswaId, guruId }) => {
    let where = 'WHERE 1=1';
    let values = [];
    let idx = 1;

    if (siswaId) {
      where += ` AND c.siswa_id = $${idx++}`;
      values.push(siswaId);
    }
    if (guruId) {
      where += ` AND c.guru_id = $${idx++}`;
      values.push(guruId);
    }

    const sql = `
      SELECT c.*, s.nama_lengkap AS siswa_nama, u.nama AS guru_nama 
      FROM academic.catatan_siswa c
      LEFT JOIN academic.siswa s ON c.siswa_id = s.id
      LEFT JOIN shared.users u ON c.guru_id = u.id
      ${where}
      ORDER BY c.created_at DESC
      LIMIT $${idx} OFFSET $${idx + 1}
    `;

    const countSql = `SELECT COUNT(*) FROM academic.catatan_siswa c ${where}`;

    const [data, count] = await Promise.all([
      query(sql, [...values, limit, offset]),
      query(countSql, values),
    ]);

    return { rows: data.rows, total: parseInt(count.rows[0].count, 10) };
  },

  upsertByGuruSiswa: async (siswaId, guruId, isiCatatan) => {
    const checkSql = `SELECT id FROM academic.catatan_siswa WHERE siswa_id = $1 AND guru_id = $2`;
    const check = await query(checkSql, [siswaId, guruId]);

    if (check.rows.length > 0) {
      const upSql = `
        UPDATE academic.catatan_siswa 
        SET isi_catatan = $1, created_at = NOW() 
        WHERE id = $2 RETURNING *
      `;
      const res = await query(upSql, [isiCatatan, check.rows[0].id]);
      return res.rows[0];
    } else {
      const inSql = `
        INSERT INTO academic.catatan_siswa (siswa_id, guru_id, isi_catatan, jenis, created_at)
        VALUES ($1, $2, $3, 'Akademik', NOW()) RETURNING *
      `;
      const res = await query(inSql, [siswaId, guruId, isiCatatan]);
      return res.rows[0];
    }
  }
};

module.exports = CatatanSiswaRepository;
