require('dotenv').config();
const bcrypt = require('bcrypt');
const { pool } = require('./src/config/db');

(async () => {
  try {
    const hash = await bcrypt.hash('password123', 10);
    await pool.query('UPDATE shared.users SET password_hash = $1 WHERE email = $2', [hash, 'bapakbudi@siakad.id']);
    await pool.query('UPDATE shared.users SET password_hash = $1 WHERE email = $2', [hash, 'orangtua@siakad.id']);
    console.log('Password for bapakbudi@siakad.id and orangtua@siakad.id reset to password123');
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
})();
