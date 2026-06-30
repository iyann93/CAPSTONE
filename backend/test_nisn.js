require('dotenv').config();
const { query } = require('./src/config/db');

async function testNisn() {
  try {
    const res = await query(\
      SELECT u.email, s.nis, s.nisn 
      FROM shared.users u 
      LEFT JOIN academic.orang_tua o ON o.user_id = u.id 
      LEFT JOIN academic.siswa s ON o.siswa_id = s.id 
      LIMIT 10
    \);
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
testNisn();
