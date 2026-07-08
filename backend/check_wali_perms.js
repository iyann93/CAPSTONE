require('dotenv').config();
const { query } = require('./src/config/db');

async function check() {
  try {
    const res = await query("SELECT p.modul, p.aksi FROM shared.role_permissions rp JOIN shared.permissions p ON rp.permission_id = p.id JOIN shared.roles r ON rp.role_id = r.id WHERE r.nama_role = 'Wali Kelas'");
    console.log(res.rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
