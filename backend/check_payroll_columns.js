require('dotenv').config();
const { pool } = require('./src/config/db');

async function check() {
  try {
    const tablesToCheck = [
      { schema: 'finance', name: 'slip_gaji' },
      { schema: 'finance', name: 'komponen_gaji' },
      { schema: 'finance', name: 'transfer_gaji' },
      { schema: 'academic', name: 'guru' },
      { schema: 'academic', name: 'karyawan' }
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
