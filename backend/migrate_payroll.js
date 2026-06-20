require('dotenv').config();
const { pool } = require('./src/config/db');

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('🚀 Memulai migrasi database untuk Payroll...\n');

    // 1. Buat Tabel Jabatan (di schema shared)
    console.log('📦 Membuat tabel shared.jabatan...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS shared.jabatan (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nama VARCHAR(100) NOT NULL UNIQUE,
        deskripsi TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('  ✓ OK');

    // 2. Tambah kolom jabatan_id di shared.users
    console.log('👤 Menambahkan kolom jabatan_id pada shared.users...');
    await client.query(`
      ALTER TABLE shared.users 
      ADD COLUMN IF NOT EXISTS jabatan_id UUID REFERENCES shared.jabatan(id) ON DELETE SET NULL;
    `);
    console.log('  ✓ OK');

    // 3. Buat Tabel Template Gaji Jabatan (di schema finance)
    console.log('📄 Membuat tabel finance.template_gaji_jabatan...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS finance.template_gaji_jabatan (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        jabatan_id UUID REFERENCES shared.jabatan(id) ON DELETE CASCADE,
        komponen_gaji_id UUID REFERENCES finance.komponen_gaji(id) ON DELETE CASCADE,
        nominal NUMERIC(15, 2) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(jabatan_id, komponen_gaji_id)
      );
    `);
    console.log('  ✓ OK');

    // 4. Buat Tabel Pengaturan Gaji User / Override (di schema finance)
    console.log('🔧 Membuat tabel finance.pengaturan_gaji_user...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS finance.pengaturan_gaji_user (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES shared.users(id) ON DELETE CASCADE,
        komponen_gaji_id UUID REFERENCES finance.komponen_gaji(id) ON DELETE CASCADE,
        nominal NUMERIC(15, 2) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, komponen_gaji_id)
      );
    `);
    console.log('  ✓ OK');

    await client.query('COMMIT');
    console.log('\n✅ Migrasi berhasil!\n');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n❌ Migrasi GAGAL:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
