require('dotenv').config();
const db = require('./src/config/db');
Promise.all([
  db.query('SELECT * FROM academic.mata_pelajaran LIMIT 1'),
  db.query('SELECT * FROM academic.semester LIMIT 1')
]).then(([m, s]) => {
  console.log('Mapel ID:', m.rows[0]?.id);
  console.log('Semester ID:', s.rows[0]?.id);
}).catch(console.error).finally(()=>process.exit(0));
