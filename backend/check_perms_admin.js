require('dotenv').config();
const { query } = require('./src/config/db');
query("SELECT r.nama_role, (p.modul || '.' || p.aksi) as perm FROM shared.roles r JOIN shared.role_permissions rp ON r.id = rp.role_id JOIN shared.permissions p ON rp.permission_id = p.id WHERE r.nama_role = 'Admin TU'")
.then(res => {
  console.log(res.rows.filter(r => r.perm.includes('jadwal')));
  process.exit(0);
});
