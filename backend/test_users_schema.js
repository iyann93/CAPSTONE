require('dotenv').config();
const { query } = require('./src/config/db');

async function checkSchema() {
  try {
    const res = await query('SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = \'shared\' AND table_name = \'users\'');
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

checkSchema();
