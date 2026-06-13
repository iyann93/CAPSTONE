require('dotenv').config();
const { pool } = require('./src/config/db');

async function inspectRbac() {
  try {
    const roles = await pool.query(`SELECT id, nama_role, deskripsi FROM shared.roles`);
    console.log('== ROLES ==');
    console.log(roles.rows);

    const userRoles = await pool.query(`
      SELECT ur.user_id, u.email, u.nama as user_nama, r.nama_role as role_nama
      FROM shared.user_roles ur
      JOIN shared.users u ON ur.user_id = u.id
      JOIN shared.roles r ON ur.role_id = r.id
    `);
    console.log('\n== USER ROLES ==');
    console.log(userRoles.rows);

    const bendaharaRole = roles.rows.find(r => r.nama_role === 'Bendahara');
    if (bendaharaRole) {
      const perms = await pool.query(`
        SELECT p.nama_permission, p.modul, p.aksi
        FROM shared.role_permissions rp
        JOIN shared.permissions p ON rp.permission_id = p.id
        WHERE rp.role_id = $1
      `, [bendaharaRole.id]);
      console.log('\n== BENDAHARA PERMISSIONS ==');
      console.log(perms.rows);
    }
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
inspectRbac();
