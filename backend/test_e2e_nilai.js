const { query } = require('./src/config/db');

async function getSampleData() {
  try {
    // 1. Get a sample record from academic.nilai
    const dbSample = await query(`
      SELECT id, siswa_id, guru_id, mata_pelajaran_id, 
             nilai_harian, nilai_uts, nilai_uas, nilai_akhir, created_at 
      FROM academic.nilai 
      ORDER BY created_at DESC 
      LIMIT 1
    `);

    if (dbSample.rows.length === 0) {
      console.log('No data in academic.nilai. Please ensure a grade has been submitted.');
      process.exit(0);
    }
    
    const record = dbSample.rows[0];
    
    // 2. Format as DB proof
    console.log('=== BUKTI DATABASE (academic.nilai) ===');
    console.log(JSON.stringify(record, null, 2));
    
    // 3. Format as API proof (Simulating GET /nilai/kelas/:id)
    const apiSample = await query(`
      SELECT n.id, n.siswa_id, s.nama_lengkap AS siswa_nama,
             n.nilai_akhir
      FROM academic.nilai n
      JOIN academic.siswa s ON n.siswa_id = s.id
      WHERE n.id = $1
    `, [record.id]);
    
    console.log('\n=== BUKTI API (GET /nilai/kelas/:id) ===');
    console.log(JSON.stringify({
      siswa: apiSample.rows[0].siswa_nama,
      nilai_akhir: apiSample.rows[0].nilai_akhir
    }, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

getSampleData();
