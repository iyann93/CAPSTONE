const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER, password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST, port: process.env.DB_PORT,
  database: process.env.DB_DATABASE, ssl: { rejectUnauthorized: false }
});

// Data mata pelajaran lengkap SMP & SMA Indonesia (Kurikulum Merdeka)
const mapelBaru = [
  // ── WAJIB SMP (VII-IX) ────────────────────────────────────────────────────
  { kode: 'PPKn',   nama: 'PPKn (Pancasila)',                kelompok: 'Wajib',         kkm: 75, jumlah_jam: 3,  tingkat: 'VII,VIII,IX' },
  { kode: 'BSMP',   nama: 'Bahasa Daerah',                  kelompok: 'Muatan Lokal',  kkm: 70, jumlah_jam: 2,  tingkat: 'VII,VIII,IX' },
  { kode: 'MTK-B',  nama: 'Matematika Umum',                kelompok: 'Wajib',         kkm: 75, jumlah_jam: 5,  tingkat: 'VII,VIII,IX' },

  // ── WAJIB SMA (X-XII) ─────────────────────────────────────────────────────
  { kode: 'PPKn-A', nama: 'PPKn / Pendidikan Pancasila',    kelompok: 'Wajib',         kkm: 75, jumlah_jam: 2,  tingkat: 'X,XI,XII' },
  { kode: 'MTK-A',  nama: 'Matematika Umum',                kelompok: 'Wajib',         kkm: 75, jumlah_jam: 4,  tingkat: 'X,XI,XII' },
  { kode: 'BSMA',   nama: 'Bahasa Daerah',                  kelompok: 'Muatan Lokal',  kkm: 70, jumlah_jam: 2,  tingkat: 'X,XI,XII' },
  { kode: 'BIND-A', nama: 'Bahasa Indonesia',               kelompok: 'Wajib',         kkm: 75, jumlah_jam: 4,  tingkat: 'X,XI,XII' },
  { kode: 'BING-A', nama: 'Bahasa Inggris Umum',            kelompok: 'Wajib',         kkm: 75, jumlah_jam: 3,  tingkat: 'X,XI,XII' },
  { kode: 'PAI-A',  nama: 'Pendidikan Agama Islam',         kelompok: 'Wajib',         kkm: 75, jumlah_jam: 3,  tingkat: 'X,XI,XII' },
  { kode: 'PJK-A',  nama: 'Pendidikan Jasmani Olahraga',   kelompok: 'Wajib',         kkm: 75, jumlah_jam: 3,  tingkat: 'X,XI,XII' },
  { kode: 'SBD-A',  nama: 'Seni Budaya',                    kelompok: 'Wajib',         kkm: 75, jumlah_jam: 2,  tingkat: 'X,XI,XII' },
  { kode: 'INF-A',  nama: 'Informatika',                    kelompok: 'Wajib',         kkm: 75, jumlah_jam: 2,  tingkat: 'X,XI,XII' },
  { kode: 'PKW-A',  nama: 'Prakarya & Kewirausahaan',       kelompok: 'Wajib',         kkm: 75, jumlah_jam: 2,  tingkat: 'X,XI,XII' },
  { kode: 'BK-A',   nama: 'Bimbingan Konseling (BK)',       kelompok: 'Wajib',         kkm: 70, jumlah_jam: 1,  tingkat: 'X,XI,XII' },

  // ── IPA SMA PEMINATAN ─────────────────────────────────────────────────────
  { kode: 'FIS-P',  nama: 'Fisika Peminatan',               kelompok: 'IPA',           kkm: 75, jumlah_jam: 4,  tingkat: 'XI,XII' },
  { kode: 'KIM-P',  nama: 'Kimia Peminatan',                kelompok: 'IPA',           kkm: 75, jumlah_jam: 4,  tingkat: 'XI,XII' },
  { kode: 'BIO-P',  nama: 'Biologi Peminatan',              kelompok: 'IPA',           kkm: 75, jumlah_jam: 4,  tingkat: 'XI,XII' },
  { kode: 'MTK-P',  nama: 'Matematika Peminatan IPA',       kelompok: 'IPA',           kkm: 75, jumlah_jam: 4,  tingkat: 'XI,XII' },

  // ── IPS SMA PEMINATAN ─────────────────────────────────────────────────────
  { kode: 'EKO-P',  nama: 'Ekonomi Peminatan',              kelompok: 'IPS',           kkm: 75, jumlah_jam: 4,  tingkat: 'XI,XII' },
  { kode: 'SEJ-P',  nama: 'Sejarah Peminatan IPS',          kelompok: 'IPS',           kkm: 75, jumlah_jam: 4,  tingkat: 'XI,XII' },
  { kode: 'GEO-P',  nama: 'Geografi Peminatan',             kelompok: 'IPS',           kkm: 75, jumlah_jam: 4,  tingkat: 'XI,XII' },
  { kode: 'SOS-P',  nama: 'Sosiologi Peminatan',            kelompok: 'IPS',           kkm: 75, jumlah_jam: 4,  tingkat: 'XI,XII' },

  // ── LINTAS MINAT / PILIHAN ────────────────────────────────────────────────
  { kode: 'BING-P', nama: 'Bahasa Inggris Peminatan',       kelompok: 'Lintas Minat',  kkm: 75, jumlah_jam: 4,  tingkat: 'X,XI,XII' },
  { kode: 'BJEP',   nama: 'Bahasa Jepang',                  kelompok: 'Lintas Minat',  kkm: 70, jumlah_jam: 3,  tingkat: 'X,XI,XII' },
  { kode: 'BMAN',   nama: 'Bahasa Mandarin',                kelompok: 'Lintas Minat',  kkm: 70, jumlah_jam: 3,  tingkat: 'X,XI,XII' },
  { kode: 'BJAR',   nama: 'Bahasa Arab',                    kelompok: 'Lintas Minat',  kkm: 70, jumlah_jam: 3,  tingkat: 'X,XI,XII' },
  { kode: 'LIT',    nama: 'Sastra Indonesia',               kelompok: 'Lintas Minat',  kkm: 70, jumlah_jam: 3,  tingkat: 'X,XI,XII' },
  { kode: 'BGER',   nama: 'Bahasa Jerman',                  kelompok: 'Lintas Minat',  kkm: 70, jumlah_jam: 3,  tingkat: 'X,XI,XII' },
];

async function seed() {
  let inserted = 0, skipped = 0;
  try {
    for (const m of mapelBaru) {
      const exists = await pool.query(`SELECT id FROM academic.mata_pelajaran WHERE kode = $1`, [m.kode]);
      if (exists.rowCount === 0) {
        await pool.query(
          `INSERT INTO academic.mata_pelajaran (kode, nama, kelompok, kkm, jumlah_jam, tingkat) VALUES ($1,$2,$3,$4,$5,$6)`,
          [m.kode, m.nama, m.kelompok, m.kkm, m.jumlah_jam, m.tingkat]
        );
        inserted++;
        console.log(`  ✅ ${m.kode} - ${m.nama}`);
      } else {
        skipped++;
      }
    }
    console.log(`\nSelesai! Ditambahkan: ${inserted} | Dilewati: ${skipped}`);
  } catch(err) {
    console.error('Error:', err.message);
  } finally {
    pool.end();
  }
}

seed();
