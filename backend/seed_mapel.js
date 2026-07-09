const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  ssl: { rejectUnauthorized: false }
});

// Data mata pelajaran lengkap SMP-SMA
const mapelData = [
  // ── WAJIB UMUM (SMP & SMA) ─────────────────────────────
  { kode: 'MTK',   nama: 'Matematika',              kelompok: 'Wajib', kkm: 75, jumlah_jam: 5, tingkat: 'VII,VIII,IX,X,XI,XII' },
  { kode: 'BIN',   nama: 'Bahasa Indonesia',        kelompok: 'Wajib', kkm: 75, jumlah_jam: 5, tingkat: 'VII,VIII,IX,X,XI,XII' },
  { kode: 'BIG',   nama: 'Bahasa Inggris',          kelompok: 'Wajib', kkm: 75, jumlah_jam: 4, tingkat: 'VII,VIII,IX,X,XI,XII' },
  { kode: 'PKN',   nama: 'Pendidikan Kewarganegaraan', kelompok: 'Wajib', kkm: 75, jumlah_jam: 2, tingkat: 'VII,VIII,IX,X,XI,XII' },
  { kode: 'PAI',   nama: 'Pendidikan Agama Islam',  kelompok: 'Wajib', kkm: 75, jumlah_jam: 3, tingkat: 'VII,VIII,IX,X,XI,XII' },
  { kode: 'PJK',   nama: 'Penjasorkes',             kelompok: 'Wajib', kkm: 75, jumlah_jam: 3, tingkat: 'VII,VIII,IX,X,XI,XII' },
  { kode: 'SBK',   nama: 'Seni Budaya & Keterampilan', kelompok: 'Wajib', kkm: 75, jumlah_jam: 2, tingkat: 'VII,VIII,IX,X,XI,XII' },
  { kode: 'BDR',   nama: 'Bimbingan dan Konseling', kelompok: 'Wajib', kkm: 75, jumlah_jam: 1, tingkat: 'VII,VIII,IX,X,XI,XII' },

  // ── IPA SMP ────────────────────────────────────────────
  { kode: 'IPA',   nama: 'Ilmu Pengetahuan Alam',   kelompok: 'IPA',   kkm: 75, jumlah_jam: 5, tingkat: 'VII,VIII,IX' },
  { kode: 'IPS',   nama: 'Ilmu Pengetahuan Sosial',  kelompok: 'IPS',   kkm: 75, jumlah_jam: 4, tingkat: 'VII,VIII,IX' },
  { kode: 'INF',   nama: 'Informatika',              kelompok: 'Wajib', kkm: 75, jumlah_jam: 2, tingkat: 'VII,VIII,IX' },
  { kode: 'PKK',   nama: 'Prakarya & Kewirausahaan',kelompok: 'Wajib', kkm: 75, jumlah_jam: 2, tingkat: 'VII,VIII,IX' },

  // ── IPA SMA (Peminatan) ────────────────────────────────
  { kode: 'FIS',   nama: 'Fisika',                  kelompok: 'IPA',   kkm: 75, jumlah_jam: 4, tingkat: 'X,XI,XII' },
  { kode: 'KIM',   nama: 'Kimia',                   kelompok: 'IPA',   kkm: 75, jumlah_jam: 4, tingkat: 'X,XI,XII' },
  { kode: 'BIO',   nama: 'Biologi',                 kelompok: 'IPA',   kkm: 75, jumlah_jam: 4, tingkat: 'X,XI,XII' },
  { kode: 'MTK-W', nama: 'Matematika Peminatan',    kelompok: 'IPA',   kkm: 75, jumlah_jam: 4, tingkat: 'X,XI,XII' },

  // ── IPS SMA (Peminatan) ────────────────────────────────
  { kode: 'EKO',   nama: 'Ekonomi',                 kelompok: 'IPS',   kkm: 75, jumlah_jam: 4, tingkat: 'X,XI,XII' },
  { kode: 'SEJ',   nama: 'Sejarah Indonesia',       kelompok: 'IPS',   kkm: 75, jumlah_jam: 3, tingkat: 'X,XI,XII' },
  { kode: 'SEJ-W', nama: 'Sejarah Peminatan',       kelompok: 'IPS',   kkm: 75, jumlah_jam: 3, tingkat: 'X,XI,XII' },
  { kode: 'GEO',   nama: 'Geografi',                kelompok: 'IPS',   kkm: 75, jumlah_jam: 4, tingkat: 'X,XI,XII' },
  { kode: 'SOS',   nama: 'Sosiologi',               kelompok: 'IPS',   kkm: 75, jumlah_jam: 3, tingkat: 'X,XI,XII' },
  { kode: 'ANT',   nama: 'Antropologi',             kelompok: 'IPS',   kkm: 75, jumlah_jam: 2, tingkat: 'XI,XII' },

  // ── WAJIB SMA ──────────────────────────────────────────
  { kode: 'SEJ-A', nama: 'Sejarah Wajib',           kelompok: 'Wajib', kkm: 75, jumlah_jam: 2, tingkat: 'X,XI,XII' },
  { kode: 'BSN',   nama: 'Bahasa Sunda',             kelompok: 'Muatan Lokal', kkm: 70, jumlah_jam: 2, tingkat: 'VII,VIII,IX,X,XI,XII' },
];

async function seed() {
  try {
    let inserted = 0, skipped = 0;
    for (const m of mapelData) {
      const exists = await pool.query(`SELECT id FROM academic.mata_pelajaran WHERE kode = $1`, [m.kode]);
      if (exists.rowCount === 0) {
        await pool.query(
          `INSERT INTO academic.mata_pelajaran (kode, nama, kelompok, kkm, jumlah_jam, tingkat) VALUES ($1,$2,$3,$4,$5,$6)`,
          [m.kode, m.nama, m.kelompok, m.kkm, m.jumlah_jam, m.tingkat]
        );
        inserted++;
      } else {
        skipped++;
      }
    }
    console.log(`✅ Selesai! Inserted: ${inserted}, Skipped: ${skipped}`);
  } catch(err) {
    console.error('Error:', err.message);
  } finally {
    pool.end();
  }
}
seed();
