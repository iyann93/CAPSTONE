'use strict';

const { query } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

const PembayaranRepository = {
  findAll: async ({ limit, offset, search, sort, tagihanId, siswaId, metode, tanggalAwal, tanggalAkhir }) => {
    const wb = whereBuilder();
    wb.addLike(search, ['tp.no_referensi', 's.nama', 's.nis']);
    wb.addExact(tagihanId, 'tp.tagihan_id');
    wb.addExact(siswaId, 't.siswa_id');
    wb.addExact(metode, 'tp.metode');
    
    if (tanggalAwal) wb.addCustom('tp.tanggal_bayar >= $idx', [tanggalAwal]);
    if (tanggalAkhir) wb.addCustom('tp.tanggal_bayar <= $idx', [tanggalAkhir]);

    const { where, values, nextIdx } = wb.build();
    const orderBy = buildOrderBy(sort, { tanggal: 'tp.tanggal_bayar' }, 'tp.tanggal_bayar DESC');

    const sql = `
      SELECT tp.*, 
             t.bulan, t.tahun, t.nominal_akhir AS tagihan_nominal,
             s.nama AS siswa_nama, s.nis,
             u.nama AS pencatat_nama
      FROM finance.transaksi_pembayaran tp
      INNER JOIN finance.tagihan_spp t ON tp.tagihan_id = t.id
      INNER JOIN academic.siswa s ON t.siswa_id = s.id
      LEFT JOIN shared.users u ON tp.dicatat_oleh = u.id
      ${where}
      ${orderBy}
      LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
    `;
    const countSql = `
      SELECT COUNT(*) FROM finance.transaksi_pembayaran tp
      INNER JOIN finance.tagihan_spp t ON tp.tagihan_id = t.id
      INNER JOIN academic.siswa s ON t.siswa_id = s.id
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
      SELECT tp.*, t.bulan, t.tahun, t.nominal_akhir, s.nama AS siswa_nama, s.nis
      FROM finance.transaksi_pembayaran tp
      INNER JOIN finance.tagihan_spp t ON tp.tagihan_id = t.id
      INNER JOIN academic.siswa s ON t.siswa_id = s.id
      WHERE tp.id = $1
    `;
    const res = await query(sql, [id]);
    return res.rows[0] || null;
  },

  /**
   * Pembayaran dengan Transaction: Insert ke transaksi_pembayaran -> Update tagihan_spp.status
   */
  processPembayaran: async (data, userId) => {
    const client = await require('../config/db').getClient();
    try {
      await client.query('BEGIN');
      const { tagihanId, jumlahBayar, metode, noReferensi, keterangan } = data;
      
      // 1. Ambil detail Tagihan
      const tagihanRes = await client.query('SELECT nominal_akhir, status FROM finance.tagihan_spp WHERE id = $1 FOR UPDATE', [tagihanId]);
      if (tagihanRes.rows.length === 0) throw new Error('Tagihan tidak ditemukan');
      
      const tagihan = tagihanRes.rows[0];
      if (tagihan.status === 'Lunas') throw new Error('Tagihan ini sudah lunas');
      
      // 2. Hitung total yang sudah dibayar sejauh ini
      const totalRes = await client.query('SELECT COALESCE(SUM(jumlah_bayar), 0) AS total_bayar FROM finance.transaksi_pembayaran WHERE tagihan_id = $1', [tagihanId]);
      const sudahDibayar = parseFloat(totalRes.rows[0].total_bayar);
      const totalHarusDibayar = parseFloat(tagihan.nominal_akhir);
      
      if ((sudahDibayar + parseFloat(jumlahBayar)) > totalHarusDibayar) {
        throw new Error('Jumlah bayar melebihi sisa tagihan');
      }

      // 3. Insert transaksi
      const inSql = `
        INSERT INTO finance.transaksi_pembayaran (tagihan_id, dicatat_oleh, jumlah_bayar, metode, tanggal_bayar, no_referensi, keterangan)
        VALUES ($1, $2, $3, $4, NOW(), $5, $6) RETURNING *
      `;
      const transRes = await client.query(inSql, [tagihanId, userId, jumlahBayar, metode, noReferensi, keterangan]);
      
      // 4. Update status Tagihan
      const sisaTagihan = totalHarusDibayar - (sudahDibayar + parseFloat(jumlahBayar));
      const newStatus = sisaTagihan === 0 ? 'Lunas' : 'Sebagian';
      
      await client.query(`UPDATE finance.tagihan_spp SET status = $1, updated_at = NOW(), updated_by = $2 WHERE id = $3`, [newStatus, userId, tagihanId]);

      await client.query('COMMIT');
      return { transaksi: transRes.rows[0], status_tagihan: newStatus, sisa_tagihan: sisaTagihan };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  getLaporanBulanan: async (bulan, tahun) => {
    // Rekap total uang masuk per metode pembayaran dalam bulan tersebut
    const sql = `
      SELECT metode, SUM(jumlah_bayar) AS total_pemasukan, COUNT(id) AS jumlah_transaksi
      FROM finance.transaksi_pembayaran
      WHERE EXTRACT(MONTH FROM tanggal_bayar) = $1 AND EXTRACT(YEAR FROM tanggal_bayar) = $2
      GROUP BY metode
    `;
    const res = await query(sql, [bulan, tahun]);
    return res.rows;
  }
};

module.exports = PembayaranRepository;
