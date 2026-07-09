// Test generate LANGSUNG tanpa HTTP, langsung panggil service
require('dotenv').config();

const PayrollService = require('./src/services/payroll.service');

async function test() {
  try {
    console.log('Testing generate slip...');
    const result = await PayrollService.generate({
      userId: '7ff844aa-7e78-4cff-9387-47e17c31b02f', // Drs. Bambang Sudirman
      bulan: 6,
      tahun: 2026,
      hariHadir: 22,
      jumlahAlpha: 0,
      jamLembur: 0
    });
    console.log('SUCCESS:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('ERROR message:', err.message);
    console.error('ERROR stack:', err.stack);
    if (err.detail) console.error('DB detail:', err.detail);
    if (err.code) console.error('DB code:', err.code);
  }
  process.exit(0);
}

test();
