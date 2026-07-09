require('dotenv').config();
const { query } = require('./src/config/db');

async function cleanData() {
  try {
    await query('BEGIN');
    
    // Hapus bukti pembayaran terlebih dahulu karena ada foreign key constraint
    try {
      console.log('Menghapus bukti_pembayaran...');
      await query('DELETE FROM finance.bukti_pembayaran');
    } catch (e) {
      console.log('Tabel bukti_pembayaran tidak ada atau gagal dihapus:', e.message);
    }

    // Hapus riwayat transaksi pembayaran SPP
    console.log('Menghapus transaksi_pembayaran...');
    await query('DELETE FROM finance.transaksi_pembayaran');
    
    // Reset status tagihan kembali ke 'belum_bayar'
    console.log('Reset tagihan_spp...');
    const res = await query(`
      UPDATE finance.tagihan_spp 
      SET status = 'belum_bayar', 
          bukti_pembayaran_url = NULL, 
          tanggal_upload_bukti = NULL
    `);
    console.log(`Berhasil mereset ${res.rowCount} tagihan SPP menjadi 'belum_bayar'.`);
    
    await query('COMMIT');
    console.log('Proses pembersihan selesai!');
  } catch (err) {
    await query('ROLLBACK');
    console.error('Gagal membersihkan data:', err);
  } finally {
    process.exit();
  }
}

cleanData();
