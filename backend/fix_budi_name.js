require('dotenv').config();
const { pool } = require('./src/config/db');

(async () => {
  try {
    const res = await pool.query(
      "SELECT id, nama FROM shared.users WHERE email = 'bapakbudi@siakad.id'"
    );
    console.log('Before:', res.rows);

    await pool.query(
      "UPDATE shared.users SET nama = TRIM(REGEXP_REPLACE(nama, '^Bapak\\s+', '', 'i')) WHERE email = 'bapakbudi@siakad.id'"
    );

    const res2 = await pool.query(
      "SELECT id, nama FROM shared.users WHERE email = 'bapakbudi@siakad.id'"
    );
    console.log('After:', res2.rows);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
})();
