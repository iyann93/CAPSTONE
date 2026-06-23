require('dotenv').config();
const { query } = require('./src/config/db');

async function run() {
  try {
    const res = await query("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='academic' AND table_name='siswa'");
    console.log(res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
run();
