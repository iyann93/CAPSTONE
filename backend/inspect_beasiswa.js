require('dotenv').config();
const { pool } = require('./src/config/db');
async function inspect() {
  try {
    const c = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='finance' AND table_name='beasiswa' ORDER BY ordinal_position`);
    console.log('beasiswa:', JSON.stringify(c.rows, null, 2));
    const r = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='academic' AND table_name='siswa' ORDER BY ordinal_position`);
    console.log('siswa full:', JSON.stringify(r.rows, null, 2));
  } catch(e){ console.error(e.message); } finally { pool.end(); }
}
inspect();
