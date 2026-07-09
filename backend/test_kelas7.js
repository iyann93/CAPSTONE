require('dotenv').config();
const db = require('./src/config/db');

async function check() {
  const q = `
    SELECT s.id, s.nama_lengkap, k.nama_kelas 
    FROM academic.siswa s 
    JOIN academic.kelas k ON s.kelas_id = k.id
    ORDER BY k.nama_kelas
  `;
  const res = await db.query(q);
  console.table(res.rows);
  process.exit(0);
}
check();
