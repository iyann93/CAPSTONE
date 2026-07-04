require('dotenv').config();
const { query } = require('./src/config/db');

(async () => {
  try {
    const roleRes = await query(`SELECT id FROM shared.roles WHERE nama_role = 'Admin TU' LIMIT 1`);
    if (roleRes.rows.length === 0) {
      console.log('Role Admin TU not found');
      return;
    }
    const roleId = roleRes.rows[0].id;

    const aksis = ['read', 'create', 'update', 'delete'];
    for (const aksi of aksis) {
      let permRes = await query(`SELECT id FROM shared.permissions WHERE modul = 'guru' AND aksi = $1`, [aksi]);
      let permId;
      if (permRes.rows.length === 0) {
        console.log(`Inserting permission guru.${aksi}...`);
        const insertPerm = await query(`INSERT INTO shared.permissions (nama_permission, modul, aksi) VALUES ($1, 'guru', $2) RETURNING id`, [`guru.${aksi}`, aksi]);
        permId = insertPerm.rows[0].id;
      } else {
        permId = permRes.rows[0].id;
      }

      const rolePermRes = await query(`SELECT id FROM shared.role_permissions WHERE role_id = $1 AND permission_id = $2`, [roleId, permId]);
      if (rolePermRes.rows.length === 0) {
        console.log(`Granting guru.${aksi} to Admin TU...`);
        await query(`INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2)`, [roleId, permId]);
      } else {
        console.log(`Admin TU already has guru.${aksi}`);
      }
    }
    console.log('Done!');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
})();
