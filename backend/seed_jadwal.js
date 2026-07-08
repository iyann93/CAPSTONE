require('dotenv').config();
const { query } = require('./src/config/db');

async function seed() {
  try {
    const mapel = await query('SELECT id FROM academic.mata_pelajaran');
    const guru = await query('SELECT id FROM academic.guru');
    
    // 1. Sync mata pelajaran with guru
    const gurus = guru.rows;
    for (let i = 0; i < mapel.rows.length; i++) {
      const gId = gurus[i % gurus.length].id;
      await query('UPDATE academic.mata_pelajaran SET guru_pengampu_id = $1 WHERE id = $2', [gId, mapel.rows[i].id]);
    }
    console.log('Synced mapel with guru');

    // Delete existing schedules and absensi to prevent duplicate/mess
    await query('DELETE FROM academic.absensi');
    await query('DELETE FROM academic.jadwal_pelajaran');

    // 2. Generate schedules
    const mapelUpdated = await query('SELECT id, guru_pengampu_id FROM academic.mata_pelajaran');
    const kelas = await query('SELECT id, nama_kelas FROM academic.kelas');
    const semester = await query('SELECT id FROM academic.semester WHERE is_aktif = true');
    const semesterId = semester.rows[0]?.id;

    if (!semesterId) {
      console.log('No active semester');
      return;
    }

    const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
    const jamMulaiList = ['07:00', '08:30', '10:15', '11:45', '13:05'];
    const jamSelesaiList = ['08:30', '10:00', '11:45', '13:05', '14:35'];

    for (let i = 0; i < kelas.rows.length; i++) {
      const kId = kelas.rows[i].id;
      // create 3 schedules for each class
      for (let j = 0; j < 3; j++) {
        const m = mapelUpdated.rows[(i + j) % mapelUpdated.rows.length];
        const hari = hariList[j % hariList.length];
        const jM = jamMulaiList[j];
        const jS = jamSelesaiList[j];

        await query(
          'INSERT INTO academic.jadwal_pelajaran (kelas_id, mata_pelajaran_id, guru_id, semester_id, hari, jam_mulai, jam_selesai) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [kId, m.id, m.guru_pengampu_id, semesterId, hari, jM, jS]
        );
      }
    }
    console.log('Schedules populated');
  } catch(e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

seed();
