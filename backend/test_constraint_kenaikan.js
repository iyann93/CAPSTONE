require('dotenv').config();
const db = require('./src/config/db');
db.query("SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'kenaikan_kelas_status_check';")
  .then(res => console.log(res.rows))
  .catch(console.error)
  .finally(() => process.exit());
