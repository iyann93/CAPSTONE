const { Client } = require('pg');
const client = new Client({
  user: 'postgres.ddquzxpbczeagfezjkzq',
  password: '2300016025fernanda',
  host: 'aws-1-ap-southeast-2.pooler.supabase.com',
  database: 'postgres',
  port: 5432
});
client.connect()
  .then(() => client.query("SELECT data_type FROM information_schema.columns WHERE table_schema = 'academic' AND table_name = 'semester' AND column_name = 'tahun_ajaran_id'"))
  .then(res => console.log(res.rows))
  .catch(console.error)
  .finally(() => client.end());
