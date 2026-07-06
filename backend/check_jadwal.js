require('dotenv').config();
const db = require('./src/config/db');

async function checkJadwal() {
  const result = await db.query('SELECT jp.id, jp.kelas_id, k.nama_kelas FROM academic.jadwal_pelajaran jp JOIN academic.kelas k ON jp.kelas_id = k.id');
  console.log(result.rows);
  process.exit(0);
}
checkJadwal();
