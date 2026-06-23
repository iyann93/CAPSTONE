require('dotenv').config();
const { pool } = require('./src/config/db');

async function check() {
  // Check komponen_spp aktif
  const k = await pool.query(`SELECT id, nama, nominal, is_aktif, kelas_id FROM finance.komponen_spp WHERE is_aktif = true`);
  console.log('=== Komponen SPP aktif:', k.rows.length, '===');
  k.rows.forEach(r => console.log('  -', r.nama, '| nominal:', r.nominal, '| kelas_id:', r.kelas_id));

  // Check siswa aktif
  const s = await pool.query(`SELECT COUNT(*) as total FROM academic.siswa WHERE status = 'aktif' AND deleted_at IS NULL`);
  console.log('\n=== Siswa aktif:', s.rows[0].total, '===');

  // Sample 3 siswa aktif
  const s2 = await pool.query(`SELECT id, nama_lengkap, status, kelas_id, deleted_at FROM academic.siswa WHERE status = 'aktif' AND deleted_at IS NULL LIMIT 3`);
  s2.rows.forEach(r => console.log('  -', r.nama_lengkap, '| status:', r.status, '| kelas_id:', r.kelas_id));

  // If no active students, check all students
  if (parseInt(s.rows[0].total) === 0) {
    const all = await pool.query(`SELECT id, nama_lengkap, status, deleted_at FROM academic.siswa LIMIT 5`);
    console.log('\n=== Sample semua siswa (status any) ===');
    all.rows.forEach(r => console.log('  -', r.nama_lengkap, '| status:', r.status, '| deleted_at:', r.deleted_at));
  }

  // Check tagihan bulan ini
  const bulanIni = new Date().getMonth() + 1;
  const tahunIni = new Date().getFullYear();
  const t = await pool.query(`SELECT COUNT(*) as total FROM finance.tagihan_spp WHERE bulan = $1 AND tahun = $2`, [bulanIni, tahunIni]);
  console.log(`\n=== Tagihan bulan ${bulanIni}/${tahunIni}:`, t.rows[0].total, '===');

  // Sample tagihan terbaru
  const tSample = await pool.query(`SELECT t.id, t.bulan, t.tahun, t.nominal, t.status, s.nama_lengkap FROM finance.tagihan_spp t JOIN academic.siswa s ON t.siswa_id = s.id ORDER BY t.created_at DESC LIMIT 5`);
  console.log('=== Tagihan terbaru ===');
  tSample.rows.forEach(r => console.log('  -', r.nama_lengkap, '| bulan:', r.bulan, '/', r.tahun, '| nominal:', r.nominal, '| status:', r.status));

  pool.end();
}

check().catch(e => { console.error('ERROR:', e.message); pool.end(); });
