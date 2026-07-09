const { Client } = require('pg');
const client = new Client({
  user: 'postgres.ddquzxpbczeagfezjkzq',
  password: '2300016025fernanda',
  host: 'aws-1-ap-southeast-2.pooler.supabase.com',
  database: 'postgres',
  port: 5432
});
client.connect()
  .then(() => client.query("SELECT id, nama, tahun_ajaran_id, is_aktif FROM academic.semester WHERE is_aktif = true"))
  .then(res => console.log(res.rows))
  .catch(console.error)
  .finally(() => client.end());
