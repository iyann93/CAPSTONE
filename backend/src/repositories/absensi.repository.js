'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const SORT_MAP = { tanggal: 'a.tanggal', created_at: 'a.created_at', siswa: 's.nama' };

const AbsensiRepository = {
  findAll: async ({ limit, offset, search, sort, jadwalId, siswaId, kelasId, status, tanggal }) => {
    const wb = whereBuilder();
    wb.addLike(search, ['s.nama', 's.nis', 'm.nama_mapel']);
    wb.addExact(jadwalId, 'a.jadwal_id');
    wb.addExact(siswaId, 'a.siswa_id');
    wb.addExact(status, 'a.status');
    wb.addExact(tanggal, 'a.tanggal');
    
    // To filter by kelasId, we need to join jadwal_pelajaran
    if (kelasId) {
      wb.addExact(kelasId, 'jp.kelas_id');
    }
    
    const { where, values, nextIdx } = wb.build();
    const orderBy = buildOrderBy(sort, SORT_MAP, 'a.tanggal DESC, s.nama ASC');

    const sql = `
      SELECT a.id, a.siswa_id, a.jadwal_id, a.tanggal, a.status, a.keterangan, a.dicatat_oleh, a.created_at,
             s.nama AS siswa_nama, s.nis,
             jp.kelas_id, k.nama_kelas,
             jp.mapel_id, m.nama_mapel,
             u.nama AS pencatat_nama
      FROM academic.absensi a
      LEFT JOIN academic.siswa s ON a.siswa_id = s.id
      LEFT JOIN academic.jadwal_pelajaran jp ON a.jadwal_id = jp.id
      LEFT JOIN academic.kelas k ON jp.kelas_id = k.id
      LEFT JOIN academic.mapel m ON jp.mapel_id = m.id
      LEFT JOIN shared.users u ON a.dicatat_oleh = u.id
      ${where}
      ${orderBy}
      LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
    `;
    
    const countSql = `
      SELECT COUNT(*) FROM academic.absensi a
      LEFT JOIN academic.siswa s ON a.siswa_id = s.id
      LEFT JOIN academic.jadwal_pelajaran jp ON a.jadwal_id = jp.id
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
      SELECT a.*, s.nama AS siswa_nama, jp.kelas_id, k.nama_kelas, m.nama_mapel
      FROM academic.absensi a
      LEFT JOIN academic.siswa s ON a.siswa_id = s.id
      LEFT JOIN academic.jadwal_pelajaran jp ON a.jadwal_id = jp.id
      LEFT JOIN academic.kelas k ON jp.kelas_id = k.id
      LEFT JOIN academic.mapel m ON jp.mapel_id = m.id
      WHERE a.id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  /**
   * Menggunakan transaction untuk Bulk Insert/Update (Upsert)
   * Karena seringkali guru melakukan absensi untuk sekelas sekaligus
   */
  bulkUpsert: async (absensiDataArray, dicatatOleh) => {
    const client = await require('../config/db').getClient();
    try {
      await client.query('BEGIN');
      const results = [];
      
      for (const item of absensiDataArray) {
        const { siswaId, jadwalId, tanggal, status, keterangan } = item;
        
        // Cek apakah sudah ada absensi untuk siswa + jadwal + tanggal tsb
        const checkSql = `SELECT id FROM academic.absensi WHERE siswa_id = $1 AND jadwal_id = $2 AND tanggal = $3`;
        const checkRes = await client.query(checkSql, [siswaId, jadwalId, tanggal]);
        
        if (checkRes.rows.length > 0) {
          // Update
          const id = checkRes.rows[0].id;
          const upSql = `
            UPDATE academic.absensi 
            SET status = $1, keterangan = $2, dicatat_oleh = $3 
            WHERE id = $4 RETURNING *
          `;
          const upRes = await client.query(upSql, [status, keterangan, dicatatOleh, id]);
          results.push(upRes.rows[0]);
        } else {
          // Insert
          const inSql = `
            INSERT INTO academic.absensi (siswa_id, jadwal_id, tanggal, status, keterangan, dicatat_oleh, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *
          `;
          const inRes = await client.query(inSql, [siswaId, jadwalId, tanggal, status, keterangan, dicatatOleh]);
          results.push(inRes.rows[0]);
        }
      }
      
      await client.query('COMMIT');
      return results;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  update: async (id, { status, keterangan, dicatatOleh }) => {
    const sql = `
      UPDATE academic.absensi
      SET status = COALESCE($1, status),
          keterangan = COALESCE($2, keterangan),
          dicatat_oleh = COALESCE($3, dicatat_oleh)
      WHERE id = $4 RETURNING *
    `;
    const result = await query(sql, [status, keterangan, dicatatOleh, id]);
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM academic.absensi WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  },

  // === LAPORAN & STATISTIK ===

  getRekapBulanan: async (bulan, tahun, kelasId = null) => {
    // bulan = 1-12, tahun = YYYY
    const values = [bulan, tahun];
    let kelasFilter = '';
    if (kelasId) {
      kelasFilter = `AND jp.kelas_id = $3`;
      values.push(kelasId);
    }
    
    const sql = `
      SELECT s.id AS siswa_id, s.nama AS siswa_nama, s.nis,
             SUM(CASE WHEN a.status = 'Hadir' THEN 1 ELSE 0 END) AS total_hadir,
             SUM(CASE WHEN a.status = 'Izin' THEN 1 ELSE 0 END) AS total_izin,
             SUM(CASE WHEN a.status = 'Sakit' THEN 1 ELSE 0 END) AS total_sakit,
             SUM(CASE WHEN a.status = 'Alpha' THEN 1 ELSE 0 END) AS total_alpha
      FROM academic.absensi a
      INNER JOIN academic.siswa s ON a.siswa_id = s.id
      INNER JOIN academic.jadwal_pelajaran jp ON a.jadwal_id = jp.id
      WHERE EXTRACT(MONTH FROM a.tanggal) = $1 AND EXTRACT(YEAR FROM a.tanggal) = $2
      ${kelasFilter}
      GROUP BY s.id, s.nama, s.nis
      ORDER BY s.nama ASC
    `;
    const result = await query(sql, values);
    return result.rows;
  },

  getRekapSemester: async (semesterId, kelasId = null) => {
    const values = [semesterId];
    let kelasFilter = '';
    if (kelasId) {
      kelasFilter = `AND jp.kelas_id = $2`;
      values.push(kelasId);
    }

    const sql = `
      SELECT s.id AS siswa_id, s.nama AS siswa_nama, s.nis,
             SUM(CASE WHEN a.status = 'Hadir' THEN 1 ELSE 0 END) AS total_hadir,
             SUM(CASE WHEN a.status = 'Izin' THEN 1 ELSE 0 END) AS total_izin,
             SUM(CASE WHEN a.status = 'Sakit' THEN 1 ELSE 0 END) AS total_sakit,
             SUM(CASE WHEN a.status = 'Alpha' THEN 1 ELSE 0 END) AS total_alpha
      FROM academic.absensi a
      INNER JOIN academic.siswa s ON a.siswa_id = s.id
      INNER JOIN academic.jadwal_pelajaran jp ON a.jadwal_id = jp.id
      WHERE jp.semester_id = $1
      ${kelasFilter}
      GROUP BY s.id, s.nama, s.nis
      ORDER BY s.nama ASC
    `;
    const result = await query(sql, values);
    return result.rows;
  },

  getStatistikGlobal: async (startDate, endDate) => {
    const sql = `
      SELECT 
        COUNT(id) AS total_records,
        SUM(CASE WHEN status = 'Hadir' THEN 1 ELSE 0 END) AS total_hadir,
        SUM(CASE WHEN status = 'Izin' THEN 1 ELSE 0 END) AS total_izin,
        SUM(CASE WHEN status = 'Sakit' THEN 1 ELSE 0 END) AS total_sakit,
        SUM(CASE WHEN status = 'Alpha' THEN 1 ELSE 0 END) AS total_alpha
      FROM academic.absensi
      WHERE tanggal BETWEEN $1 AND $2
    `;
    const result = await query(sql, [startDate, endDate]);
    return result.rows[0];
  }
};

module.exports = AbsensiRepository;
