require('dotenv').config({path: '../.env'});
const { pool } = require('./src/config/db');

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS shared.system_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Table system_settings created');

    await pool.query(`
      ALTER TABLE shared.users 
      ADD COLUMN IF NOT EXISTS failed_attempts INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP;
    `);
    console.log('Columns added to users');

    await pool.query(`
      INSERT INTO shared.system_settings (key, value) VALUES 
      ('maintenance_mode', 'false'::jsonb), 
      ('block_after_fail', 'true'::jsonb), 
      ('session_timeout', '"15 Menit"'::jsonb), 
      ('two_fa', 'false'::jsonb), 
      ('multi_device', 'false'::jsonb) 
      ON CONFLICT (key) DO NOTHING;
    `);
    console.log('Default settings inserted');
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

run();
