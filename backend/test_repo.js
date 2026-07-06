require('dotenv').config();
const NilaiRepository = require('./src/repositories/nilai.repository');
const AbsensiRepository = require('./src/repositories/absensi.repository');

async function check() {
  try {
    const nilai = await NilaiRepository.findAll({ limit: 10, offset: 0 });
    console.log("Nilai findAll length:", nilai.rows.length);
    const absensi = await AbsensiRepository.findAll({ limit: 10, offset: 0 });
    console.log("Absensi findAll length:", absensi.rows.length);
  } catch (err) {
    console.error("CRASH:", err);
  }
  process.exit(0);
}
check();
