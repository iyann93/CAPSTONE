require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  try {
    // Clear existing
    await pool.query(`DELETE FROM academic.orang_tua`);

    // Get 10 students
    const resSiswa = await pool.query(`SELECT id FROM academic.siswa LIMIT 10`);
    if (resSiswa.rows.length === 0) {
      console.log('Tidak ada siswa di database. Tidak bisa seeding orang tua.');
      return;
    }

    const dummyParents = [
      { nama_ayah: "Budi Santoso", nama_ibu: "Siti Aminah", telepon: "081234567890", pekerjaan_wali: "Wiraswasta" },
      { nama_ayah: "Haryanto", nama_ibu: "Ratna Sari", telepon: "081298765432", pekerjaan_wali: "PNS" },
      { nama_ayah: "Sugeng Riyadi", nama_ibu: "Tri Wahyuni", telepon: "081345678901", pekerjaan_wali: "Pegawai BUMN" },
      { nama_ayah: "Joko Widodo", nama_ibu: "Iriana", telepon: "085678901234", pekerjaan_wali: "Wiraswasta" },
      { nama_ayah: "Ridwan Kamil", nama_ibu: "Atalia Praratya", telepon: "081987654321", pekerjaan_wali: "PNS" },
      { nama_ayah: "Ahmad Dhani", nama_ibu: "Mulan Jameela", telepon: "087654321098", pekerjaan_wali: "Seniman" },
      { nama_ayah: "Raffi Ahmad", nama_ibu: "Nagita Slavina", telepon: "081112223334", pekerjaan_wali: "Pengusaha" },
      { nama_ayah: "Deddy Corbuzier", nama_ibu: "Sabrina Chairunnisa", telepon: "082233445566", pekerjaan_wali: "PNS" },
      { nama_ayah: "Sule", nama_ibu: "Nathalie Holscher", telepon: "089988776655", pekerjaan_wali: "Wiraswasta" },
      { nama_ayah: "Anang Hermansyah", nama_ibu: "Ashanty", telepon: "085544332211", pekerjaan_wali: "Wiraswasta" },
    ];

    for (let i = 0; i < Math.min(dummyParents.length, resSiswa.rows.length); i++) {
      const parent = dummyParents[i];
      const siswa_id = resSiswa.rows[i].id;

      await pool.query(`
        INSERT INTO academic.orang_tua (siswa_id, nama_ayah, nama_ibu, no_telepon, pekerjaan_wali, hubungan)
        VALUES ($1, $2, $3, $4, $5, 'ayah')
      `, [siswa_id, parent.nama_ayah, parent.nama_ibu, parent.telepon, parent.pekerjaan_wali]);
    }

    console.log('Berhasil seeding data orang tua ke Supabase!');
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
seed();
