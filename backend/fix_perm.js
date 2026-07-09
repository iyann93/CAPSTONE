require('dotenv').config();
const db = require('./src/config/db');

async function run() {
  try {
    const r = await db.query("SELECT id FROM shared.roles WHERE nama_role = 'Bendahara'");
    const p = await db.query("SELECT id FROM shared.permissions WHERE modul='gaji' AND aksi='approve'");
    
    if (r.rows.length > 0 && p.rows.length > 0) {
      await db.query(
        "INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2)",
        [r.rows[0].id, p.rows[0].id]
      );
      console.log('Permission successfully inserted!');
    } else {
      console.log('Role or permission not found.');
    }
  } catch (err) {
    if (err.code === '23505') {
      console.log('Permission already exists.');
    } else {
      console.error(err);
    }
  } finally {
    process.exit(0);
  }
}
run();
