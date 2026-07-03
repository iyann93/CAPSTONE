const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER, password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST, port: process.env.DB_PORT,
  database: process.env.DB_DATABASE, ssl: { rejectUnauthorized: false }
});

const mapelUnik = [
  { nama: 'Pendidikan Agama dan Budi Pekerti',        kelompok: 'Wajib', kkm: 75, jumlah_jam: 3, tingkat: 'VII,VIII,IX,X,XI,XII' },
  { nama: 'Pendidikan Pancasila dan Kewarganegaraan', kelompok: 'Wajib', kkm: 75, jumlah_jam: 2, tingkat: 'VII,VIII,IX,X,XI,XII' },
  { nama: 'Bahasa Indonesia',                         kelompok: 'Wajib', kkm: 75, jumlah_jam: 4, tingkat: 'VII,VIII,IX,X,XI,XII' },
  { nama: 'Bahasa Inggris',                           kelompok: 'Wajib', kkm: 75, jumlah_jam: 3, tingkat: 'VII,VIII,IX,X,XI,XII' },
  { nama: 'Matematika',                               kelompok: 'Wajib', kkm: 75, jumlah_jam: 5, tingkat: 'VII,VIII,IX' },
  { nama: 'Matematika Wajib',                         kelompok: 'Wajib', kkm: 75, jumlah_jam: 4, tingkat: 'X,XI,XII' },
  { nama: 'Matematika Peminatan',                     kelompok: 'IPA',   kkm: 75, jumlah_jam: 4, tingkat: 'X,XI,XII' },
  { nama: 'IPA',                                      kelompok: 'IPA',   kkm: 75, jumlah_jam: 5, tingkat: 'VII,VIII,IX' },
  { nama: 'IPS',                                      kelompok: 'IPS',   kkm: 75, jumlah_jam: 4, tingkat: 'VII,VIII,IX' },
  { nama: 'Biologi',                                  kelompok: 'IPA',   kkm: 75, jumlah_jam: 4, tingkat: 'X,XI,XII' },
  { nama: 'Fisika',                                   kelompok: 'IPA',   kkm: 75, helper_jam: 4, tingkat: 'X,XI,XII' },
  { nama: 'Kimia',                                    kelompok: 'IPA',   kkm: 75, jumlah_jam: 4, tingkat: 'X,XI,XII' },
  { nama: 'Seni Budaya',                              kelompok: 'Wajib', kkm: 75, jumlah_jam: 2, tingkat: 'VII,VIII,IX,X,XI,XII' },
  { nama: 'Pendidikan Jasmani, Olahraga dan Kesehatan', kelompok: 'Wajib', kkm: 75, jumlah_jam: 3, tingkat: 'VII,VIII,IX,X,XI,XII' },
  { nama: 'Prakarya',                                 kelompok: 'Wajib', kkm: 75, jumlah_jam: 2, tingkat: 'VII,VIII,IX' },
  { nama: 'Prakarya dan Kewirausahaan',               kelompok: 'Wajib', kkm: 75, jumlah_jam: 2, tingkat: 'X,XI,XII' },
  { nama: 'Ekonomi',                                  kelompok: 'IPS',   kkm: 75, jumlah_jam: 4, tingkat: 'X,XI,XII' },
  { nama: 'Sejarah Indonesia',                        kelompok: 'IPS',   kkm: 75, jumlah_jam: 3, tingkat: 'X,XI,XII' },
  { nama: 'Sosiologi',                                kelompok: 'IPS',   kkm: 75, jumlah_jam: 3, tingkat: 'XI,XII' },
  { nama: 'Tahsin Tahfizh',                           kelompok: 'Muatan Lokal', kkm: 70, jumlah_jam: 2, tingkat: 'VII,VIII,IX,X,XI,XII' },
];

async function seed() {
  try {
    // Hapus semua data lama agar tidak ada yang dobel
    await pool.query('DELETE FROM academic.mata_pelajaran');
    console.log('✅ Data lama dihapus.');

    let inserted = 0;
    // Mulai kode berurutan dari 101
    let kodeStart = 101; 

    for (const m of mapelUnik) {
      const kodeUrut = kodeStart.toString();
      const jam = m.jumlah_jam || m.helper_jam || 2;
      
      await pool.query(
        `INSERT INTO academic.mata_pelajaran (kode, nama, kelompok, kkm, jumlah_jam, tingkat)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [kodeUrut, m.nama, m.kelompok, m.kkm, jam, m.tingkat]
      );
      console.log(`  ✅ [Kode: ${kodeUrut}] ${m.nama} (${m.tingkat})`);
      inserted++;
      kodeStart++;
    }

    console.log(`\n🎉 Selesai! Total ${inserted} mata pelajaran unik berhasil ditambahkan dengan kode berurutan.`);
  } catch(err) {
    console.error('❌ Error:', err.message);
  } finally {
    pool.end();
  }
}

seed();
