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

async function fix() {
  try {
    const roleRes = await pool.query("SELECT id FROM shared.roles WHERE nama_role = 'Guru Mapel'");
    const roleId = roleRes.rows[0].id;
    
    // Check if permission exists
    let permRes = await pool.query("SELECT id FROM shared.permissions WHERE modul = 'jadwal_pelajaran' AND aksi = 'read'");
    let permId;
    
    if (permRes.rows.length === 0) {
      const insPerm = await pool.query("INSERT INTO shared.permissions (nama_permission, modul, aksi) VALUES ('Melihat Jadwal', 'jadwal_pelajaran', 'read') RETURNING id");
      permId = insPerm.rows[0].id;
    } else {
      permId = permRes.rows[0].id;
    }
    
    await pool.query("INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [roleId, permId]);
    console.log("Permission granted successfully!");
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
fix();
