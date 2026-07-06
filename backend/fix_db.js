require('dotenv').config();
const { query } = require('./src/config/db');

(async () => {
  try {
    await query(`ALTER TABLE academic.guru ALTER COLUMN user_id DROP NOT NULL;`);
    console.log('Successfully dropped NOT NULL constraint on user_id');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
})();
