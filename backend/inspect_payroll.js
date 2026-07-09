require('dotenv').config();
const { pool } = require('./src/config/db');

async function inspect() {
  try {
    const resKG = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'finance' AND table_name = 'komponen_gaji'`);
    console.log("== TABEL KOMPONEN GAJI ==");
    console.log(JSON.stringify(resKG.rows, null, 2));

    const resKGD = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'finance' AND table_name = 'komponen_gaji_detail'`);
    console.log("== TABEL KOMPONEN GAJI DETAIL ==");
    console.log(JSON.stringify(resKGD.rows, null, 2));

    const resSG = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'finance' AND table_name = 'slip_gaji'`);
    console.log("\n== TABEL SLIP GAJI ==");
    console.log(JSON.stringify(resSG.rows, null, 2));

    const resDSG = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'finance' AND table_name = 'detail_slip_gaji'`);
    console.log("\n== TABEL DETAIL SLIP GAJI ==");
    console.log(JSON.stringify(resDSG.rows, null, 2));
    
    const resTG = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'finance' AND table_name = 'transfer_gaji'`);
    console.log("\n== TABEL TRANSFER GAJI ==");
    console.log(JSON.stringify(resTG.rows, null, 2));
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
inspect();
