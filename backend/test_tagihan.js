require('dotenv').config();
const db = require('./src/config/db');

async function testSpp() {
  const client = await db.getClient();
  try {
    const res = await client.query(`
      SELECT t.id, t.nominal, t.potongan, t.nominal_akhir, t.status, k.kode_kelas
      FROM finance.tagihan_spp t
      JOIN academic.siswa s ON t.siswa_id = s.id
      JOIN academic.kelas k ON s.kelas_id = k.id
      WHERE t.status != 'lunas'
      LIMIT 10
    `);
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    process.exit(0);
  }
}

testSpp();
