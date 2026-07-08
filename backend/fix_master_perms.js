require('dotenv').config();
const { query } = require('./src/config/db');

async function fix() {
  try {
    const roleRes = await query("SELECT id FROM shared.roles WHERE nama_role = 'Wakil Kepala'");
    const roleId = roleRes.rows[0].id;
    
    const requiredPerms = [
      { modul: 'guru', aksi: 'read' },
      { modul: 'kelas', aksi: 'read' },
      { modul: 'mapel', aksi: 'read' },
      { modul: 'semester', aksi: 'read' }
    ];

    for (const p of requiredPerms) {
      const pRes = await query("SELECT id FROM shared.permissions WHERE modul = $1 AND aksi = $2", [p.modul, p.aksi]);
      if (pRes.rows.length > 0) {
         const permId = pRes.rows[0].id;
         const checkRes = await query("SELECT 1 FROM shared.role_permissions WHERE role_id = $1 AND permission_id = $2", [roleId, permId]);
         if (checkRes.rows.length === 0) {
           await query("INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2)", [roleId, permId]);
           console.log("Added permission " + p.modul + "." + p.aksi);
         } else {
           console.log("Permission exists: " + p.modul + "." + p.aksi);
         }
      } else {
         console.log("Permission NOT FOUND: " + p.modul + "." + p.aksi);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
fix();
