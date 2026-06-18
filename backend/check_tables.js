const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres.ddquzxpbczeagfezjkzq:2300016025fernanda@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres' });
client.connect().then(() => {
  return client.query("SELECT table_name FROM information_schema.tables WHERE table_schema IN ('public', 'finance', 'system')");
}).then(res => {
  console.log(res.rows.map(r => r.table_name));
  client.end();
}).catch(err => {
  console.error(err);
  client.end();
});
