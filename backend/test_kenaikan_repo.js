require('dotenv').config();
const db = require('./src/config/db');

async function test() {
  try {
    const KenaikanKelasRepository = require('./src/repositories/kenaikan_kelas.repository');
    const siswaRes = await db.query('SELECT id, kelas_id FROM academic.siswa LIMIT 1');
    const siswa = siswaRes.rows[0];

    const dataArr = [{
        siswaId: siswa.id,
        kelasAsalId: siswa.kelas_id,
        kelasTujuanId: null,
        status: 'Belum',
        keterangan: 'Menunggu'
    }];
    
    console.log('Testing bulkUpsert...');
    const res = await KenaikanKelasRepository.bulkUpsert(dataArr, '00000001-0000-0000-0000-000000000001');
    console.log('Result:', res);
  } catch(e) {
    console.error('Stack Trace:', e.stack);
  } finally {
    process.exit();
  }
}
test();
