require('dotenv').config();
const { pool } = require('./src/config/db');

async function migrate() {
  try {
    console.log('Starting migration for tagihan_spp...');
    
    // 1. Drop old constraint if exists
    await pool.query(`ALTER TABLE finance.tagihan_spp DROP CONSTRAINT IF EXISTS tagihan_spp_status_check;`);
    console.log('Dropped old status check constraint.');

    // 2. Add new constraint
    await pool.query(`
      ALTER TABLE finance.tagihan_spp 
      ADD CONSTRAINT tagihan_spp_status_check 
      CHECK (status::text = ANY (ARRAY['belum_bayar'::character varying, 'lunas'::character varying, 'cicilan'::character varying, 'menunggu_konfirmasi'::character varying]::text[]));
    `);
    console.log('Added new status check constraint with menunggu_konfirmasi.');

    // 3. Add column bukti_pembayaran_url
    await pool.query(`
      ALTER TABLE finance.tagihan_spp 
      ADD COLUMN IF NOT EXISTS bukti_pembayaran_url text;
    `);
    console.log('Added column bukti_pembayaran_url.');

    // 4. Add column tanggal_upload_bukti
    await pool.query(`
      ALTER TABLE finance.tagihan_spp 
      ADD COLUMN IF NOT EXISTS tanggal_upload_bukti timestamp with time zone;
    `);
    console.log('Added column tanggal_upload_bukti.');

    console.log('Migration completed successfully!');
  } catch (e) {
    console.error('Migration failed:', e.message);
  } finally {
    pool.end();
  }
}

migrate();
