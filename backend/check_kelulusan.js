require('dotenv').config();
const { query } = require('./src/config/db');

async function check() {
  try {
    const res = await query(`
      SELECT pg_get_constraintdef(oid) 
      FROM pg_constraint 
      WHERE conname = 'kelulusan_status_check'
    `);
    console.log("Check:", res.rows[0].pg_get_constraintdef);
  } catch(e) {
    console.error(e.message);
  } finally {
    process.exit(0);
  }
}
check();
