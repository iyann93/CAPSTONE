const { Client } = require('pg');
const client = new Client({
  user: 'postgres.ddquzxpbczeagfezjkzq',
  password: '2300016025fernanda',
  host: 'aws-1-ap-southeast-2.pooler.supabase.com',
  database: 'postgres',
  port: 5432
});

client.connect().then(() => client.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'shared' AND table_name = 'users'")).then(res => console.log(res.rows)).catch(console.error).finally(() => client.end());
