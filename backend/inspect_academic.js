require('dotenv').config();
const { pool } = require('./src/config/db');

async function inspectAcademic() {
  try {
    const ta = await pool.query('SELECT * FROM academic.tahun_ajaran');
    console.log('Tahun Ajaran:', ta.rows);

    const sem = await pool.query('SELECT * FROM academic.semester');
    console.log('Semester:', sem.rows);

    const kel = await pool.query('SELECT * FROM academic.kelas');
    console.log('Kelas count:', kel.rows.length);

    const sis = await pool.query('SELECT * FROM academic.siswa');
    console.log('Siswa count:', sis.rows.length);
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
inspectAcademic();
