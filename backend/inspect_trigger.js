require('dotenv').config();
const db = require('./src/config/db');

async function run() {
  const res = await db.query(`
    SELECT event_object_table AS table_name, trigger_name
    FROM information_schema.triggers
    WHERE event_object_table = 'slip_gaji'
  `);
  console.log(res.rows);
  process.exit(0);
}
run();
