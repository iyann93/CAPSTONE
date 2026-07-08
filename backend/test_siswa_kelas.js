require('dotenv').config();
const db = require('./src/config/db');

async function test() {
  try {
    const resKelas = await db.query("SELECT id FROM academic.kelas WHERE nama_kelas = 'Kelas IX'");
    const kelasId = resKelas.rows[0].id;
    console.log('Kelas IX ID:', kelasId);
    
    const { whereBuilder } = require('./src/utils/queryBuilder');
    const wb = whereBuilder();
    wb.addExact(kelasId, 's.kelas_id');
    const { where, values, nextIdx } = wb.build();
    
    const sql = `
      SELECT s.id, s.nis, s.nama_lengkap, s.kelas_id
      FROM academic.siswa s
      ${where}
    `;
    const resSiswa = await db.query(sql, values);
    console.log('Siswa Count:', resSiswa.rows.length);
    console.log('Siswa Data:', resSiswa.rows);
  } catch(e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
test();
