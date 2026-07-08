require('dotenv').config();
const { query } = require('./src/config/db');
query("SELECT r.nama_role FROM shared.roles r JOIN shared.role_permissions rp ON r.id = rp.role_id JOIN shared.permissions p ON p.id = rp.permission_id WHERE p.modul = 'jadwal_pelajaran'").then(res => console.log(res.rows)).catch(console.error).finally(() => process.exit());
