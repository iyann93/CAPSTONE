require('dotenv').config();
const { pool } = require('./src/config/db');
async function setup() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS finance.operasional_transactions (
        id SERIAL PRIMARY KEY,
        tipe VARCHAR(20) NOT NULL CHECK (tipe IN ('pemasukan', 'pengeluaran')),
        tanggal DATE NOT NULL,
        nama VARCHAR(255) NOT NULL,
        kategori VARCHAR(100) NOT NULL,
        nominal NUMERIC NOT NULL,
        sumber_dana VARCHAR(100),
        keterangan TEXT,
        bukti JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabel finance.operasional_transactions berhasil dibuat atau sudah ada.');
  } catch (err) {
    console.error('Gagal membuat tabel:', err);
  } finally {
    pool.end();
  }
}
setup();
