const { query } = require('./src/config/db');
async function test() {
  const r = await query("SELECT u.email, r.name FROM shared.users u JOIN shared.user_roles ur ON u.id = ur.user_id JOIN shared.roles r ON ur.role_id = r.id WHERE r.name = 'Admin TU'");
  console.log(r.rows);
  process.exit(0);
}
test();
