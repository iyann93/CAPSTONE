require('dotenv').config();
const { query } = require('./src/config/db');

async function grantPerm(roleName, modulName, aksiName) {
  const roleRes = await query("SELECT id FROM shared.roles WHERE nama_role = $1", [roleName]);
  if (roleRes.rows.length === 0) return;
  const roleId = roleRes.rows[0].id;

  const pRes = await query("SELECT id FROM shared.permissions WHERE modul = $1 AND aksi = $2", [modulName, aksiName]);
  let permId;
  if (pRes.rows.length > 0) {
    permId = pRes.rows[0].id;
  } else {
    const ins = await query("INSERT INTO shared.permissions (nama_permission, modul, aksi) VALUES ($1, $2, $3) RETURNING id", [`${modulName} ${aksiName}`, modulName, aksiName]);
    permId = ins.rows[0].id;
  }
  await query("INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [roleId, permId]);
}

async function fix() {
  try {
    await grantPerm('Wali Kelas', 'jadwal_pelajaran', 'read');
    console.log('Done granting permissions.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
fix();
