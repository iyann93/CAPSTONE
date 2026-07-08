require('dotenv').config();
const { query } = require('./src/config/db');
query("SELECT * FROM shared.permissions").then(res => {
  console.log(res.rows.map(r => r.modul + '.' + r.aksi));
  process.exit(0);
});
