require('dotenv').config();
const db = require('./src/config/db');
db.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='academic' AND table_name='nilai'")
  .then(r => console.log(r.rows))
  .catch(console.error)
  .finally(() => process.exit(0));
