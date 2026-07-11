const { pool } = require('./src/config/db');
pool.query("SELECT * FROM shared.users WHERE role='guru' OR role='Guru' LIMIT 1")
  .then(res => console.log(res.rows[0]))
  .catch(console.error)
  .finally(() => process.exit(0));
