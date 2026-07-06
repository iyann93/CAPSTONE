require('dotenv').config();
const db = require('./src/config/db');
db.query("SELECT pg_get_constraintdef(c.oid) FROM pg_constraint c JOIN pg_class t ON c.conrelid = t.oid WHERE t.relname = 'absensi' AND c.conname = 'absensi_status_check'")
  .then(r => console.log(r.rows))
  .catch(console.error)
  .finally(() => process.exit(0));
