require('dotenv').config();
const NilaiRepository = require('./src/repositories/nilai.repository');

async function run() {
  try {
    // Try updating an existing record to see if it fails
    // Using ID from previous check_cols result
    const testId = 'c0ada36e-35b7-4944-9b64-c0c225760e39';
    
    console.log("Attempting to update...");
    const res = await NilaiRepository.update(testId, {
      nilaiHarian: 85,
      nilaiUts: 90,
      nilaiUas: 95,
      catatan: "Test real time"
    });
    console.log("Update Success!", res);
    
  } catch(e) {
    console.error("Update Failed:", e);
  } finally {
    process.exit();
  }
}
run();
