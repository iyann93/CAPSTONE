require('dotenv').config();
const { query } = require('./src/config/db');

(async () => {
  try {
    const roles = await query('SELECT * FROM auth.roles');
    console.log('Roles:', roles.rows);
    
    const permissions = await query('SELECT * FROM auth.permissions WHERE name LIKE \'%guru%\'');
    console.log('Permissions related to guru:', permissions.rows);
    
    const rolePermissions = await query(`
      SELECT r.name as role_name, p.name as permission_name
      FROM auth.role_permissions rp
      JOIN auth.roles r ON rp.role_id = r.id
      JOIN auth.permissions p ON rp.permission_id = p.id
      WHERE r.name = 'Admin TU' AND p.name LIKE '%guru%'
    `);
    console.log('Admin TU guru permissions:', rolePermissions.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
})();
