require('dotenv').config();
const { query } = require('./src/config/db');
async function test(){
  try {
    // List all users
    const r = await query(`
      SELECT u.email, u.nama, r.nama_role as role
      FROM shared.users u
      LEFT JOIN shared.user_roles ur ON u.id = ur.user_id
      LEFT JOIN shared.roles r ON ur.role_id = r.id
    `);
    console.log('Users in DB:');
    r.rows.forEach(u => console.log(' -', u.email, '|', u.nama, '| role:', u.role));
    process.exit(0);
  } catch(err) {
    console.log('DB error:', err.message);
    process.exit(1);
  }
}
test();
