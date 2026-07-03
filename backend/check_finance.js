require('dotenv').config();
const db = require('./src/config/db');
db.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'finance'")
  .then(res => { console.log(res.rows); process.exit(0); })
  .catch(err => { console.error(err.message); process.exit(1); });
