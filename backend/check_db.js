require('dotenv').config();
const { query } = require('./src/config/db');

async function check() {
  const res = await query('SELECT * FROM shared.permissions LIMIT 1');
  console.log(res.rows[0]);
  process.exit(0);
}
check();
