require('dotenv').config();
const { query } = require('./src/config/db');

async function run() {
  try {
    const res = await query("SELECT constraint_name, column_name FROM information_schema.key_column_usage WHERE table_schema='academic' AND table_name='siswa'");
    console.log(res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
run();
