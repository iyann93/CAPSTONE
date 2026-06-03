'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const SORT_MAP = {
  nama_beasiswa: 'b.nama_beasiswa',
  nominal: 'b.nominal',
  tanggal_mulai: 'b.tanggal_mulai',
  status: 'b.status',
  siswa_nama: 's.nama_lengkap',
};

const BeasiswaRepository = {
  findAll: async ({ limit, offset, search, sort, siswaId, status }) => {
    const wb = whereBuilder();
    wb.addLike(search, ['b.nama_beasiswa', 's.nama_lengkap', 's.nis']);
    wb.addExact(siswaId, 'b.siswa_id');
    wb.addExact(status, 'b.status');
    const { where, values, nextIdx } = wb.build();
    
    // Sort default by terbaru
    const orderBy = buildOrderBy(sort, SORT_MAP, 'b.tanggal_mulai DESC');

    const sql = `
      SELECT b.id, b.siswa_id, b.nama_beasiswa, b.nominal, b.periode, b.status, 
             b.tanggal_mulai, b.tanggal_selesai,
             s.nama_lengkap AS siswa_nama, s.nis, s.kelas_id, k.nama_kelas
      FROM finance.beasiswa b
      LEFT JOIN academic.siswa s ON b.siswa_id = s.id
      LEFT JOIN academic.kelas k ON s.kelas_id = k.id
      ${where}
      ${orderBy}
      LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
    `;

    const countSql = `
      SELECT COUNT(*) 
      FROM finance.beasiswa b
      LEFT JOIN academic.siswa s ON b.siswa_id = s.id
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
      SELECT b.*, s.nama_lengkap AS siswa_nama, s.nis, s.kelas_id, k.nama_kelas
      FROM finance.beasiswa b
      LEFT JOIN academic.siswa s ON b.siswa_id = s.id
      LEFT JOIN academic.kelas k ON s.kelas_id = k.id
      WHERE b.id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  create: async (data) => {
    const { siswaId, namaBeasiswa, nominal, periode, status, tanggalMulai, tanggalSelesai } = data;
    const sql = `
      INSERT INTO finance.beasiswa 
        (siswa_id, nama_beasiswa, nominal, periode, status, tanggal_mulai, tanggal_selesai)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await query(sql, [siswaId, namaBeasiswa, nominal, periode, status, tanggalMulai, tanggalSelesai]);
    return result.rows[0];
  },

  update: async (id, data) => {
    const { siswaId, namaBeasiswa, nominal, periode, status, tanggalMulai, tanggalSelesai } = data;
    const sql = `
      UPDATE finance.beasiswa
      SET siswa_id = COALESCE($1, siswa_id),
          nama_beasiswa = COALESCE($2, nama_beasiswa),
          nominal = COALESCE($3, nominal),
          periode = COALESCE($4, periode),
          status = COALESCE($5, status),
          tanggal_mulai = COALESCE($6, tanggal_mulai),
          tanggal_selesai = COALESCE($7, tanggal_selesai)
      WHERE id = $8
      RETURNING *
    `;
    const result = await query(sql, [siswaId, namaBeasiswa, nominal, periode, status, tanggalMulai, tanggalSelesai, id]);
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM finance.beasiswa WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  }
};

module.exports = BeasiswaRepository;
