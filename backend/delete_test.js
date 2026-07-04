require('dotenv').config();
const { query } = require('./src/config/db');

(async () => {
  try {
    await query(`DELETE FROM academic.guru WHERE nip = '123'`);
    console.log('Deleted test data');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
})();
