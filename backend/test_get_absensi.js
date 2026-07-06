require('dotenv').config();
const AbsensiRepository = require('./src/repositories/absensi.repository');

async function test() {
  const result = await AbsensiRepository.findAll({ limit: 10, offset: 0 });
  console.log(result.rows);
  process.exit(0);
}
test();
