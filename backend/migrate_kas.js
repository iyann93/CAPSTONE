require('dotenv').config();
const { query } = require('./src/config/db');

async function migrate() {
  try {
    console.log('Starting migration for Kas Sekolah...');

    await query(`
      CREATE TABLE IF NOT EXISTS finance.kas_sekolah (
        id SERIAL PRIMARY KEY,
        saldo DECIMAL(15,2) DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created finance.kas_sekolah table');

    await query(`
      CREATE TABLE IF NOT EXISTS finance.mutasi_kas (
        id SERIAL PRIMARY KEY,
        tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tipe VARCHAR(10) NOT NULL CHECK (tipe IN ('masuk', 'keluar')),
        nominal DECIMAL(15,2) NOT NULL,
        saldo_sebelum DECIMAL(15,2) NOT NULL,
        saldo_sesudah DECIMAL(15,2) NOT NULL,
        keterangan TEXT,
        referensi_sumber VARCHAR(50), 
        referensi_id INT 
      );
    `);
    console.log('Created finance.mutasi_kas table');

    const check = await query('SELECT count(*) FROM finance.kas_sekolah');
    if (parseInt(check.rows[0].count) === 0) {
      await query('INSERT INTO finance.kas_sekolah (id, saldo) VALUES (1, 0)');
      console.log('Initialized kas_sekolah with saldo 0');
    }

    console.log('Migration successful.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
