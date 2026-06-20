const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});

async function updateJabatan() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // The requested jabatan list
    const requested = [
      'guru', 'walikelas', 'kepala sekolah', 'superadmin', 'admin tu', 'bendahara', 'karyawan'
    ];
    
    // We will clear existing and insert new ones
    // First, set users' jabatan_id to NULL to avoid foreign key violations
    await client.query('UPDATE shared.users SET jabatan_id = NULL');
    
    // Clear all jabatan
    await client.query('DELETE FROM finance.template_gaji_jabatan');
    await client.query('DELETE FROM shared.jabatan');
    
    console.log('Cleared existing jabatan...');
    
    // Insert new
    for (const jab of requested) {
      // capitalize words
      const name = jab.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      await client.query('INSERT INTO shared.jabatan (nama, deskripsi) VALUES ($1, $2)', [name, name]);
    }
    
    console.log('Inserted new jabatan list...');
    
    // Re-link users where possible
    const allJab = await client.query('SELECT id, nama FROM shared.jabatan');
    const jabMap = {};
    allJab.rows.forEach(r => jabMap[r.nama.toLowerCase()] = r.id);
    
    const usersRes = await client.query(`
      SELECT u.id, r.nama_role as role 
      FROM shared.users u
      JOIN shared.user_roles ur ON u.id = ur.user_id
      JOIN shared.roles r ON ur.role_id = r.id
      WHERE r.nama_role NOT IN ('Siswa', 'Orang Tua')
    `);
    
    for (const u of usersRes.rows) {
      let targetJabId = null;
      const roleLower = u.role.toLowerCase();
      
      if (roleLower === 'guru') targetJabId = jabMap['guru'];
      else if (roleLower === 'admin tu') targetJabId = jabMap['admin tu'];
      else if (roleLower === 'bendahara') targetJabId = jabMap['bendahara'];
      else if (roleLower === 'kepala sekolah') targetJabId = jabMap['kepala sekolah'];
      else if (roleLower === 'super admin') targetJabId = jabMap['superadmin'];
      else targetJabId = jabMap['karyawan'];

      if (targetJabId) {
        await client.query('UPDATE shared.users SET jabatan_id = $1 WHERE id = $2', [targetJabId, u.id]);
      }
    }
    
    console.log('Re-linked users to new jabatan.');

    await client.query('COMMIT');
    console.log('Done.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}

updateJabatan();
