require('dotenv').config();
const KelulusanRepository = require('./src/repositories/kelulusan.repository');

async function testSave() {
  try {
    const res = await KelulusanRepository.save({
      siswaId: '00000003-0000-0000-0000-000000000001', // Valid siswa_id ? 
      status: 'Lulus',
      noIjazah: null,
      divalidasiKepsek: false,
      divalidasiOleh: null,
      tanggalKelulusan: null,
      tahunAjaranId: null // Let's see if this fails
    });
    console.log("Success:", res);
  } catch(e) {
    console.error("Error:", e.message);
  } finally {
    process.exit(0);
  }
}
testSave();
