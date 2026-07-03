require('dotenv').config();
const KelasRepository = require('./src/repositories/kelas.repository');

async function testRepoCreate() {
  try {
    const data = await KelasRepository.create({
      namaKelas: 'X IPA 1 Test',
      tingkat: '10',
      tahunAjaran: '2025/2026',
      jurusanId: 'e21a3ed9-3e46-4d9e-95e8-19ffac1dfaf5'
    });
    console.log('Success:', data);
  } catch (e) {
    console.error('Database Error:', e.message);
  }
}
testRepoCreate();
