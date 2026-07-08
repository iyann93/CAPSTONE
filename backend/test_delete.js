require('dotenv').config();
const db = require('./src/config/db');
db.query("DELETE FROM academic.semester WHERE id = 'ce6e3c35-b2e6-4b51-bb35-5b52ebb0bd65'")
  .then(() => console.log('Deleted'))
  .catch(console.error)
  .finally(() => process.exit());
