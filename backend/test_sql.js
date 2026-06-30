require('dotenv').config();
const { query } = require('./src/config/db');

async function testSQL() {
  try {
    const sql = \
      SELECT u.email
      FROM shared.users u
      LEFT JOIN academic.orang_tua o ON o.user_id = u.id
      LEFT JOIN academic.siswa s ON o.siswa_id = s.id
      WHERE u.email = \
         OR split_part(u.email, '@', 1) = \
         OR s.nisn = \
         OR s.nis = \
      LIMIT 1
    \;
    const res1 = await query(sql, ['budi.admin']);
    console.log('budi.admin:', res1.rows);
    
    const res2 = await query(sql, ['budi.admin@siakad.id']);
    console.log('budi.admin@siakad.id:', res2.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
testSQL();
