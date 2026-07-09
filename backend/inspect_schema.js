require('dotenv').config();
const db = require('./src/config/db');

async function run() {
  const res = await db.query("SELECT column_name FROM information_schema.columns WHERE table_schema='finance' AND table_name='slip_gaji'");
  console.log(res.rows);
  process.exit(0);
}
run();
