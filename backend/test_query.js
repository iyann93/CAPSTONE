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
  SELECT u.id, r.role_name 
  FROM shared.users u
  JOIN shared.user_roles ur ON u.id = ur.user_id
  JOIN shared.roles r ON ur.role_id = r.id
  LIMIT 5
`)
  .then(r => console.log(r.rows))
  .catch(console.error)
  .finally(()=>p.end());
