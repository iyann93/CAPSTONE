require('dotenv').config();
const db = require('./src/config/db');
const AbsensiRepository = require('./src/repositories/absensi.repository');

async function test() {
  try {
    const siswaRes = await db.query('SELECT id, nis FROM academic.siswa LIMIT 1');
    if (siswaRes.rows.length === 0) return console.log("No siswa");
    const siswaId = siswaRes.rows[0].id;
    console.log("Siswa ID:", siswaId);

    const jadwalRes = await db.query('SELECT id FROM academic.jadwal_pelajaran LIMIT 1');
    if (jadwalRes.rows.length === 0) return console.log("No jadwal");
    const jadwalId = jadwalRes.rows[0].id;
    console.log("Jadwal ID:", jadwalId);

    const userRes = await db.query('SELECT id FROM shared.users LIMIT 1');
    const userId = userRes.rows[0].id;

    const payload = [{
      siswaId,
      jadwalId,
      tanggal: '2026-07-06',
      status: 'Hadir',
      keterangan: ''
    }];

    console.log("Attempting to insert...");
    const results = await AbsensiRepository.bulkUpsert(payload, userId);
    console.log("Success:", results);

  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    process.exit(0);
  }
}
test();
