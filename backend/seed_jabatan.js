const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function seedJabatan() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Insert Jabatan Data
    const jabatanData = [
      { nama: 'Guru Tetap Yayasan', deskripsi: 'Guru dengan status kepegawaian tetap di yayasan.' },
      { nama: 'Guru Honorer', deskripsi: 'Guru dengan status kepegawaian honorer.' },
      { nama: 'Staf Tata Usaha', deskripsi: 'Karyawan bagian tata usaha sekolah.' },
      { nama: 'Kepala Sekolah', deskripsi: 'Kepala Sekolah.' },
      { nama: 'Bendahara Sekolah', deskripsi: 'Karyawan bagian keuangan.' },
      { nama: 'Petugas Kebersihan', deskripsi: 'Karyawan kebersihan sekolah.' },
      { nama: 'Satpam', deskripsi: 'Petugas keamanan sekolah.' },
    ];

    console.log('Seeding shared.jabatan...');
    for (const jab of jabatanData) {
      // Check if exists
      const res = await client.query('SELECT id FROM shared.jabatan WHERE nama = $1', [jab.nama]);
      if (res.rows.length === 0) {
        await client.query(`
          INSERT INTO shared.jabatan (nama, deskripsi)
          VALUES ($1, $2)
        `, [jab.nama, jab.deskripsi]);
      }
    }

    // 2. Link some random users to Jabatan (so override works)
    console.log('Linking users to jabatan...');
    const usersRes = await client.query(`
      SELECT u.id, r.nama_role as role 
      FROM shared.users u
      JOIN shared.user_roles ur ON u.id = ur.user_id
      JOIN shared.roles r ON ur.role_id = r.id
      WHERE r.nama_role NOT IN ('Siswa', 'Orang Tua')
    `);
    
    // Get all jabatan
    const allJab = await client.query('SELECT id, nama FROM shared.jabatan');
    const jabMap = {};
    allJab.rows.forEach(r => jabMap[r.nama] = r.id);

    for (const u of usersRes.rows) {
      let targetJabId = null;
      if (u.role === 'Guru') targetJabId = jabMap['Guru Tetap Yayasan'];
      else if (u.role === 'Admin TU') targetJabId = jabMap['Staf Tata Usaha'];
      else if (u.role === 'Bendahara') targetJabId = jabMap['Bendahara Sekolah'];
      else if (u.role === 'Kepala Sekolah') targetJabId = jabMap['Kepala Sekolah'];
      else targetJabId = jabMap['Staf Tata Usaha']; // fallback

      if (targetJabId) {
        await client.query(`UPDATE shared.users SET jabatan_id = $1 WHERE id = $2 AND jabatan_id IS NULL`, [targetJabId, u.id]);
      }
    }

    // 3. Insert some Komponen Gaji
    console.log('Seeding finance.komponen_gaji...');
    const komponenData = [
      { nama: 'Gaji Pokok', kategori: 'umum', tipe: 'tunjangan', formula: 'flat', nominal: 3000000 },
      { nama: 'Tunjangan Jabatan', kategori: 'umum', tipe: 'tunjangan', formula: 'flat', nominal: 500000 },
      { nama: 'Tunjangan Kehadiran', kategori: 'umum', tipe: 'tunjangan', formula: 'per_hari_hadir', nominal: 25000 },
      { nama: 'Potongan BPJS', kategori: 'umum', tipe: 'potongan', formula: 'flat', nominal: 50000 },
      { nama: 'Potongan Koperasi', kategori: 'umum', tipe: 'potongan', formula: 'flat', nominal: 100000 },
    ];

    for (const komp of komponenData) {
      const res = await client.query('SELECT id FROM finance.komponen_gaji WHERE nama = $1', [komp.nama]);
      if (res.rows.length === 0) {
        await client.query(`
          INSERT INTO finance.komponen_gaji (nama, kategori, tipe, formula_tipe, nominal_default, nilai_satuan, is_aktif)
          VALUES ($1, $2, $3, $4, $5, $6, true)
        `, [
          komp.nama, komp.kategori, komp.tipe, komp.formula, 
          komp.formula === 'flat' ? komp.nominal : 0, 
          komp.formula === 'flat' ? 0 : komp.nominal
        ]);
      }
    }

    await client.query('COMMIT');
    console.log('Seeding selesai!');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Seeding error:', e);
  } finally {
    client.release();
    pool.end();
  }
}

seedJabatan();
