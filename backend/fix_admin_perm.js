require('dotenv').config();
const { query } = require('./src/config/db');

async function fix() {
  try {
    // 1. Get Admin TU role ID
    const roleRes = await query("SELECT id FROM shared.roles WHERE nama_role = 'Admin TU'");
    const adminTuId = roleRes.rows[0].id;

    // 2. Get all jadwal_pelajaran permissions
    const permRes = await query("SELECT id FROM shared.permissions WHERE modul = 'jadwal_pelajaran'");
    const perms = permRes.rows;

    // 3. Insert them if not exist
    for (const p of perms) {
      await query(`
        INSERT INTO shared.role_permissions (role_id, permission_id) 
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
      `, [adminTuId, p.id]);
    }
    
    console.log("Permissions for Admin TU added successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
fix();
