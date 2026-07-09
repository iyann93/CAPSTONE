require('dotenv').config();
const db = require('./src/config/db');

async function test() {
  try {
    const { whereBuilder } = require('./src/utils/queryBuilder');
    const wb = whereBuilder();
    const kelasId = '408c93f6-408f-4853-a8df-0855cd372182';
    wb.addRaw('AND (jp.kelas_id = $1 OR a.kelas_id = $2)', [kelasId, kelasId]);
    const { where, values } = wb.build();
    
    // Using values is fine but whereBuilder might return positional parameters differently
    // Actually, whereBuilder in node-postgres uses $1, $2, etc. 
    // In wb.addRaw('AND (jp.kelas_id = ? OR a.kelas_id = ?)', ...) if it replaces ?, it needs to be carefully handled.
    // Let's look at how whereBuilder handles addRaw.
    // I'll just hardcode it to avoid queryBuilder issues.
    
    const sql = `
      SELECT a.id, a.siswa_id, a.jadwal_id, a.tanggal, a.status, a.keterangan, a.dicatat_oleh, a.created_at,
             s.nama_lengkap AS siswa_nama, s.nis,
             jp.kelas_id, k.nama_kelas,
             jp.mata_pelajaran_id, m.nama AS nama_mapel,
             u.nama AS pencatat_nama
      FROM academic.absensi a
      LEFT JOIN academic.siswa s ON a.siswa_id = s.id
      LEFT JOIN academic.jadwal_pelajaran jp ON a.jadwal_id = jp.id
      LEFT JOIN academic.kelas k ON jp.kelas_id = k.id
      LEFT JOIN academic.mata_pelajaran m ON jp.mata_pelajaran_id = m.id
      LEFT JOIN shared.users u ON a.dicatat_oleh = u.id
      WHERE (jp.kelas_id = $1 OR a.kelas_id = $2)
    `;
    const res = await db.query(sql, [kelasId, kelasId]);
    console.log(res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
test();
