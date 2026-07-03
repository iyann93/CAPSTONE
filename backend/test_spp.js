require('dotenv').config();
const db = require('./src/config/db');

async function testSpp() {
  const client = await db.getClient();
  try {
    const res = await client.query(`
      SELECT k.kode_kelas, COUNT(s.id) as num_students, t.nominal
      FROM academic.siswa s
      JOIN academic.kelas k ON s.kelas_id = k.id
      LEFT JOIN finance.tagihan_spp t ON t.siswa_id = s.id
      GROUP BY k.kode_kelas, t.nominal
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
