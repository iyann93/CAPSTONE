const { Pool } = require('pg');
require('dotenv').config();
const p = new Pool({ database: process.env.DB_DATABASE, user: process.env.DB_USER, password: process.env.DB_PASSWORD, host: process.env.DB_HOST, port: process.env.DB_PORT });
p.query(`SELECT p.modul, p.aksi, p.nama_permission FROM shared.permissions p INNER JOIN shared.role_permissions rp ON rp.permission_id = p.id INNER JOIN shared.roles r ON r.id = rp.role_id WHERE r.nama_role = 'Bendahara'`).then(res => { console.table(res.rows); p.end(); });
