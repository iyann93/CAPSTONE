require('dotenv').config();
const { query } = require('./src/config/db');

async function fix() {
  try {
    let pRes = await query("SELECT id FROM shared.permissions WHERE modul = 'tahun_ajaran' AND aksi = 'read'");
    let permId;
    if (pRes.rows.length === 0) {
      const iRes = await query("INSERT INTO shared.permissions (modul, aksi, nama_permission) VALUES ('tahun_ajaran', 'read', 'Membaca Tahun Ajaran') RETURNING id");
      permId = iRes.rows[0].id;
    } else {
      permId = pRes.rows[0].id;
    }

    const roleTuRes = await query("SELECT id FROM shared.roles WHERE nama_role = 'Admin TU'");
    if (roleTuRes.rows.length > 0) {
      const tuId = roleTuRes.rows[0].id;
      const c1 = await query("SELECT 1 FROM shared.role_permissions WHERE role_id = $1 AND permission_id = $2", [tuId, permId]);
      if (c1.rows.length === 0) await query("INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2)", [tuId, permId]);
    }

    const roleWkRes = await query("SELECT id FROM shared.roles WHERE nama_role = 'Wakil Kepala'");
    if (roleWkRes.rows.length > 0) {
      const wkId = roleWkRes.rows[0].id;
      const c2 = await query("SELECT 1 FROM shared.role_permissions WHERE role_id = $1 AND permission_id = $2", [wkId, permId]);
      if (c2.rows.length === 0) await query("INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2)", [wkId, permId]);
    }
    
    const perms = ['create', 'update', 'delete'];
    for (const aksi of perms) {
      let p2Res = await query("SELECT id FROM shared.permissions WHERE modul = 'tahun_ajaran' AND aksi = $1", [aksi]);
      let p2Id;
      if (p2Res.rows.length === 0) {
        const i2Res = await query("INSERT INTO shared.permissions (modul, aksi, nama_permission) VALUES ('tahun_ajaran', $1, 'Manajemen Tahun Ajaran') RETURNING id", [aksi]);
        p2Id = i2Res.rows[0].id;
      } else {
        p2Id = p2Res.rows[0].id;
      }
      const tuId = roleTuRes.rows[0].id;
      const c3 = await query("SELECT 1 FROM shared.role_permissions WHERE role_id = $1 AND permission_id = $2", [tuId, p2Id]);
      if (c3.rows.length === 0) await query("INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2)", [tuId, p2Id]);
    }
    console.log("Permissions for tahun_ajaran created successfully");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
fix();
