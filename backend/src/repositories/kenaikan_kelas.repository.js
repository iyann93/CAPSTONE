'use strict';

const { query } = require('../config/db');

const KenaikanKelasRepository = {
  // Ambil semua data kenaikan kelas untuk tahun ajaran tertentu
  findByTahunAjaran: async (tahunAjaranId) => {
    const sql = `
      SELECT k.*, 
             s.nama_lengkap AS siswa_nama, 
             s.nis,
             ka.nama_kelas AS kelas_asal,
             kt.nama_kelas AS kelas_tujuan
      FROM academic.kenaikan_kelas k
      LEFT JOIN academic.siswa s ON k.siswa_id = s.id
      LEFT JOIN academic.kelas ka ON k.kelas_asal_id = ka.id
      LEFT JOIN academic.kelas kt ON k.kelas_tujuan_id = kt.id
      WHERE k.tahun_ajaran_id = $1
    `;
    const res = await query(sql, [tahunAjaranId]);
    return res.rows;
  },

  // Simpan data kenaikan kelas (bulk)
  bulkUpsert: async (dataArr, tahunAjaranId) => {
    const client = await require('../config/db').getClient();
    try {
      await client.query('BEGIN');
      
      const results = [];
      for (const data of dataArr) {
        const { siswaId, kelasAsalId, kelasTujuanId, status, keterangan } = data;
        
        const check = await client.query(
          'SELECT id FROM academic.kenaikan_kelas WHERE siswa_id = $1 AND tahun_ajaran_id = $2',
          [siswaId, tahunAjaranId]
        );

        if (check.rows.length > 0) {
          const up = await client.query(`
            UPDATE academic.kenaikan_kelas 
            SET kelas_asal_id = $1, kelas_tujuan_id = $2, status = $3, keterangan = $4
            WHERE id = $5 RETURNING *
          `, [kelasAsalId, kelasTujuanId, status, keterangan, check.rows[0].id]);
          results.push(up.rows[0]);
        } else {
          const ins = await client.query(`
            INSERT INTO academic.kenaikan_kelas (siswa_id, tahun_ajaran_id, kelas_asal_id, kelas_tujuan_id, status, keterangan)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
          `, [siswaId, tahunAjaranId, kelasAsalId, kelasTujuanId, status, keterangan]);
          results.push(ins.rows[0]);
        }

        // Kalau status 'naik' dan kelasTujuanId ada, update siswa.kelas_id
        // Asumsi ini dilakukan saat "Proses" selesai
        if (status === 'naik' && kelasTujuanId) {
          await client.query('UPDATE academic.siswa SET kelas_id = $1 WHERE id = $2', [kelasTujuanId, siswaId]);
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
  }
};

module.exports = KenaikanKelasRepository;
