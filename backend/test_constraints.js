require('dotenv').config();
const db = require('./src/config/db');
db.query("SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'academic.semester'::regclass;")
  .then(res => console.log(res.rows))
  .catch(console.error)
  .finally(() => process.exit());
