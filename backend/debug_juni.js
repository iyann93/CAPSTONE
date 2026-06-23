require('dotenv').config();
const { pool } = require('./src/config/db');

async function checkJuni() {
  try {
    const res = await pool.query(`
      SELECT t.siswa_id, s.nama_lengkap, k.nama_kelas, t.komponen_spp_id, ks.nama as komponen_nama, COUNT(*) as jml
      FROM finance.tagihan_spp t
      JOIN academic.siswa s ON t.siswa_id = s.id
      LEFT JOIN academic.kelas k ON s.kelas_id = k.id
      LEFT JOIN finance.komponen_spp ks ON t.komponen_spp_id = ks.id
      WHERE t.bulan = 6
      GROUP BY t.siswa_id, s.nama_lengkap, k.nama_kelas, t.komponen_spp_id, ks.nama
      ORDER BY s.nama_lengkap, ks.nama
    `);

    console.log(`Total data baris tagihan bulan Juni: ${res.rows.length}`);
    console.log(res.rows.slice(0, 15)); // print first 15 rows

    // summary per siswa
    const res2 = await pool.query(`
      SELECT s.nama_lengkap, COUNT(*) as total_tagihan
      FROM finance.tagihan_spp t
      JOIN academic.siswa s ON t.siswa_id = s.id
      WHERE t.bulan = 6
      GROUP BY s.nama_lengkap
      ORDER BY total_tagihan DESC
    `);
    console.log('\nTotal tagihan per siswa di bulan Juni:');
    console.log(res2.rows.slice(0, 10));

  } catch(e) {
    console.error(e.message);
  } finally {
    pool.end();
  }
}

checkJuni();
