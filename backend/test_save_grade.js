require('dotenv').config();
const db = require('./src/config/db');
const NilaiService = require('./src/services/nilai.service');

async function test() {
  try {
    const siswa = await db.query('SELECT * FROM academic.siswa LIMIT 1');
    const mapel = await db.query('SELECT * FROM academic.mata_pelajaran LIMIT 1');
    const semester = await db.query('SELECT * FROM academic.semester LIMIT 1');

    // Get actual user UUID from academic.guru
    const guru = await db.query('SELECT user_id FROM academic.guru LIMIT 1');

    if (!siswa.rows.length || !mapel.rows.length || !semester.rows.length || !guru.rows.length) {
      console.log('Missing data for test');
      return;
    }

    const payload = {
      siswaId: siswa.rows[0].id,
      mataPelajaranId: mapel.rows[0].id,
      semesterId: semester.rows[0].id,
      nilaiHarian: 85,
      nilaiUts: 90,
      nilaiUas: 95,
      catatan: 'Test real time'
    };

    console.log('Testing create nilai with userId:', guru.rows[0].user_id);
    const result = await NilaiService.create(payload, guru.rows[0].user_id);
    console.log('Success:', result);
  } catch (err) {
    console.error('Error Stack:', err.stack);
  } finally {
    process.exit(0);
  }
}

test();
