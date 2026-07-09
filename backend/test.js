const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres.ddquzxpbczeagfezjkzq:2300016025fernanda@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres' });
pool.query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema IN ('public', 'shared', 'academic', 'finance', 'hr')").then(res => {
  console.log(res.rows);
  process.exit(0);
}).catch(console.error);
