require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres.ddquzxpbczeagfezjkzq:2300016025fernanda@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});
async function run() {
  try {
    const res = await pool.query("SELECT email, is_active FROM shared.users WHERE email = 'budi.admin@siakad.id'");
    console.log("User:", res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
