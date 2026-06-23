require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD),
  port: parseInt(process.env.DB_PORT, 10),
  ssl: false,
  connectionTimeoutMillis: 10000
});

async function test() {
  const r = await pool.query("SELECT email, full_name FROM shared.users ORDER BY created_at LIMIT 20");
  console.log('All users:');
  r.rows.forEach(u => console.log(' -', u.email, '|', u.full_name));
  process.exit(0);
}
test().catch(e => { console.log('ERR:', e.message); process.exit(1); });
