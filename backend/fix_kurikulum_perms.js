require('dotenv').config();
const { query } = require('./src/config/db');

async function fix() {
  try {
    const roleRes = await query("SELECT id FROM shared.roles WHERE nama_role = 'Wakil Kepala'");
    const roleId = roleRes.rows[0].id;
    const perms = ['read', 'create', 'update', 'delete'];
    
    for (const aksi of perms) {
      const pRes = await query("SELECT id FROM shared.permissions WHERE modul = 'kurikulum' AND aksi = $1", [aksi]);
      let permId;
      if (pRes.rows.length > 0) {
        permId = pRes.rows[0].id;
      } else {
        const ins = await query("INSERT INTO shared.permissions (nama_permission, modul, aksi) VALUES ($1, 'kurikulum', $2) RETURNING id", ['Kurikulum ' + aksi, aksi]);
        permId = ins.rows[0].id;
      }
      await query("INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [roleId, permId]);
    }
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
fix();
