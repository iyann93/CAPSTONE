require('dotenv').config();
const { pool } = require('./src/config/db');

async function fixNominal() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update semua tagihan belum_bayar agar nominalnya sesuai komponen_spp terkini
    const result = await client.query(`
      UPDATE finance.tagihan_spp t
      SET nominal = k.nominal,
          updated_at = NOW()
      FROM finance.komponen_spp k
      WHERE t.komponen_spp_id = k.id
        AND t.status = 'belum_bayar'
        AND t.nominal != k.nominal
      RETURNING t.id, t.bulan, t.tahun, t.nominal
    `);

    console.log(`Updated ${result.rows.length} tagihan nominal.`);
    result.rows.slice(0, 10).forEach(r => console.log(` - bulan ${r.bulan}/${r.tahun} | new nominal: ${r.nominal}`));

    await client.query('COMMIT');
    console.log('Done!');
  } catch(e) {
    await client.query('ROLLBACK');
    console.error('Error:', e.message);
  } finally {
    client.release();
    pool.end();
  }
}

fixNominal();
