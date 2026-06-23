'use strict';
require('dotenv').config();
const { pool } = require('./src/config/db');
const { randomUUID } = require('crypto');
const bcrypt = require('bcrypt');

async function seedOrangTua() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('🌱 Seeding Orang Tua dummy user...');

    // 1. Get role ID for 'Orang Tua'
    const rolesRes = await client.query("SELECT id FROM shared.roles WHERE nama_role = 'Orang Tua' LIMIT 1");
    if (rolesRes.rows.length === 0) {
      throw new Error("Role 'Orang Tua' not found in shared.roles");
    }
    const roleId = rolesRes.rows[0].id;

    // Check if the user already exists
    const userRes = await client.query("SELECT id FROM shared.users WHERE email = 'orangtua@siakad.id' LIMIT 1");
    let uid;
    
    if (userRes.rows.length > 0) {
      console.log('   👤 User orangtua@siakad.id already exists. Updating password and active state...');
      uid = userRes.rows[0].id;
      const hash = await bcrypt.hash('password123', 10);
      await client.query(`
        UPDATE shared.users 
        SET password_hash = $1, is_active = true 
        WHERE id = $2
      `, [hash, uid]);
    } else {
      console.log('   👤 Creating new active parent user...');
      uid = randomUUID();
      const hash = await bcrypt.hash('password123', 10);
      await client.query(`
        INSERT INTO shared.users (id, nama, email, password_hash, is_active)
        VALUES ($1, $2, $3, $4, true)
      `, [uid, 'Bapak Ahmad Fauzi', 'orangtua@siakad.id', hash]);

      await client.query(`
        INSERT INTO shared.user_roles (user_id, role_id)
        VALUES ($1, $2)
      `, [uid, roleId]);
    }

    await client.query('COMMIT');
    console.log('✅ Orang Tua dummy user seeded successfully! Email: orangtua@siakad.id, Password: password123');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', e);
  } finally {
    client.release();
    pool.end();
  }
}

seedOrangTua().catch(console.error);
