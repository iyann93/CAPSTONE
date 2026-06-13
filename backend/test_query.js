require('dotenv').config();
const { pool } = require('./src/config/db');

async function test() {
  try {
    const res = await pool.query(`SELECT DISTINCT p.code FROM shared.permissions p`);
    console.log('Results:', res.rows);
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    pool.end();
  }
}
test();
