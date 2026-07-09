const { pool } = require('./src/config/db');

async function cleanAllDummyTagihan() {
  try {
    // Delete bukti_pembayaran linked to dummy tagihan
    const resBukti = await pool.query(`
      DELETE FROM finance.bukti_pembayaran 
      WHERE transaksi_id IN (
        SELECT id FROM finance.transaksi_pembayaran
        WHERE tagihan_id IN (
          SELECT id FROM finance.tagihan_spp WHERE bulan != 6 OR tahun != 2026
        )
      )
    `);
    console.log("Deleted dummy bukti:", resBukti.rowCount);

    // Delete transaksi_pembayaran linked to dummy tagihan
    const resTx = await pool.query(`
      DELETE FROM finance.transaksi_pembayaran
      WHERE tagihan_id IN (
        SELECT id FROM finance.tagihan_spp WHERE bulan != 6 OR tahun != 2026
      )
    `);
    console.log("Deleted dummy transaksi:", resTx.rowCount);

    // Delete the dummy tagihan itself
    const resTagihan = await pool.query(`
      DELETE FROM finance.tagihan_spp
      WHERE bulan != 6 OR tahun != 2026
    `);
    console.log("Deleted dummy tagihan:", resTagihan.rowCount);

  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

cleanAllDummyTagihan();
