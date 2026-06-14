const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD),
  port: parseInt(process.env.DB_PORT, 10),
});
const sql = `
  SELECT DISTINCT (p.modul || '.' || p.aksi) AS code
  FROM shared.permissions p
  INNER JOIN shared.role_permissions rp ON rp.permission_id = p.id
  INNER JOIN shared.user_roles ur ON ur.role_id = rp.role_id
  WHERE ur.user_id = $1
`;
pool.query(sql, ['a0000000-0000-0000-0000-000000000006']).then(r => {
  console.log('Perms:', r.rows.map(x=>x.code));
  pool.end();
}).catch(e => {
  console.error(e);
  pool.end();
});
