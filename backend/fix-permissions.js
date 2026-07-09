const { Client } = require('pg');
const client = new Client({
  user: 'postgres.ddquzxpbczeagfezjkzq',
  password: '2300016025fernanda',
  host: 'aws-1-ap-southeast-2.pooler.supabase.com',
  database: 'postgres',
  port: 5432
});

async function run() {
  await client.connect();
  const res = await client.query(`
    SELECT r.id AS role_id, p.id AS permission_id, p.modul, p.aksi
    FROM shared.roles r 
    CROSS JOIN shared.permissions p 
    WHERE r.nama_role = 'Wakil Kepala' 
      AND p.modul = 'jadwal'
  `);
  
  for (let r of res.rows) {
    console.log(`Granting ${r.modul}.${r.aksi} to Wakil Kepala (role: ${r.role_id})`);
    await client.query(
      'INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [r.role_id, r.permission_id]
    );
  }
  console.log('Done!');
  await client.end();
}
run();
