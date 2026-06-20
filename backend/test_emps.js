const { Pool } = require('pg');
require('dotenv').config();
const p = new Pool({ database: process.env.DB_DATABASE, user: process.env.DB_USER, password: process.env.DB_PASSWORD, host: process.env.DB_HOST, port: process.env.DB_PORT });
p.query("SELECT u.id, u.nama as name, u.email, STRING_AGG(r.nama_role, ', ') as role, j.nama as nama_jabatan FROM shared.users u LEFT JOIN shared.user_roles ur ON u.id = ur.user_id LEFT JOIN shared.roles r ON ur.role_id = r.id LEFT JOIN shared.jabatan j ON u.jabatan_id = j.id WHERE r.nama_role NOT IN ('Siswa', 'Orang Tua') GROUP BY u.id, j.nama ORDER BY u.nama ASC")
  .then(res => { console.table(res.rows); p.end(); })
  .catch(e => { console.error('ERROR', e); p.end(); });
