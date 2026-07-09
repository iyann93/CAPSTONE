require('dotenv').config();
const db = require('./src/config/db');

async function testBulkDelete() {
  const client = await db.getClient();
  try {
    const res = await client.query(`SELECT id FROM finance.slip_gaji LIMIT 2`);
    const ids = res.rows.map(r => r.id);
    console.log("IDs to delete:", ids);
    
    // Simulate what PayrollService.bulkDeleteSlips does
    if (ids.length > 0) {
      // PayrollService.bulkDeleteSlips logic
      const slipService = require('./src/services/payroll.service');
      const count = await slipService.bulkDeleteSlips(ids);
      console.log("Deleted count:", count);
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    client.release();
    process.exit(0);
  }
}

testBulkDelete();
