require('dotenv').config();
const db = require('./src/config/db');

async function testFetch() {
  const absensi = await db.query(`
    SELECT a.*, s.nama_lengkap, k.nama_kelas 
    FROM academic.absensi a 
    JOIN academic.siswa s ON a.siswa_id = s.id 
    JOIN academic.kelas k ON s.kelas_id = k.id
  `);
  console.log(`Total Absensi in DB: ${absensi.rows.length}`);
  const absClasses = {};
  absensi.rows.forEach(r => {
    absClasses[r.nama_kelas] = (absClasses[r.nama_kelas] || 0) + 1;
  });
  console.log("Absensi per class:", absClasses);

  const nilai = await db.query(`
    SELECT n.*, s.nama_lengkap, k.nama_kelas 
    FROM academic.nilai n 
    JOIN academic.siswa s ON n.siswa_id = s.id 
    JOIN academic.kelas k ON s.kelas_id = k.id
  `);
  console.log(`Total Nilai in DB: ${nilai.rows.length}`);
  const nilaiClasses = {};
  nilai.rows.forEach(r => {
    nilaiClasses[r.nama_kelas] = (nilaiClasses[r.nama_kelas] || 0) + 1;
  });
  console.log("Nilai per class:", nilaiClasses);
  process.exit(0);
}
testFetch();
