require('dotenv').config();
const { query } = require('./src/config/db');

async function fix() {
  try {
    const roleRes = await query("SELECT id FROM shared.roles WHERE nama_role = 'Wakil Kepala'");
    const roleId = roleRes.rows[0].id;
    
    // 1. Insert semester.read if not exists
    let permRes = await query("SELECT id FROM shared.permissions WHERE modul = 'semester' AND aksi = 'read'");
    let permId;
    if (permRes.rows.length === 0) {
      const insertRes = await query("INSERT INTO shared.permissions (modul, aksi, nama_permission) VALUES ('semester', 'read', 'Membaca Data Semester') RETURNING id");
      permId = insertRes.rows[0].id;
      console.log("Created semester.read permission in DB.");
    } else {
      permId = permRes.rows[0].id;
    }

    // 2. Assign to Wakil Kepala
    const checkRes = await query("SELECT 1 FROM shared.role_permissions WHERE role_id = $1 AND permission_id = $2", [roleId, permId]);
    if (checkRes.rows.length === 0) {
      await query("INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2)", [roleId, permId]);
      console.log("Assigned semester.read to Wakil Kepala.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
fix();


