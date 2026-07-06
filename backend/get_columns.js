require('dotenv').config();
const { query } = require('./src/config/db');

(async () => {
  try {
    const rolesRes = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'shared' AND table_name = 'roles'
    `);
    console.log('shared.roles columns:', rolesRes.rows);
    
    const permRes = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'shared' AND table_name = 'permissions'
    `);
    console.log('shared.permissions columns:', permRes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
})();
