require('dotenv').config();
const { pool } = require('./src/config/db');

async function test() {
  const r = await pool.query('SELECT * FROM shared.frontend_state');
  console.log(r.rows);
  pool.end();
}
test();
