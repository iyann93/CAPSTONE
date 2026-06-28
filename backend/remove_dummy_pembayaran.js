const { pool } = require('./src/config/db');

async function checkData() {
  try {
    const resTransaksi = await pool.query(`
      SELECT tp.id, tp.jumlah_bayar, t.siswa_id, s.nama_lengkap, tp.tagihan_id
      FROM finance.transaksi_pembayaran tp
      JOIN finance.tagihan_spp t ON tp.tagihan_id = t.id
      JOIN academic.siswa s ON t.siswa_id = s.id
      WHERE s.nama_lengkap ILIKE '%ahmad f%'
    `);
    console.log("Transaksi Ahmad F:", resTransaksi.rows);

    const dummyTx = resTransaksi.rows.find(tx => parseFloat(tx.jumlah_bayar) === 300000);
    
    if (dummyTx) {
       console.log("Found dummy tx with 300000:", dummyTx.id);

       // 1. Delete bukti_pembayaran
       const resBukti = await pool.query(`
         DELETE FROM finance.bukti_pembayaran
         WHERE transaksi_id = $1 RETURNING id
       `, [dummyTx.id]);
       console.log("Deleted dummy bukti_pembayaran:", resBukti.rowCount);

       // 2. Delete transaksi pembayaran
       const resDeleteTx = await pool.query(`
         DELETE FROM finance.transaksi_pembayaran 
         WHERE id = $1 RETURNING id
       `, [dummyTx.id]);
       console.log("Deleted dummy transaksi_pembayaran 300000:", resDeleteTx.rowCount);

       // 3. Update status tagihan_spp if needed
       const resUpdateTagihan = await pool.query(`
         UPDATE finance.tagihan_spp
         SET status = 'belum_bayar'
         WHERE id = $1 AND status != 'belum_bayar'
       `, [dummyTx.tagihan_id]);
       console.log("Updated tagihan status back to belum_bayar:", resUpdateTagihan.rowCount);

    } else {
       console.log("Dummy tx with 300000 not found for Ahmad F");
    }
  } catch (error) {
    console.error(error);
  } finally {
    pool.end();
  }
}

checkData();
