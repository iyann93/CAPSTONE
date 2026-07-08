require('dotenv').config();
const db = require('./src/config/db');

async function test() {
  try {
    const TahunAjaranService = require('./src/services/tahunAjaran.service');
    console.log('Testing TahunAjaranService.getAll...');
    const res = await TahunAjaranService.getAll({ limit: 100 });
    console.log('Result:', res);
  } catch(e) {
    console.error('Stack Trace:', e.stack);
  } finally {
    process.exit();
  }
}
test();
