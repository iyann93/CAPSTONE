require('dotenv').config();
const PayrollRepository = require('./src/repositories/payroll.repository.js');
const db = require('./src/config/db');

async function run() {
  try {
    const slip = await db.query("SELECT id, status FROM finance.slip_gaji WHERE status = 'draft' LIMIT 1");
    if (slip.rows.length === 0) {
      console.log('No draft slip found.');
      process.exit(0);
    }
    const id = slip.rows[0].id;
    console.log('Approving slip...', id);
    await PayrollRepository.approveSlip(id);
    
    console.log('Transferring slip...');
    await PayrollRepository.transferGaji({
      slipGajiId: id,
      noReferensi: 'TRX-' + Date.now(),
      rekeningId: null
    });
    console.log('Success!');
  } catch (e) {
    console.error('Error occurred:', e.message, e.stack);
  } finally {
    process.exit(0);
  }
}
run();
