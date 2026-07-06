require('dotenv').config();
const db = require('./src/config/db');

async function fix() {
  try {
    await db.query(`ALTER TABLE academic.absensi DROP CONSTRAINT absensi_status_check;`);
    await db.query(`ALTER TABLE academic.absensi ADD CONSTRAINT absensi_status_check CHECK (status IN ('Hadir', 'Izin', 'Sakit', 'Alpha'));`);
    console.log("Constraint updated");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
fix();
