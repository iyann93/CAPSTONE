require('dotenv').config();
const db = require('./src/config/db');
db.query(`SELECT u.id, u.nama, u.email, r.nama_role 
          FROM shared.users u 
          JOIN shared.user_roles ur ON u.id = ur.user_id 
          JOIN shared.roles r ON ur.role_id = r.id 
          WHERE r.nama_role = 'Orang Tua'`)
  .then(res => { console.log('Orang Tua users:', res.rows); process.exit(0); })
  .catch(err => { console.error(err.message); process.exit(1); });
