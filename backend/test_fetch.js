require('dotenv').config();
const db = require('./src/config/db');

async function testFetch() {
  const absensi = await db.query('SELECT * FROM academic.absensi');
  console.log(`Total Absensi: ${absensi.rows.length}`);
  if (absensi.rows.length > 0) {
    console.log('Sample Absensi:', absensi.rows[0]);
  }

  const nilai = await db.query('SELECT * FROM academic.nilai');
  console.log(`Total Nilai: ${nilai.rows.length}`);
  if (nilai.rows.length > 0) {
    console.log('Sample Nilai:', nilai.rows[0]);
  }
  process.exit(0);
}
testFetch();
