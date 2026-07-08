const { query } = require('./src/config/db');

async function main() {
  const res = await query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'finance'");
  console.log(res.rows);
  process.exit(0);
}

main();
