'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const SORT_MAP = { nama: 's.nama_lengkap', nis: 's.nis', status: 'kl.status' };

const KelulusanRepository = {
  findAll: async ({ limit, offset, search, sort, kelasId, status, tingkat = 'IX' }) => {
    const wb = whereBuilder();
    
    // Always restrict to graduating grade levels (default to IX)
    wb.addExact(tingkat, 'k.tingkat');

    if (search) {
      wb.addLike(search, ['s.nama_lengkap', 's.nis']);
    }
    if (kelasId) {
      wb.addExact(kelasId, 's.kelas_id');
    }
    if (status) {
      if (status === 'pending') {
        wb.addRaw('kl.status IS NULL');
      } else {
        wb.addExact(status, 'kl.status');
      }
    }

    const { where, values, nextIdx } = wb.build();
    const orderBy = buildOrderBy(sort, SORT_MAP, 's.nama_lengkap ASC');

    const sql = `
      SELECT s.id AS siswa_id, s.nis AS siswa_nis, s.nama_lengkap AS siswa_nama, s.jenis_kelamin AS siswa_jk,
             k.id AS kelas_id, k.nama_kelas, k.tingkat AS kelas_tingkat,
             kl.id AS kelulusan_id, COALESCE(kl.status, 'pending') AS status, 
             kl.tanggal_kelulusan, kl.divalidasi_kepsek, kl.no_ijazah,
             u.nama AS validator_nama, kl.tahun_ajaran_id
      FROM academic.siswa s
      JOIN academic.kelas k ON s.kelas_id = k.id
      LEFT JOIN academic.kelulusan kl ON kl.siswa_id = s.id
      LEFT JOIN shared.users u ON kl.divalidasi_oleh = u.id
      ${where}
      ${orderBy}
      LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
    `;

    const countSql = `
      SELECT COUNT(*) 
      FROM academic.siswa s
      JOIN academic.kelas k ON s.kelas_id = k.id
      LEFT JOIN academic.kelulusan kl ON kl.siswa_id = s.id
      ${where}
    `;

    const [data, count] = await Promise.all([
      query(sql, [...values, limit, offset]),
      query(countSql, values),
    ]);

    return { rows: data.rows, total: parseInt(count.rows[0].count, 10) };
  },

  findById: async (siswaId) => {
    const sql = `
      SELECT s.id AS siswa_id, s.nis AS siswa_nis, s.nama_lengkap AS siswa_nama, s.jenis_kelamin AS siswa_jk,
             k.id AS kelas_id, k.nama_kelas, k.tingkat AS kelas_tingkat,
             kl.id AS kelulusan_id, COALESCE(kl.status, 'pending') AS status, 
             kl.tanggal_kelulusan, kl.divalidasi_kepsek, kl.no_ijazah,
             u.nama AS validator_nama, kl.tahun_ajaran_id
      FROM academic.siswa s
      JOIN academic.kelas k ON s.kelas_id = k.id
      LEFT JOIN academic.kelulusan kl ON kl.siswa_id = s.id
      LEFT JOIN shared.users u ON kl.divalidasi_oleh = u.id
      WHERE s.id = $1
    `;
    const result = await query(sql, [siswaId]);
    return result.rows[0] || null;
  },

  save: async ({ siswaId, status, noIjazah, divalidasiKepsek, divalidasiOleh, tanggalKelulusan, tahunAjaranId }) => {
    if (status === 'pending') {
      // If status is pending, we remove the graduation record
      await query('DELETE FROM academic.kelulusan WHERE siswa_id = $1', [siswaId]);
      return { siswa_id: siswaId, status: 'pending' };
    } else {
      const sql = `
        INSERT INTO academic.kelulusan (siswa_id, tahun_ajaran_id, status, divalidasi_kepsek, divalidasi_oleh, no_ijazah, tanggal_kelulusan)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (siswa_id) 
        DO UPDATE SET 
          status = EXCLUDED.status,
          divalidasi_kepsek = EXCLUDED.divalidasi_kepsek,
          divalidasi_oleh = EXCLUDED.divalidasi_oleh,
          no_ijazah = EXCLUDED.no_ijazah,
          tanggal_kelulusan = EXCLUDED.tanggal_kelulusan
        RETURNING *
      `;
      const result = await query(sql, [
        siswaId,
        tahunAjaranId,
        status,
        divalidasiKepsek ?? false,
        divalidasiOleh || null,
        noIjazah || null,
        tanggalKelulusan || null
      ]);
      return result.rows[0];
    }
  },

  delete: async (siswaId) => {
    const result = await query('DELETE FROM academic.kelulusan WHERE siswa_id = $1 RETURNING id', [siswaId]);
    return result.rows[0] || null;
  }
};

module.exports = KelulusanRepository;
