'use strict';

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

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('🔄 Mengosongkan tabel jurusan...');

    // Nullkan referensi jurusan di tabel kelas agar tidak ada FK violation
    await client.query(`UPDATE academic.kelas SET jurusan_id = NULL WHERE jurusan_id IS NOT NULL`);
    console.log('✅ Referensi jurusan pada tabel kelas dikosongkan');

    // Nullkan referensi jurusan di tabel siswa jika ada
    const checkSiswa = await client.query(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_schema='academic' AND table_name='siswa' AND column_name='jurusan_id'`
    );
    if (checkSiswa.rows.length > 0) {
      await client.query(`UPDATE academic.siswa SET jurusan_id = NULL WHERE jurusan_id IS NOT NULL`);
      console.log('✅ Referensi jurusan pada tabel siswa dikosongkan');
    }

    // Hapus semua data jurusan
    const delRes = await client.query(`DELETE FROM academic.jurusan RETURNING id, nama`);
    console.log(`🗑️  Berhasil menghapus ${delRes.rows.length} data jurusan:`);
    delRes.rows.forEach(r => console.log(`   - ${r.nama} (${r.id})`));

    await client.query('COMMIT');
    console.log('\n🎉 Tabel jurusan berhasil dikosongkan.');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error, rollback dilakukan:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

run();
