require('dotenv').config();
const db = require('./src/config/db');

async function test() {
  try {
    const AbsensiService = require('./src/services/absensi.service');
    const kelasId = '408c93f6-408f-4853-a8df-0855cd372182';
    const selectedDate = new Date().toISOString().split('T')[0];
    
    console.log('Fetching absensi via Service...');
    const res = await AbsensiService.getAll({
      tanggal: selectedDate,
      kelas_id: kelasId,
      limit: '1000'
    });
    console.log('Result:', res);
  } catch(e) {
    console.error('Stack Trace:', e.stack);
  } finally {
    process.exit();
  }
}
test();
