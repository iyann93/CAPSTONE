require('dotenv').config();
const { query } = require('./src/config/db');
async function test(){
  try {
    // List all users
    const r = await query("SELECT email, full_name FROM shared.users LIMIT 10");
    console.log('Users in DB:');
    r.rows.forEach(u => console.log(' -', u.email, '|', u.full_name));
    process.exit(0);
  } catch(err) {
    console.log('DB error:', err.message);
    process.exit(1);
  }
}
test();
