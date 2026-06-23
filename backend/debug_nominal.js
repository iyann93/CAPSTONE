require('dotenv').config();
const { pool } = require('./src/config/db');
async function check() {
  const t = await pool.query(
    `SELECT t.bulan, t.tahun, t.nominal, t.nominal_akhir, t.status, 
            s.nama_lengkap, k.nama_kelas 
     FROM finance.tagihan_spp t 
     JOIN academic.siswa s ON t.siswa_id = s.id 
     LEFT JOIN academic.kelas k ON s.kelas_id = k.id 
     ORDER BY t.tahun, t.bulan, s.nama_lengkap LIMIT 25`
  );
  console.log('=== Tagihan semua bulan ===');
  t.rows.forEach(r => {
    console.log(`Bulan ${r.bulan}/${r.tahun} | ${r.nama_lengkap} | ${r.nama_kelas} | nominal: ${r.nominal} | nominal_akhir: ${r.nominal_akhir} | status: ${r.status}`);
  });
  pool.end();
}
check().catch(e => { console.error(e.message); pool.end(); });
