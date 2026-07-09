require('dotenv').config();
const { query } = require('./src/config/db');

const sql = `
  SELECT u.id, u.nama as name, u.email,
         STRING_AGG(r.nama_role, ', ') as role,
         j.nama as nama_jabatan
  FROM shared.users u
  LEFT JOIN shared.user_roles ur ON u.id = ur.user_id
  LEFT JOIN shared.roles r ON ur.role_id = r.id
  LEFT JOIN shared.jabatan j ON u.jabatan_id = j.id
  WHERE r.nama_role IS NULL OR r.nama_role NOT IN ('Siswa', 'Orang Tua')
  GROUP BY u.id, j.nama
  ORDER BY u.nama ASC
`;

query(sql)
  .then(res => {
    console.log("Success! Rows:", res.rows.length);
    process.exit(0);
  })
  .catch(err => {
    console.error("SQL Error:", err.message);
    process.exit(1);
  });
