require('dotenv').config();
const db = require('./src/config/db');

async function run() {
  const res = await db.query("SELECT pg_get_constraintdef(oid) AS def FROM pg_constraint WHERE conname = 'transfer_gaji_status_check'");
  console.log(res.rows);
  process.exit(0);
}
run();
