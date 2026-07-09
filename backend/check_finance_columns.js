require('dotenv').config();
const { pool } = require('./src/config/db');

async function check() {
  try {
    const tablesToCheck = [
      { schema: 'finance', name: 'pengeluaran' },
      { schema: 'finance', name: 'kategori_pengeluaran' },
      { schema: 'finance', name: 'beasiswa' }
    ];

    for (const t of tablesToCheck) {
      const res = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = $1 AND table_name = $2
        ORDER BY ordinal_position
      `, [t.schema, t.name]);
      console.log(`\nTable ${t.schema}.${t.name} columns:`);
      console.log(JSON.stringify(res.rows, null, 2));
    }
  } catch(e) {
    console.error(e.message);
  } finally {
    pool.end();
  }
}
check();
