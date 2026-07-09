'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const SORT_MAP = { nama: 'k.nama_kelas', tingkat: 'k.tingkat' };

const getTahunAjaranId = async (tahunAjaran) => {
  if (!tahunAjaran) {
    const resActive = await query('SELECT id FROM academic.tahun_ajaran WHERE is_aktif = true LIMIT 1');
    return resActive.rows[0] ? resActive.rows[0].id : null;
  }
  const res = await query('SELECT id FROM academic.tahun_ajaran WHERE nama = $1', [tahunAjaran]);
  if (res.rows[0]) return res.rows[0].id;
  const resActive = await query('SELECT id FROM academic.tahun_ajaran WHERE is_aktif = true LIMIT 1');
  return resActive.rows[0] ? resActive.rows[0].id : null;
};

const KelasRepository = {
  findAll: async ({ limit, offset, search, sort, jurusanId, tingkat }) => {
    const wb = whereBuilder();
    wb.addLike(search, ['k.nama_kelas']);
    wb.addExact(jurusanId, 'k.jurusan_id');
    wb.addExact(tingkat, 'k.tingkat');
    const { where, values, nextIdx } = wb.build();
    const orderBy = buildOrderBy(sort, SORT_MAP, 'k.tingkat ASC, k.nama_kelas ASC');

    const sql = `
      SELECT k.id, k.kode_kelas, k.nama_kelas, k.tingkat, k.kapasitas,
             ta.nama AS tahun_ajaran, j.nama AS nama_jurusan, j.kode AS kode_jurusan, 
             k.jurusan_id, k.wali_kelas_id, g.nama_lengkap AS wali_kelas_nama,
             (SELECT COUNT(*) FROM academic.siswa s WHERE s.kelas_id = k.id) AS jumlah_siswa
      FROM academic.kelas k
      LEFT JOIN academic.jurusan j ON k.jurusan_id = j.id
      LEFT JOIN academic.tahun_ajaran ta ON k.tahun_ajaran_id = ta.id
      LEFT JOIN academic.guru g ON k.wali_kelas_id = g.id
      ${where}
      ${orderBy}
      LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
    `;
    const countSql = `SELECT COUNT(*) FROM academic.kelas k LEFT JOIN academic.jurusan j ON k.jurusan_id = j.id ${where}`;

    const [data, count] = await Promise.all([
      query(sql, [...values, limit, offset]),
      query(countSql, values),
    ]);
    return { rows: data.rows, total: parseInt(count.rows[0].count, 10) };
  },

  findById: async (id) => {
    const sql = `
      SELECT k.*, j.nama AS nama_jurusan, j.kode AS kode_jurusan, ta.nama AS tahun_ajaran, g.nama_lengkap AS wali_kelas_nama
      FROM academic.kelas k 
      LEFT JOIN academic.jurusan j ON k.jurusan_id = j.id
      LEFT JOIN academic.tahun_ajaran ta ON k.tahun_ajaran_id = ta.id
      LEFT JOIN academic.guru g ON k.wali_kelas_id = g.id
      WHERE k.id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  create: async ({ namaKelas, tingkat, tahunAjaran, jurusanId, waliKelasId, kapasitas }) => {
    const taId = await getTahunAjaranId(tahunAjaran);
    
    // Generate a simple class code, e.g. "X-IPA-5" from namaKelas or just clean it
    const kodeKelas = namaKelas.replace(/\s+/g, '-').toUpperCase();
    const kap = kapasitas || 36;

    const sql = `
      INSERT INTO academic.kelas (kode_kelas, nama_kelas, tingkat, tahun_ajaran_id, jurusan_id, kapasitas, wali_kelas_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `;
    const result = await query(sql, [kodeKelas, namaKelas, tingkat, taId, jurusanId, kap, waliKelasId || null]);
    return result.rows[0];
  },

  update: async (id, { namaKelas, tingkat, tahunAjaran, jurusanId, waliKelasId, kapasitas }) => {
    const taId = tahunAjaran ? await getTahunAjaranId(tahunAjaran) : null;
    const kodeKelas = namaKelas ? namaKelas.replace(/\s+/g, '-').toUpperCase() : null;

    const sql = `
      UPDATE academic.kelas
      SET nama_kelas      = COALESCE($1, nama_kelas),
          kode_kelas      = COALESCE($2, kode_kelas),
          tingkat         = COALESCE($3, tingkat),
          tahun_ajaran_id = COALESCE($4, tahun_ajaran_id),
          jurusan_id      = COALESCE($5, jurusan_id),
          wali_kelas_id   = COALESCE($6, wali_kelas_id),
          kapasitas       = COALESCE($7, kapasitas)
      WHERE id = $8 RETURNING *
    `;
    const result = await query(sql, [namaKelas, kodeKelas, tingkat, taId, jurusanId, waliKelasId, kapasitas, id]);
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM academic.kelas WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  },
};

module.exports = KelasRepository;

