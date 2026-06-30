require('dotenv').config();
const { query } = require('./src/config/db');

async function checkActive() {
  try {
    const res = await query('SELECT email, is_active FROM shared.users LIMIT 10');
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

checkActive();
