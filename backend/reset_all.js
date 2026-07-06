require('dotenv').config();
const bcrypt = require('bcrypt');
const { pool } = require('./src/config/db');

(async () => {
  try {
    const knownPassword = 'password123';
    const hash = await bcrypt.hash(knownPassword, 10);
    
    // Update all users
    await pool.query('UPDATE shared.users SET password_hash = $1', [hash]);
    console.log('All passwords reset to password123!');

    // Show all users
    const res = await pool.query('SELECT u.email, u.nama, r.nama_role FROM shared.users u JOIN shared.user_roles ur ON ur.user_id = u.id JOIN shared.roles r ON ur.role_id = r.id');
    console.log('\n--- DAFTAR SEMUA AKUN ---');
    res.rows.forEach(row => {
      console.log(`Role: ${row.nama_role.padEnd(20)} | Email: ${row.email.padEnd(25)} | Nama: ${row.nama}`);
    });
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
})();
