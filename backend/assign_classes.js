const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  const classesRes = await pool.query("SELECT id, kode_kelas FROM academic.kelas");
  const classes = classesRes.rows;
  console.log("Classes found:", classes);

  const vii = classes.find(c => c.kode_kelas === 'VII')?.id;
  const viii = classes.find(c => c.kode_kelas === 'VIII')?.id;
  const ix = classes.find(c => c.kode_kelas === 'IX')?.id;

  if (!vii || !viii || !ix) {
    console.error("Missing classes in database.");
    process.exit(1);
  }

  const studentsRes = await pool.query("SELECT id, nama_lengkap FROM academic.siswa");
  const students = studentsRes.rows;
  console.log("Students count:", students.length);

  for (let i = 0; i < students.length; i++) {
    let kelasId;
    if (i < 5) kelasId = vii;
    else if (i < 10) kelasId = viii;
    else kelasId = ix;

    await pool.query("UPDATE academic.siswa SET kelas_id = $1 WHERE id = $2", [kelasId, students[i].id]);
    console.log(`Assigned ${students[i].nama_lengkap} to class ID ${kelasId}`);
  }

  console.log("Successfully assigned classes to all students!");
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
