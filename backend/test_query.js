require('dotenv').config();
const db = require('./src/config/db');
async function test() {
  const c = await db.query('SELECT id, nama_kelas FROM academic.kelas LIMIT 1');
  const kelas = c.rows[0];
  const s = await db.query('SELECT id, nama FROM academic.semester LIMIT 1');
  const semester = s.rows[0];
  console.log('kelas:', kelas.nama_kelas, kelas.id, 'semester:', semester.nama, semester.id);
  
  const NilaiRepo = require('./src/repositories/nilai.repository');
  const res = await NilaiRepo.findByKelas(kelas.id, semester.id);
  console.log(res);
  process.exit(0);
}
test();
