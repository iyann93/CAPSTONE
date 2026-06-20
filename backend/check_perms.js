const { Pool } = require('pg');
require('dotenv').config();
const p = new Pool({
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});

p.query(`
  SELECT p.nama_permission 
  FROM shared.role_permissions rp 
  JOIN shared.permissions p ON rp.permission_id = p.id 
  JOIN shared.roles r ON rp.role_id = r.id 
  WHERE r.nama_role = 'Bendahara'
`)
.then(r => console.table(r.rows))
.catch(console.error)
.finally(()=>p.end());
