require('dotenv').config();
const { query } = require('./src/config/db');
query("SELECT u.email, r.nama_role FROM shared.users u JOIN shared.user_roles ur ON u.id = ur.user_id JOIN shared.roles r ON ur.role_id = r.id WHERE r.nama_role = 'Wakil Kepala' LIMIT 1").then(res => {
  console.log(res.rows);
  process.exit(0);
});

