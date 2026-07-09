'use strict';

const { query } = require('../config/db');

const RaporRepository = {
  findById: async (id) => {
    const sql = `
      SELECT r.*, s.nama_lengkap AS siswa_nama, s.nis, k.nama_kelas, sm.nama AS semester_nama,
             u1.nama AS generated_by_nama, u2.nama AS published_by_nama
      FROM academic.rapor r
      INNER JOIN academic.siswa s ON r.siswa_id = s.id
      INNER JOIN academic.kelas k ON r.kelas_id = k.id
      INNER JOIN academic.semester sm ON r.semester_id = sm.id
      LEFT JOIN shared.users u1 ON r.generated_by = u1.id
      LEFT JOIN shared.users u2 ON r.published_by = u2.id
      WHERE r.id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  findBySiswa: async (siswaId) => {
    const sql = `
      SELECT r.*, sm.nama AS semester_nama, k.nama_kelas
      FROM academic.rapor r
      INNER JOIN academic.semester sm ON r.semester_id = sm.id
      INNER JOIN academic.kelas k ON r.kelas_id = k.id
      WHERE r.siswa_id = $1
      ORDER BY sm.tanggal_mulai DESC
    `;
    const result = await query(sql, [siswaId]);
    return result.rows;
  },

  findByKelas: async (kelasId, semesterId) => {
    const sql = `
      SELECT r.*, s.nama_lengkap AS siswa_nama, s.nis
      FROM academic.rapor r
      INNER JOIN academic.siswa s ON r.siswa_id = s.id
      WHERE r.kelas_id = $1 AND r.semester_id = $2
      ORDER BY r.peringkat NULLS LAST, r.rata_rata DESC
    `;
    const result = await query(sql, [kelasId, semesterId]);
    return result.rows;
  },

  /**
   * Internal function to calculate avg and grade
   */
  _computeRataRata: async (client, siswaId, semesterId) => {
    const avgSql = `
      SELECT COALESCE(AVG(nilai_akhir), 0) AS avg_nilai 
      FROM academic.nilai 
      WHERE siswa_id = $1 AND semester_id = $2
    `;
    const res = await client.query(avgSql, [siswaId, semesterId]);
    const avg = parseFloat(res.rows[0].avg_nilai).toFixed(2);
    
    let kategori = 'D';
    if (avg >= 90) kategori = 'A';
    else if (avg >= 80) kategori = 'B';
    else if (avg >= 70) kategori = 'C';
    
    return { avg, kategori };
  },

  /**
   * Internal function to upsert rapor
   */
  _upsertRapor: async (client, siswaId, semesterId, kelasId, userId, avg, kategori, keterangan) => {
    const check = await client.query('SELECT id, is_published FROM academic.rapor WHERE siswa_id = $1 AND semester_id = $2', [siswaId, semesterId]);
    
    if (check.rows.length > 0) {
      if (check.rows[0].is_published) {
        throw new Error(`Rapor untuk siswa ${siswaId} sudah dipublish dan tidak bisa digenerate ulang.`);
      }
      const id = check.rows[0].id;
      const upSql = `
        UPDATE academic.rapor 
        SET kelas_id = $1, rata_rata = $2, nilai_kategori = $3, 
            keterangan_wali = COALESCE($4, keterangan_wali), generated_by = $5
        WHERE id = $6 RETURNING *
      `;
      const res = await client.query(upSql, [kelasId, avg, kategori, keterangan, userId, id]);
      return res.rows[0];
    } else {
      const inSql = `
        INSERT INTO academic.rapor (siswa_id, semester_id, kelas_id, rata_rata, nilai_kategori, keterangan_wali, generated_by, is_published)
        VALUES ($1, $2, $3, $4, $5, $6, $7, false)
        RETURNING *
      `;
      const res = await client.query(inSql, [siswaId, semesterId, kelasId, avg, kategori, keterangan, userId]);
      return res.rows[0];
    }
  },

  generatePerSiswa: async (siswaId, semesterId, kelasId, userId, keteranganWali = null) => {
    const client = await require('../config/db').getClient();
    try {
      await client.query('BEGIN');
      const { avg, kategori } = await RaporRepository._computeRataRata(client, siswaId, semesterId);
      const result = await RaporRepository._upsertRapor(client, siswaId, semesterId, kelasId, userId, avg, kategori, keteranganWali);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  generatePerKelas: async (kelasId, semesterId, userId) => {
    const client = await require('../config/db').getClient();
    try {
      await client.query('BEGIN');
      
      // Ambil seluruh siswa aktif di kelas tersebut
      const sSql = `SELECT id FROM academic.siswa WHERE kelas_id = $1 AND status = 'aktif' AND deleted_at IS NULL`;
      const siswaList = await client.query(sSql, [kelasId]);
      
      if (siswaList.rows.length === 0) throw new Error('Tidak ada siswa di kelas ini');

      for (const row of siswaList.rows) {
        const sId = row.id;
        const { avg, kategori } = await RaporRepository._computeRataRata(client, sId, semesterId);
        // Kita tangkap error jika is_published true secara per-siswa
        try {
          await RaporRepository._upsertRapor(client, sId, semesterId, kelasId, userId, avg, kategori, null);
        } catch (e) {
          // Skip if already published
          if (!e.message.includes('sudah dipublish')) throw e;
        }
      }

      // Hitung Peringkat (Rank)
      // Gunakan ROW_NUMBER() over rata_rata untuk ranking otomatis
      const rankSql = `
        WITH Ranked AS (
          SELECT id, ROW_NUMBER() OVER (ORDER BY rata_rata DESC) as rank_no
          FROM academic.rapor
          WHERE kelas_id = $1 AND semester_id = $2
        )
        UPDATE academic.rapor r
        SET peringkat = CAST(rk.rank_no AS VARCHAR)
        FROM Ranked rk
        WHERE r.id = rk.id
      `;
      await client.query(rankSql, [kelasId, semesterId]);

      await client.query('COMMIT');
      return { success: true, count: siswaList.rows.length };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  publish: async (kelasId, semesterId, userId) => {
    const sql = `
      UPDATE academic.rapor
      SET is_published = true,
          published_at = NOW(),
          published_by = $1
      WHERE kelas_id = $2 AND semester_id = $3 AND is_published = false
      RETURNING id
    `;
    const result = await query(sql, [userId, kelasId, semesterId]);
    return result.rows;
  }
};

module.exports = RaporRepository;
