const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://postgres.ddquzxpbczeagfezjkzq:2300016025fernanda@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres' });
pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'").then(res => { console.log(res.rows); pool.end(); }).catch(console.error);
