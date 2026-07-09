require('dotenv').config();
const db = require('./src/config/db');
db.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'academic' AND table_name = 'tahun_ajaran'")
  .then(res => console.log(res.rows.map(r => r.column_name)))
  .catch(console.error)
  .finally(() => process.exit());
