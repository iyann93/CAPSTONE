'use strict';
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD),
  port: parseInt(process.env.DB_PORT, 10),
});

async function run() {
  try {
    const roles = await pool.query(`SELECT id, nama_role FROM shared.roles WHERE nama_role IN ('Orang Tua', 'Siswa')`);
    console.log('Roles found:', roles.rows);
    
    let perm = await pool.query(`SELECT id FROM shared.permissions WHERE modul = 'beasiswa' AND aksi = 'read'`);
    let permId;
    if (perm.rows.length === 0) {
      console.log('Permission beasiswa.read not found, creating it...');
      const insertPerm = await pool.query(
        `INSERT INTO shared.permissions (modul, aksi, deskripsi) VALUES ('beasiswa', 'read', 'Melihat daftar beasiswa') RETURNING id`
      );
      permId = insertPerm.rows[0].id;
    } else {
      permId = perm.rows[0].id;
    }
    
    for (const role of roles.rows) {
      const check = await pool.query(`SELECT * FROM shared.role_permissions WHERE role_id = $1 AND permission_id = $2`, [role.id, permId]);
      if (check.rows.length === 0) {
        await pool.query(`INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2)`, [role.id, permId]);
        console.log(`Granted beasiswa.read to ${role.nama_role}`);
      } else {
        console.log(`Role ${role.nama_role} already has beasiswa.read`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
