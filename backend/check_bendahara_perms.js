const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD),
  port: parseInt(process.env.DB_PORT, 10),
});
pool.query("SELECT id, email FROM shared.users WHERE email ILIKE '%bendahara%'").then(async r => {
  console.log('Bendahara Users:', r.rows);
  if (r.rows.length > 0) {
    const userId = r.rows[0].id;
    const sql = `
        SELECT DISTINCT (p.modul || '.' || p.aksi) AS code
        FROM shared.permissions p
        INNER JOIN shared.role_permissions rp ON rp.permission_id = p.id
        INNER JOIN shared.user_roles ur ON ur.role_id = rp.role_id
        WHERE ur.user_id = $1
      `;
    const res = await pool.query(sql, [userId]);
    console.log('Permissions:', res.rows.map(x => x.code));
  }
  pool.end();
}).catch(e => {
  console.error(e);
  pool.end();
});
