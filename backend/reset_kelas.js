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
    console.log('🔄 Memulai reset data kelas...');

    // 1. Ambil tahun ajaran aktif
    const taRes = await client.query(
      `SELECT id, nama FROM academic.tahun_ajaran WHERE is_aktif = true LIMIT 1`
    );
    if (taRes.rows.length === 0) {
      throw new Error('Tidak ada tahun ajaran aktif. Harap aktifkan tahun ajaran terlebih dahulu.');
    }
    const tahunAjaranId = taRes.rows[0].id;
    const tahunAjaranNama = taRes.rows[0].nama;
    console.log(`✅ Tahun ajaran aktif: ${tahunAjaranNama} (${tahunAjaranId})`);

    // 2. Nullkan referensi siswa ke kelas (agar DELETE tidak gagal karena FK)
    await client.query(`UPDATE academic.siswa SET kelas_id = NULL`);
    console.log('✅ Referensi siswa ke kelas dikosongkan sementara');

    // 3. Hapus semua data kelas yang ada
    const delRes = await client.query(`DELETE FROM academic.kelas RETURNING id`);
    console.log(`🗑️  Berhasil menghapus ${delRes.rows.length} kelas lama`);

    // 4. Insert 3 kelas baru: VII, VIII, IX
    const kelasBaru = [
      { kode: 'VII', nama: 'Kelas VII',  tingkat: 'VII',  kapasitas: 32 },
      { kode: 'VIII', nama: 'Kelas VIII', tingkat: 'VIII', kapasitas: 32 },
      { kode: 'IX',  nama: 'Kelas IX',   tingkat: 'IX',   kapasitas: 32 },
    ];

    for (const kelas of kelasBaru) {
      await client.query(
        `INSERT INTO academic.kelas (kode_kelas, nama_kelas, tingkat, kapasitas, tahun_ajaran_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [kelas.kode, kelas.nama, kelas.tingkat, kelas.kapasitas, tahunAjaranId]
      );
      console.log(`✅ Kelas dibuat: ${kelas.nama} (${kelas.kode})`);
    }

    await client.query('COMMIT');
    console.log('\n🎉 Selesai! Database kelas telah diperbarui menjadi:');
    console.log('   - Kelas VII');
    console.log('   - Kelas VIII');
    console.log('   - Kelas IX');
    console.log('\n⚠️  Catatan: Data siswa yang sebelumnya terhubung ke kelas lama perlu di-assign ulang ke kelas baru.');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error, rollback dilakukan:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

run();
