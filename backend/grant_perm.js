require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool();

async function grant() {
  try {
    const roleRes = await pool.query("SELECT id FROM shared.roles WHERE nama_role = 'Guru Mapel'");
    const roleId = roleRes.rows[0].id;
    console.log("Guru Mapel Role ID:", roleId);

    const permRes = await pool.query("SELECT id FROM shared.permissions WHERE modul = 'jadwal_pelajaran' AND aksi = 'read'");
    if (permRes.rows.length === 0) {
      console.log("Permission not found, inserting...");
      const insertPerm = await pool.query("INSERT INTO shared.permissions (modul, aksi) VALUES ('jadwal_pelajaran', 'read') RETURNING id");
      const permId = insertPerm.rows[0].id;
      await pool.query("INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [roleId, permId]);
    } else {
      const permId = permRes.rows[0].id;
      await pool.query("INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [roleId, permId]);
    }
    
    // Check for absensi.read, absensi.create, absensi.update
    const absPerms = await pool.query("SELECT id, modul, aksi FROM shared.permissions WHERE modul IN ('absensi', 'nilai')");
    for (const p of absPerms.rows) {
      await pool.query("INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [roleId, p.id]);
    }

    console.log("Granted permissions successfully!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    pool.end();
  }
}

grant();
