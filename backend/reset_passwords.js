require('dotenv').config();
const bcrypt = require('bcrypt');
const { pool } = require('./src/config/db');

(async () => {
  try {
    const roles = await pool.query('SELECT * FROM shared.roles');
    const knownPassword = 'password123';
    const hash = await bcrypt.hash(knownPassword, 10);
    
    console.log('--- DAFTAR AKUN TESTING ---');
    console.log('Password untuk SEMUA akun di bawah ini adalah: ' + knownPassword + '\n');
    
    for (const r of roles.rows) {
      // Find one user for this role
      const userRes = await pool.query(`
        SELECT u.id, u.nama, u.email 
        FROM shared.users u
        JOIN shared.user_roles ur ON ur.user_id = u.id
        WHERE ur.role_id = $1 AND u.is_active = true
        LIMIT 1
      `, [r.id]);
      
      if (userRes.rows.length > 0) {
        const u = userRes.rows[0];
        // Reset password for this user
        await pool.query('UPDATE shared.users SET password_hash = $1 WHERE id = $2', [hash, u.id]);
        console.log(`Role: ${r.nama_role.padEnd(20)} | Email (Username): ${u.email.padEnd(25)} | Nama: ${u.nama}`);
      }
    }
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
})();
