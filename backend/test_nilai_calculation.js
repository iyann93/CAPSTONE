require('dotenv').config();
const db = require('./src/config/db');
const NilaiRepository = require('./src/repositories/nilai.repository');

async function test() {
  try {
    const siswaRes = await db.query('SELECT id, kelas_id FROM academic.siswa LIMIT 1');
    const siswa = siswaRes.rows[0];
    
    const mapelRes = await db.query('SELECT id FROM academic.mata_pelajaran LIMIT 1');
    const mapel = mapelRes.rows[0];
    
    const semesterRes = await db.query('SELECT id FROM academic.semester LIMIT 1');
    const semester = semesterRes.rows[0];
    
    const guruRes = await db.query('SELECT id FROM academic.guru LIMIT 1');
    const guru = guruRes.rows[0];
    
    const data = {
        siswaId: siswa.id,
        mataPelajaranId: mapel.id,
        semesterId: semester.id,
        guruId: guru.id,
        nilaiHarian: 80,
        nilaiUts: 85,
        nilaiUas: 90,
        catatan: "Test calculation"
    };
    
    const res = await NilaiRepository.create(data);
    console.log("Inserted Nilai:", res);
    
    // Test update
    const updated = await NilaiRepository.update(res.id, {
        nilaiHarian: 100,
        nilaiUts: 100,
        nilaiUas: 100,
        catatan: "Test update calculation"
    });
    console.log("Updated Nilai:", updated);
    
  } catch(e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
test();
