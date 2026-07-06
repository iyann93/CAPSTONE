require('dotenv').config();
const db = require('./src/config/db');

async function seed() {
  try {
    // Ambil semua kelas
    const kelasRes = await db.query('SELECT id FROM academic.kelas');
    if (kelasRes.rows.length === 0) return console.log("Tidak ada kelas di database.");

    // Ambil guru (opsional)
    const guruRes = await db.query('SELECT id FROM academic.guru LIMIT 1');
    const guruId = guruRes.rows.length > 0 ? guruRes.rows[0].id : null;

    // Ambil mapel (opsional)
    const mapelRes = await db.query('SELECT id FROM academic.mata_pelajaran LIMIT 1');
    const mapelId = mapelRes.rows.length > 0 ? mapelRes.rows[0].id : null;

    // Ambil semester aktif (opsional)
    const semesterRes = await db.query('SELECT id FROM academic.semester WHERE is_aktif = true LIMIT 1');
    const semesterId = semesterRes.rows.length > 0 ? semesterRes.rows[0].id : null;

    if (!guruId || !mapelId || !semesterId) {
      console.log("Data referensi (guru/mapel/semester) tidak lengkap.");
      // Tetap lanjutkan jika constraint database memperbolehkan null, tapi kita anggap ada.
    }

    let inserted = 0;
    let idx = 1;
    for (const k of kelasRes.rows) {
      // Cek apakah jadwal untuk kelas ini sudah ada
      const checkRes = await db.query('SELECT id FROM academic.jadwal_pelajaran WHERE kelas_id = $1 LIMIT 1', [k.id]);
      if (checkRes.rows.length === 0) {
        const hariArr = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const hari = hariArr[idx % 6];
        idx++;
        const jamStr = '07:00:00';
        const selStr = '08:30:00';
        await db.query(
          `INSERT INTO academic.jadwal_pelajaran 
          (kelas_id, mata_pelajaran_id, guru_id, semester_id, hari, jam_mulai, jam_selesai, ruangan) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [k.id, mapelId, guruId, semesterId, hari, jamStr, selStr, 'Ruang Default']
        );
        inserted++;
      }
    }
    
    console.log(`Berhasil menambahkan ${inserted} jadwal pelajaran.`);
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    process.exit(0);
  }
}
seed();
