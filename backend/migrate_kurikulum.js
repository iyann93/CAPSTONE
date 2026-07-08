require('dotenv').config();
const { getClient, pool } = require('./src/config/db');

async function migrate() {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    
    // Create kurikulum table
    await client.query(`
      CREATE TABLE IF NOT EXISTS academic.kurikulum (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        kode_kurikulum VARCHAR(50) NOT NULL,
        nama_kurikulum VARCHAR(100) NOT NULL,
        tahun_ajaran_id UUID REFERENCES academic.tahun_ajaran(id) ON DELETE RESTRICT,
        status VARCHAR(20) DEFAULT 'Draft',
        deskripsi TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Tabel academic.kurikulum berhasil dibuat.');
    
    // Add kurikulum_id to mata_pelajaran
    await client.query(`
      ALTER TABLE academic.mata_pelajaran 
      ADD COLUMN IF NOT EXISTS kurikulum_id UUID REFERENCES academic.kurikulum(id) ON DELETE SET NULL;
    `);
    
    console.log('Kolom kurikulum_id berhasil ditambahkan ke academic.mata_pelajaran.');
    
    await client.query('COMMIT');
    console.log('Migrasi Tahap 1 sukses.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error saat migrasi:', err);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
