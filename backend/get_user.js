const { query } = require('./src/config/db');
query("SELECT u.id, ur.role_id, (p.modul || '.' || p.aksi) as code FROM shared.users u JOIN shared.user_roles ur ON u.id = ur.user_id JOIN shared.role_permissions rp ON ur.role_id = rp.role_id JOIN shared.permissions p ON rp.permission_id = p.id WHERE (p.modul || '.' || p.aksi) = 'jadwal_pelajaran.create' LIMIT 1")
.then(res => {
  console.log(res.rows[0]);
  process.exit(0);
});
