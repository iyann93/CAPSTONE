require('dotenv').config();
const db = require('./src/config/db');

async function fixSpp() {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const classes = await client.query('SELECT id, kode_kelas FROM academic.kelas');
    
    for (const cls of classes.rows) {
      await client.query(
        `UPDATE finance.komponen_spp SET kelas_id = $1 WHERE nama LIKE '%' || $2`,
        [cls.id, cls.kode_kelas]
      );
    }
    
    const students = await client.query(`
      SELECT s.id as siswa_id, s.kelas_id, k.kode_kelas 
      FROM academic.siswa s
      JOIN academic.kelas k ON s.kelas_id = k.id
    `);
    
    for (const student of students.rows) {
      const komp = await client.query(
        `SELECT id, nominal FROM finance.komponen_spp WHERE kelas_id = $1`,
        [student.kelas_id]
      );
      
      if (komp.rows.length > 0) {
        await client.query(
          `UPDATE finance.tagihan_spp 
           SET komponen_spp_id = $1, nominal = $2
           WHERE siswa_id = $3 AND status != 'lunas'`,
          [komp.rows[0].id, komp.rows[0].nominal, student.siswa_id]
        );
      }
    }

    await client.query('COMMIT');
    console.log('Fixed SPP nominals and tagihan!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
  } finally {
    client.release();
    process.exit(0);
  }
}

fixSpp();
