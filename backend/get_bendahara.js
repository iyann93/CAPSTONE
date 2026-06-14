const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD),
  port: parseInt(process.env.DB_PORT, 10),
});
pool.query("SELECT id, username, email FROM shared.users WHERE username ILIKE '%bendahara%' OR email ILIKE '%bendahara%'").then(r => {
  console.log(r.rows);
  pool.end();
}).catch(e => {
  console.error(e);
  pool.end();
});
