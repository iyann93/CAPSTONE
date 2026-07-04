require('dotenv').config();
const { query } = require('./src/config/db');

(async () => {
  try {
    const sql = `
      INSERT INTO academic.guru
        (nip, nama_lengkap, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email_pribadi, jabatan_tugas, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING id
    `;
    const result = await query(sql, ['123', 'Sri', 'P', '1992-09-20', 'jogja bantul', '23456543', 'burhanudinsubekti29@gmail.com', 'test']);
    console.log(result.rows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
})();
