const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const taId = '00000001-0000-0000-0000-000000000001';
    const mipaId = 'e21a3ed9-3e46-4d9e-95e8-19ffac1dfaf5';
    const ipsId = '9c659b33-26eb-4d1d-8085-cd2880ea80bd';

    const classes = [];
    const tingkatList = ['VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    
    for (let t of tingkatList) {
      // For each grade, 1 to 4
      for (let i = 1; i <= 4; i++) {
        let tNum = t === 'VII' ? '7' : t === 'VIII' ? '8' : t === 'IX' ? '9' : t === 'X' ? '10' : t === 'XI' ? '11' : '12';
        classes.push({
          kode_kelas: `${t}-MIPA-${i}`,
          nama_kelas: `${t} MIPA ${i}`,
          tingkat: tNum,
          tahun_ajaran_id: taId,
          jurusan_id: mipaId,
          kapasitas: 36
        });
        classes.push({
          kode_kelas: `${t}-IPS-${i}`,
          nama_kelas: `${t} IPS ${i}`,
          tingkat: tNum,
          tahun_ajaran_id: taId,
          jurusan_id: ipsId,
          kapasitas: 36
        });
      }
    }

    // Insert classes
    for (let c of classes) {
      const exists = await pool.query(`SELECT id FROM academic.kelas WHERE nama_kelas = $1`, [c.nama_kelas]);
      if (exists.rowCount === 0) {
        await pool.query(`
          INSERT INTO academic.kelas (kode_kelas, nama_kelas, tingkat, tahun_ajaran_id, jurusan_id, kapasitas)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [c.kode_kelas, c.nama_kelas, c.tingkat, c.tahun_ajaran_id, c.jurusan_id, c.kapasitas]);
      }
    }
    console.log("Successfully inserted all dummy classes!");
  } catch(err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

run();
