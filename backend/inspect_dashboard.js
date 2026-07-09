require('dotenv').config();
const { pool } = require('./src/config/db');

async function inspect() {
  try {
    // Shared schema tables
    const sharedTables = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'shared' ORDER BY table_name`);
    console.log('Shared tables:', sharedTables.rows.map(r => r.table_name));

    // Academic schema tables
    const academicTables = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'academic' ORDER BY table_name`);
    console.log('Academic tables:', academicTables.rows.map(r => r.table_name));

    // Finance schema tables
    const financeTables = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'finance' ORDER BY table_name`);
    console.log('Finance tables:', financeTables.rows.map(r => r.table_name));

    // Absensi columns
    const absensi = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'academic' AND table_name = 'absensi' ORDER BY ordinal_position`);
    console.log('\nabsensi columns:', JSON.stringify(absensi.rows, null, 2));

    // Jadwal pelajaran columns
    const jadwal = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'academic' AND table_name = 'jadwal_pelajaran' ORDER BY ordinal_position`);
    console.log('\njadwal_pelajaran columns:', JSON.stringify(jadwal.rows, null, 2));

    // Nilai columns
    const nilai = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'academic' AND table_name = 'nilai' ORDER BY ordinal_position`);
    console.log('\nnilai columns:', JSON.stringify(nilai.rows, null, 2));

    // Tagihan SPP columns
    const tagihan = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'finance' AND table_name = 'tagihan_spp' ORDER BY ordinal_position`);
    console.log('\ntagihan_spp columns:', JSON.stringify(tagihan.rows, null, 2));

    // Transaksi pembayaran columns
    const transaksi = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'finance' AND table_name = 'transaksi_pembayaran' ORDER BY ordinal_position`);
    console.log('\ntransaksi_pembayaran columns:', JSON.stringify(transaksi.rows, null, 2));

    // Siswa columns
    const siswa = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'academic' AND table_name = 'siswa' ORDER BY ordinal_position`);
    console.log('\nsiswa columns:', JSON.stringify(siswa.rows, null, 2));

    // Guru columns
    const guru = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'academic' AND table_name = 'guru' ORDER BY ordinal_position`);
    console.log('\nguru columns:', JSON.stringify(guru.rows, null, 2));

    // Kelas columns
    const kelas = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'academic' AND table_name = 'kelas' ORDER BY ordinal_position`);
    console.log('\nkelas columns:', JSON.stringify(kelas.rows, null, 2));

    // Karyawan columns
    const karyawan = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'shared' AND table_name = 'karyawan' ORDER BY ordinal_position`);
    console.log('\nkaryawan columns:', JSON.stringify(karyawan.rows, null, 2));

    // Users columns
    const users = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'shared' AND table_name = 'users' ORDER BY ordinal_position`);
    console.log('\nusers columns:', JSON.stringify(users.rows, null, 2));

    // Slip gaji columns
    const slipGaji = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'finance' AND table_name = 'slip_gaji' ORDER BY ordinal_position`);
    console.log('\nslip_gaji columns:', JSON.stringify(slipGaji.rows, null, 2));

  } catch(e) {
    console.error(e.message, e.stack);
  } finally {
    pool.end();
  }
}
inspect();
