const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER, password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST, port: process.env.DB_PORT,
  database: process.env.DB_DATABASE, ssl: { rejectUnauthorized: false }
});

// Data PERSIS sesuai gambar
const mapelSMP = [
  { kode: 'PAGBP-SMP', nama: 'Pendidikan Agama dan Budi Pekerti',        kelompok: 'Wajib', kkm: 75, jumlah_jam: 3, tingkat: 'VII,VIII,IX' },
  { kode: 'PPKN-SMP',  nama: 'Pendidikan Pancasila dan Kewarganegaraan', kelompok: 'Wajib', kkm: 75, jumlah_jam: 3, tingkat: 'VII,VIII,IX' },
  { kode: 'BIND-SMP',  nama: 'Bahasa Indonesia',                          kelompok: 'Wajib', kkm: 75, jumlah_jam: 6, tingkat: 'VII,VIII,IX' },
  { kode: 'BING-SMP',  nama: 'Bahasa Inggris',                            kelompok: 'Wajib', kkm: 75, jumlah_jam: 4, tingkat: 'VII,VIII,IX' },
  { kode: 'MTK-SMP',   nama: 'Matematika',                                kelompok: 'Wajib', kkm: 75, jumlah_jam: 5, tingkat: 'VII,VIII,IX' },
  { kode: 'IPA-SMP',   nama: 'IPA',                                       kelompok: 'IPA',   kkm: 75, jumlah_jam: 5, tingkat: 'VII,VIII,IX' },
  { kode: 'IPS-SMP',   nama: 'IPS',                                       kelompok: 'IPS',   kkm: 75, jumlah_jam: 4, tingkat: 'VII,VIII,IX' },
  { kode: 'SBUD-SMP',  nama: 'Seni Budaya',                               kelompok: 'Wajib', kkm: 75, jumlah_jam: 3, tingkat: 'VII,VIII,IX' },
  { kode: 'PJOK-SMP',  nama: 'Pendidikan Jasmani, Olahraga dan Kesehatan', kelompok: 'Wajib', kkm: 75, jumlah_jam: 3, tingkat: 'VII,VIII,IX' },
  { kode: 'PKY-SMP',   nama: 'Prakarya',                                  kelompok: 'Wajib', kkm: 75, jumlah_jam: 2, tingkat: 'VII,VIII,IX' },
  { kode: 'TAHSIN-SMP',nama: 'Tahsin Tahfizh',                            kelompok: 'Muatan Lokal', kkm: 70, jumlah_jam: 2, tingkat: 'VII,VIII,IX' },
];

const mapelSMA = [
  { kode: 'PAGBP-SMA', nama: 'Pendidikan Agama dan Budi Pekerti',        kelompok: 'Wajib', kkm: 75, jumlah_jam: 3, tingkat: 'X,XI,XII' },
  { kode: 'PPKN-SMA',  nama: 'Pendidikan Pancasila dan Kewarganegaraan', kelompok: 'Wajib', kkm: 75, jumlah_jam: 2, tingkat: 'X,XI,XII' },
  { kode: 'BIND-SMA',  nama: 'Bahasa Indonesia',                          kelompok: 'Wajib', kkm: 75, jumlah_jam: 4, tingkat: 'X,XI,XII' },
  { kode: 'BING-SMA',  nama: 'Bahasa Inggris',                            kelompok: 'Wajib', kkm: 75, jumlah_jam: 3, tingkat: 'X,XI,XII' },
  { kode: 'MTK-W',     nama: 'Matematika Wajib',                          kelompok: 'Wajib', kkm: 75, jumlah_jam: 4, tingkat: 'X,XI,XII' },
  { kode: 'MTK-P',     nama: 'Matematika Peminatan',                      kelompok: 'IPA',   kkm: 75, jumlah_jam: 4, tingkat: 'X,XI,XII' },
  { kode: 'BIO-SMA',   nama: 'Biologi',                                   kelompok: 'IPA',   kkm: 75, jumlah_jam: 4, tingkat: 'X,XI,XII' },
  { kode: 'FIS-SMA',   nama: 'Fisika',                                    kelompok: 'IPA',   kkm: 75, jumlah_jam: 4, tingkat: 'X,XI,XII' },
  { kode: 'KIM-SMA',   nama: 'Kimia',                                     kelompok: 'IPA',   kkm: 75, jumlah_jam: 4, tingkat: 'X,XI,XII' },
  { kode: 'SBUD-SMA',  nama: 'Seni Budaya',                               kelompok: 'Wajib', kkm: 75, jumlah_jam: 2, tingkat: 'X,XI,XII' },
  { kode: 'PJOK-SMA',  nama: 'Pendidikan Jasmani, Olahraga dan Kesehatan', kelompok: 'Wajib', kkm: 75, jumlah_jam: 3, tingkat: 'X,XI,XII' },
  { kode: 'PKW-SMA',   nama: 'Prakarya dan Kewirausahaan',                kelompok: 'Wajib', kkm: 75, jumlah_jam: 2, tingkat: 'X,XI,XII' },
  { kode: 'EKO-SMA',   nama: 'Ekonomi',                                   kelompok: 'IPS',   kkm: 75, jumlah_jam: 4, tingkat: 'X,XI,XII' },
  { kode: 'SEJ-SMA',   nama: 'Sejarah Indonesia',                         kelompok: 'IPS',   kkm: 75, jumlah_jam: 3, tingkat: 'X,XI,XII' },
  { kode: 'SOS-SMA',   nama: 'Sosiologi',                                 kelompok: 'IPS',   kkm: 75, jumlah_jam: 3, tingkat: 'XI,XII' },
  { kode: 'TAHSIN-SMA',nama: 'Tahsin Tahfizh',                            kelompok: 'Muatan Lokal', kkm: 70, jumlah_jam: 2, tingkat: 'X,XI,XII' },
];

const semuaMapel = [...mapelSMP, ...mapelSMA];

async function seed() {
  try {
    // Hapus semua data lama
    await pool.query('DELETE FROM academic.mata_pelajaran');
    console.log('✅ Data lama dihapus.\n');

    let inserted = 0;
    for (const m of semuaMapel) {
      await pool.query(
        `INSERT INTO academic.mata_pelajaran (kode, nama, kelompok, kkm, jumlah_jam, tingkat)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [m.kode, m.nama, m.kelompok, m.kkm, m.jumlah_jam, m.tingkat]
      );
      console.log(`  ✅ [${m.tingkat.split(',')[0]}] ${m.nama}`);
      inserted++;
    }

    console.log(`\n🎉 Selesai! Total ${inserted} mata pelajaran berhasil ditambahkan ke Supabase.`);
  } catch(err) {
    console.error('❌ Error:', err.message);
  } finally {
    pool.end();
  }
}

seed();
