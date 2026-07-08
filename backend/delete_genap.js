require('dotenv').config();
const db = require('./src/config/db');
db.query("DELETE FROM academic.semester WHERE id = '00000002-0000-0000-0000-000000000001'")
  .then(() => console.log('Deleted Semester Genap'))
  .catch(console.error)
  .finally(() => process.exit());
