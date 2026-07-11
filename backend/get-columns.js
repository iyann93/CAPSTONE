const { Client } = require('pg');
const client = new Client({
  user: 'postgres.ddquzxpbczeagfezjkzq',
  password: '2300016025fernanda',
  host: 'aws-1-ap-southeast-2.pooler.supabase.com',
  database: 'postgres',
  port: 5432
});

client.connect().then(() => client.query("SELECT * FROM shared.permissions")).then(res => console.table(res.rows)).catch(console.error).finally(() => client.end());
