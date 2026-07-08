require('dotenv').config();
const db = require('./src/config/db');

async function test() {
  try {
    const SemesterService = require('./src/services/semester.service');
    
    console.log('Testing SemesterService.create...');
    const payloadData = {
      nama: "Ganjil 2025/2026",
      tahunAjaranId: "00000001-0000-0000-0000-000000000001",
      tanggalMulai: "2025-07-15",
      tanggalSelesai: "2025-12-20"
    };
    
    const res = await SemesterService.create(payloadData);
    console.log('Result:', res);
  } catch(e) {
    console.error('Stack Trace:', e.stack);
  } finally {
    process.exit();
  }
}
test();
