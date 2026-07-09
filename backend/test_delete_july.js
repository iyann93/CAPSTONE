require('dotenv').config();
const {pool} = require('./src/config/db');
pool.query("DELETE FROM finance.tagihan_spp WHERE bulan = 7 AND tahun = 2026 AND status = 'belum_bayar' RETURNING id")
  .then(res => {
    console.log('Deleted rows:', res.rows.length);
    process.exit(0);
  })
  .catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
  });
