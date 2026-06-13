require('dotenv').config();
const { pool } = require('./src/config/db');

async function inspect() {
  try {
    const res = await pool.query(`SELECT * FROM shared.permissions LIMIT 1`);
    console.log('permission sample:', res.rows[0]);
    const resRoles = await pool.query(`SELECT * FROM shared.roles LIMIT 1`);
    console.log('role sample:', resRoles.rows[0]);
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
inspect();
