require('dotenv').config();
const { pool } = require('./src/config/db');

async function check() {
  try {
    const res = await pool.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog') 
      ORDER BY table_schema, table_name
    `);
    
    const schemaMap = {};
    for (const row of res.rows) {
      if (!schemaMap[row.table_schema]) {
        schemaMap[row.table_schema] = [];
      }
      schemaMap[row.table_schema].push(row.table_name);
    }
    console.log(JSON.stringify(schemaMap, null, 2));
    
  } catch(e) {
    console.error(e.message);
  } finally {
    pool.end();
  }
}
check();
