'use strict';
require('dotenv').config();
const { pool } = require('./src/config/db');
const { randomUUID } = require('crypto');
const bcrypt = require('bcrypt');

async function seedWakilKepala() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const roleRes = await client.query("SELECT id FROM shared.roles WHERE nama_role = 'Wakil Kepala' LIMIT 1");
    if (roleRes.rows.length === 0) throw new Error("Role 'Wakil Kepala' tidak ditemukan.");
    const roleId = roleRes.rows[0].id;

    const exists = await client.query("SELECT id FROM shared.users WHERE email = 'wakilkepala@siakad.id' LIMIT 1");
    const hash = await bcrypt.hash('password123', 10);

    if (exists.rows.length > 0) {
      await client.query("UPDATE shared.users SET password_hash = $1, is_active = true WHERE email = 'wakilkepala@siakad.id'", [hash]);
      console.log('✅ User wakilkepala@siakad.id diupdate.');
    } else {
      const uid = randomUUID();
      await client.query('INSERT INTO shared.users (id, nama, email, password_hash, is_active) VALUES ($1,$2,$3,$4,true)',
        [uid, 'Drs. Hendra Kurniawan', 'wakilkepala@siakad.id', hash]);
      await client.query('INSERT INTO shared.user_roles (user_id, role_id) VALUES ($1,$2)', [uid, roleId]);
      console.log('✅ User wakilkepala@siakad.id berhasil dibuat. Password: password123');
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', e.message);
  } finally {
    client.release();
    pool.end();
  }
}
seedWakilKepala().catch(console.error);
