require('dotenv').config();
const FinanceService = require('./src/services/finance.service');
const { pool } = require('./src/config/db');

async function test() {
  try {
    const res = await pool.query(`SELECT id FROM finance.tagihan_spp WHERE status = 'menunggu_konfirmasi' LIMIT 1`);
    if (res.rows.length === 0) {
      console.log('No tagihan found with status menunggu_konfirmasi');
      return;
    }
    const tagihanId = res.rows[0].id;
    console.log(`Testing with tagihan_id: ${tagihanId}`);
    
    // find a user for dicatat_oleh
    const userRes = await pool.query(`SELECT id FROM shared.users LIMIT 1`);
    const userId = userRes.rows[0]?.id;
    
    const result = await FinanceService.konfirmasiBuktiSpp(tagihanId, 'terima', userId);
    console.log('Success:', result);
  } catch (err) {
    console.error('Error in konfirmasi:', err.message || err);
  } finally {
    pool.end();
  }
}

test();
