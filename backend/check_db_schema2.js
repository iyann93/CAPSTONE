require('dotenv').config();
const { pool } = require('./src/config/db');

async function check() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'academic' AND table_name = 'orang_tua'
    `);
    console.log("Orang Tua Columns:");
    console.log(res.rows);

    const res2 = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'finance' AND table_name = 'bukti_pembayaran'
    `);
    console.log("\nBukti Pembayaran Columns:");
    console.log(res2.rows);

    const res3 = await pool.query(`
      SELECT tc.constraint_name,
        tc.table_name, kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name IN ('orang_tua', 'bukti_pembayaran');
    `);
    console.log("\nForeign Keys:");
    console.log(res3.rows);

  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
check();
