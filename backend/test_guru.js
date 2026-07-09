require('dotenv').config();
const db = require('./src/config/db');
async function run() {
  const users = await db.query('SELECT id, role FROM shared.users');
  console.log('Users:', users.rows);
  const gurus = await db.query('SELECT id, user_id FROM academic.guru');
  console.log('Gurus:', gurus.rows);
  process.exit(0);
}
run();
