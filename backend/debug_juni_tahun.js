require('dotenv').config();
const { pool } = require('./src/config/db');

async function checkJuni() {
  try {
    const res = await pool.query(`
      SELECT s.nama_lengkap, t.bulan, t.tahun, COUNT(*) as jml
      FROM finance.tagihan_spp t
      JOIN academic.siswa s ON t.siswa_id = s.id
      WHERE t.bulan = 6
      GROUP BY s.nama_lengkap, t.bulan, t.tahun
      ORDER BY s.nama_lengkap, t.tahun
    `);

    console.log(`Total group by siswa + tahun: ${res.rows.length}`);
    console.log(res.rows.slice(0, 15));

  } catch(e) {
    console.error(e.message);
  } finally {
    pool.end();
  }
}

checkJuni();
