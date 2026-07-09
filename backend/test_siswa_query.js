const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD),
  port: parseInt(process.env.DB_PORT, 10),
});
const sql = `
  SELECT s.id, s.nis, s.nama, s.jenis_kelamin, s.tanggal_lahir,
         s.alamat, s.no_telepon, s.email, s.is_active,
         k.nama_kelas, j.nama_jurusan, s.kelas_id, s.created_at
  FROM academic.siswa s
  LEFT JOIN academic.kelas k ON s.kelas_id = k.id
  LEFT JOIN academic.jurusan j ON k.jurusan_id = j.id
  ORDER BY s.nama ASC
  LIMIT $1 OFFSET $2
`;
pool.query(sql, [20, 0]).then(r => {
  console.log('Query success');
  pool.end();
}).catch(e => {
  console.error('Query error:', e);
  pool.end();
});
