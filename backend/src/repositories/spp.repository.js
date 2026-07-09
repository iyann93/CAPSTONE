'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const SppRepository = {
  findAllTagihan: async ({ limit, offset, search, sort, siswaId, kelasId, bulan, tahun, status }) => {
    const wb = whereBuilder();
    wb.addLike(search, ['s.nama_lengkap', 's.nis']);
    wb.addExact(siswaId, 't.siswa_id');
    wb.addExact(kelasId, 's.kelas_id');
    wb.addExact(bulan, 't.bulan');
    wb.addExact(tahun, 't.tahun');
    wb.addExact(status, 't.status');
    
    const { where, values, nextIdx } = wb.build();
    const orderBy = buildOrderBy(sort, { jatuh_tempo: 't.jatuh_tempo' }, 't.tahun DESC, t.bulan DESC, s.nama_lengkap ASC');

    const sql = `
      SELECT t.*, s.nama_lengkap AS siswa_nama, s.nis, k.nama_kelas
      FROM finance.tagihan_spp t
      INNER JOIN academic.siswa s ON t.siswa_id = s.id
      LEFT JOIN academic.kelas k ON s.kelas_id = k.id
      ${where}
      ${orderBy}
      LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
    `;
    const countSql = `
      SELECT COUNT(*) FROM finance.tagihan_spp t
      INNER JOIN academic.siswa s ON t.siswa_id = s.id
      ${where}
    `;
    
    const [data, count] = await Promise.all([
      query(sql, [...values, limit, offset]),
      query(countSql, values),
    ]);
    return { rows: data.rows, total: parseInt(count.rows[0].count, 10) };
  },

  createTagihan: async (data, userId) => {
    const { siswaId, komponenSppId, bulan, tahun, nominal, beasiswaId, potongan, jatuhTempo } = data;
    const nominalAkhir = nominal - (potongan || 0);
    const sql = `
      INSERT INTO finance.tagihan_spp (
        siswa_id, komponen_spp_id, bulan, tahun, nominal, beasiswa_id, potongan,
        status, jatuh_tempo, created_at, updated_at, updated_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'belum_bayar', $8, NOW(), NOW(), $9)
      RETURNING *
    `;
    const res = await query(sql, [
      siswaId, komponenSppId, bulan, tahun, nominal, beasiswaId || null, potongan || 0, jatuhTempo, userId
    ]);
    return res.rows[0];
  },

  updateStatusMenunggakOtomatis: async () => {
    // Dipanggil berkala (cron) atau manual untuk mengubah status yang lewat jatuh tempo
    const sql = `
      UPDATE finance.tagihan_spp
      SET status = 'belum_bayar'
      WHERE status = 'belum_bayar' AND jatuh_tempo < CURRENT_DATE
      RETURNING id
    `;
    const res = await query(sql);
    return res.rows.length;
  },

  findById: async (id) => {
    const sql = `SELECT * FROM finance.tagihan_spp WHERE id = $1`;
    const res = await query(sql, [id]);
    return res.rows[0];
  },

  updateBuktiUrl: async (id, url) => {
    const sql = `
      UPDATE finance.tagihan_spp 
      SET status = 'menunggu_konfirmasi', 
          bukti_pembayaran_url = $1, 
          tanggal_upload_bukti = NOW(),
          updated_at = NOW()
      WHERE id = $2 
      RETURNING *
    `;
    const res = await query(sql, [url, id]);
    return res.rows[0];
  },

  tolakBukti: async (id) => {
    const sql = `
      UPDATE finance.tagihan_spp 
      SET status = 'ditolak', 
          bukti_pembayaran_url = NULL, 
          tanggal_upload_bukti = NULL,
          updated_at = NOW()
      WHERE id = $1 
      RETURNING *
    `;
    const res = await query(sql, [id]);
    return res.rows[0];
  },

  syncBeasiswaToTagihan: async (siswaId) => {
    const client = await require('../config/db').getClient();
    try {
      await client.query('BEGIN');
      
      // Ambil beasiswa aktif untuk siswa ini
      const beasiswaRes = await client.query(
        `SELECT id, nominal FROM finance.beasiswa WHERE siswa_id = $1 AND status = 'aktif'`,
        [siswaId]
      );
      const activeBeasiswa = beasiswaRes.rows[0];
      
      const beasiswaId = activeBeasiswa ? activeBeasiswa.id : null;
      const beasiswaNominal = activeBeasiswa ? parseFloat(activeBeasiswa.nominal) : 0;

      // Update tagihan_spp yang statusnya belum_bayar
      const sql = `
        UPDATE finance.tagihan_spp
        SET beasiswa_id = $1,
            potongan = CASE WHEN $2 > 0 THEN LEAST(nominal, $2::numeric) ELSE 0 END,
            updated_at = NOW()
        WHERE siswa_id = $3 AND status = 'belum_bayar'
      `;
      await client.query(sql, [beasiswaId, beasiswaNominal, siswaId]);

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error syncing beasiswa to tagihan:', err);
    } finally {
      client.release();
    }
  }
};

module.exports = SppRepository;
