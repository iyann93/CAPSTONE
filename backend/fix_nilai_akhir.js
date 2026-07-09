const { query } = require('./src/config/db');

async function fixNilaiAkhir() {
  const result = await query('SELECT * FROM academic.nilai WHERE nilai_akhir IS NULL');
  console.log(`Found ${result.rows.length} rows with null nilai_akhir`);
  
  for (const row of result.rows) {
    const nilaiHarian = row.nilai_harian || 0;
    const nilaiUts = row.nilai_uts || 0;
    const nilaiUas = row.nilai_uas || 0;
    
    let bobot_harian = row.bobot_harian || 30;
    let bobot_uts = row.bobot_uts || 30;
    let bobot_uas = row.bobot_uas || 40;
    
    const nilaiAkhir = (
      (nilaiHarian * bobot_harian / 100) +
      (nilaiUts * bobot_uts / 100) +
      (nilaiUas * bobot_uas / 100)
    );
    
    await query('UPDATE academic.nilai SET nilai_akhir = $1 WHERE id = $2', [nilaiAkhir, row.id]);
  }
  
  console.log('Fixed all nilai_akhir.');
  process.exit(0);
}

fixNilaiAkhir().catch(err => {
  console.error(err);
  process.exit(1);
});
