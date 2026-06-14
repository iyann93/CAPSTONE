require('dotenv').config();
const SiswaRepository = require('./src/repositories/siswa.repository');

async function test() {
  try {
    const res = await SiswaRepository.findAll({ limit: 10, offset: 0 });
    console.log('Repo data:', res.rows.length);
  } catch(e) {
    console.error('Repo error:', e);
  }
}
test();
