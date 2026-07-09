require('dotenv').config();
const bcrypt = require('bcrypt');
const { query } = require('./src/config/db');

async function testPasswords() {
  try {
    const res = await query('SELECT email, password_hash FROM shared.users LIMIT 5');
    const users = res.rows;
    for (const user of users) {
      console.log('Testing passwords for ' + user.email);
      const passwordsToTest = ['password', 'password123', '123456', '12345678', 'admin123', 'admin', 'rahasia'];
      for (const p of passwordsToTest) {
        const isMatch = await bcrypt.compare(p, user.password_hash);
        if (isMatch) {
          console.log('  --> Password is: ' + p);
        }
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

testPasswords();
