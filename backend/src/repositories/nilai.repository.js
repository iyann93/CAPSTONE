'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const SORT_MAP = { created_at: 'n.created_at', siswa: 's.nama', nilai_akhir: 'n.nilai_akhir' };

const NilaiRepository = {
  findAll: async ({ limit, offset, search, sort, siswaId, mapelId, semesterId, guruId }) => {
    const wb = whereBuilder();
    wb.addLike(search, ['s.nama', 's.nis', 'm.nama_mapel']);
    wb.addExact(siswaId, 'n.siswa_id');
    wb.addExact(mapelId, 'n.mata_pelajaran_id');
    wb.addExact(semesterId, 'n.semester_id');
    wb.addExact(guruId, 'n.guru_id');
    
    const { where, values, nextIdx } = wb.build();
    const orderBy = buildOrderBy(sort, SORT_MAP, 's.nama ASC, n.created_at DESC');

    const sql = `
      SELECT n.id, n.siswa_id, n.mata_pelajaran_id, n.semester_id, n.guru_id,
             n.nilai_harian, n.nilai_uts, n.nilai_uas, n.nilai_akhir,
             n.bobot_harian, n.bobot_uts, n.bobot_uas, n.catatan, n.created_at,
             s.nama AS siswa_nama, s.nis,
             m.nama_mapel,
             sm.nama AS semester_nama,
             g.nama AS guru_nama
      FROM academic.nilai n
      LEFT JOIN academic.siswa s ON n.siswa_id = s.id
      LEFT JOIN academic.mapel m ON n.mata_pelajaran_id = m.id
      LEFT JOIN academic.semester sm ON n.semester_id = sm.id
      LEFT JOIN academic.guru g ON n.guru_id = g.id
      ${where}
      ${orderBy}
      LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
    `;
    
    const countSql = `
      SELECT COUNT(*) FROM academic.nilai n
      LEFT JOIN academic.siswa s ON n.siswa_id = s.id
      LEFT JOIN academic.mapel m ON n.mata_pelajaran_id = m.id
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
      SELECT n.*, s.nama AS siswa_nama, s.nis, m.nama_mapel, sm.nama AS semester_nama, g.nama AS guru_nama
      FROM academic.nilai n
      LEFT JOIN academic.siswa s ON n.siswa_id = s.id
      LEFT JOIN academic.mapel m ON n.mata_pelajaran_id = m.id
      LEFT JOIN academic.semester sm ON n.semester_id = sm.id
      LEFT JOIN academic.guru g ON n.guru_id = g.id
      WHERE n.id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  findByKelas: async (kelasId, semesterId, mapelId = null) => {
    const values = [kelasId, semesterId];
    let mapelFilter = '';
    if (mapelId) {
      mapelFilter = `AND n.mata_pelajaran_id = $3`;
      values.push(mapelId);
    }
    const sql = `
      SELECT n.id, n.siswa_id, s.nama AS siswa_nama, s.nis,
             n.mata_pelajaran_id, m.nama_mapel,
             n.nilai_harian, n.nilai_uts, n.nilai_uas, n.nilai_akhir, n.catatan
      FROM academic.nilai n
      INNER JOIN academic.siswa s ON n.siswa_id = s.id
      INNER JOIN academic.mapel m ON n.mata_pelajaran_id = m.id
      WHERE s.kelas_id = $1 AND n.semester_id = $2 ${mapelFilter}
      ORDER BY s.nama ASC, m.nama_mapel ASC
    `;
    const result = await query(sql, values);
    return result.rows;
  },

  create: async (data) => {
    const client = await require('../config/db').getClient();
    try {
      await client.query('BEGIN');
      
      const { siswaId, mataPelajaranId, semesterId, guruId, nilaiHarian, nilaiUts, nilaiUas, catatan } = data;
      
      // Ambil bobot nilai dari master data bobot_nilai
      const bobotRes = await client.query('SELECT bobot_harian, bobot_uts, bobot_uas FROM academic.bobot_nilai WHERE mata_pelajaran_id = $1', [mataPelajaranId]);
      
      if (bobotRes.rows.length === 0) {
        throw new Error('Bobot nilai untuk mata pelajaran ini belum diatur di database.');
      }
      
      const { bobot_harian, bobot_uts, bobot_uas } = bobotRes.rows[0];
      
      // Hitung Nilai Akhir
      const nilaiAkhir = (
        (nilaiHarian * bobot_harian / 100) +
        (nilaiUts * bobot_uts / 100) +
        (nilaiUas * bobot_uas / 100)
      );

      const sql = `
        INSERT INTO academic.nilai (
          siswa_id, mata_pelajaran_id, semester_id, guru_id,
          nilai_harian, nilai_uts, nilai_uas, catatan,
          bobot_harian, bobot_uts, bobot_uas, nilai_akhir, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
        RETURNING *
      `;
      const result = await client.query(sql, [
        siswaId, mataPelajaranId, semesterId, guruId,
        nilaiHarian, nilaiUts, nilaiUas, catatan,
        bobot_harian, bobot_uts, bobot_uas, nilaiAkhir
      ]);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  update: async (id, data) => {
    const client = await require('../config/db').getClient();
    try {
      await client.query('BEGIN');
      
      const { nilaiHarian, nilaiUts, nilaiUas, catatan } = data;
      
      // Fetch current data to get the mapel
      const curr = await client.query('SELECT mata_pelajaran_id FROM academic.nilai WHERE id = $1', [id]);
      if (curr.rows.length === 0) throw new Error('Data nilai tidak ditemukan');
      
      const mataPelajaranId = curr.rows[0].mata_pelajaran_id;

      // Fetch bobot
      const bobotRes = await client.query('SELECT bobot_harian, bobot_uts, bobot_uas FROM academic.bobot_nilai WHERE mata_pelajaran_id = $1', [mataPelajaranId]);
      if (bobotRes.rows.length === 0) throw new Error('Bobot nilai untuk mata pelajaran ini belum diatur.');
      
      const { bobot_harian, bobot_uts, bobot_uas } = bobotRes.rows[0];
      
      const nilaiAkhir = (
        (nilaiHarian * bobot_harian / 100) +
        (nilaiUts * bobot_uts / 100) +
        (nilaiUas * bobot_uas / 100)
      );

      const sql = `
        UPDATE academic.nilai
        SET nilai_harian = $1,
            nilai_uts = $2,
            nilai_uas = $3,
            catatan = COALESCE($4, catatan),
            bobot_harian = $5,
            bobot_uts = $6,
            bobot_uas = $7,
            nilai_akhir = $8
        WHERE id = $9 RETURNING *
      `;
      const result = await client.query(sql, [
        nilaiHarian, nilaiUts, nilaiUas, catatan,
        bobot_harian, bobot_uts, bobot_uas, nilaiAkhir, id
      ]);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  delete: async (id) => {
    const result = await query('DELETE FROM academic.nilai WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  }
};

module.exports = NilaiRepository;
