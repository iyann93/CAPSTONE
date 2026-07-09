require('dotenv').config();
const { query } = require('./src/config/db');

async function run() {
  const classes = [
    { id: '11111111-1111-1111-1111-111111111111', nama: 'X IPA 1', tingkat: 'X' },
    { id: '11111111-1111-1111-1111-111111111112', nama: 'X IPA 2', tingkat: 'X' },
    { id: '11111111-1111-1111-1111-111111111113', nama: 'X IPS 1', tingkat: 'X' },
    { id: '11111111-1111-1111-1111-111111111114', nama: 'X IPS 2', tingkat: 'X' },
    { id: '11111111-1111-1111-1111-111111111115', nama: 'XI IPA 1', tingkat: 'XI' },
    { id: '11111111-1111-1111-1111-111111111116', nama: 'XI IPS 1', tingkat: 'XI' },
    { id: '11111111-1111-1111-1111-111111111117', nama: 'XII IPA 1', tingkat: 'XII' },
    { id: '11111111-1111-1111-1111-111111111118', nama: 'XII IPS 1', tingkat: 'XII' },
  ];
  
  const tahunAjaranId = '00000001-0000-0000-0000-000000000001';
  
  try {
    for (let c of classes) {
      const sql = `INSERT INTO academic.kelas (id, kode_kelas, nama_kelas, tingkat, tahun_ajaran_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`;
      await query(sql, [c.id, c.nama.replace(/ /g, '-'), c.nama, c.tingkat, tahunAjaranId]);
    }
    console.log("Inserted SMA classes");
  } catch(e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
run();
