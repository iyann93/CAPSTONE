require('dotenv').config();
const { query } = require('./src/config/db');

async function check() {
  try {
    const res = await query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = 'academic' AND table_name = 'nilai'");
    console.log(res.rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
