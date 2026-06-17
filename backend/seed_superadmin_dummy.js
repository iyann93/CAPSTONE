'use strict';
require('dotenv').config();
const { pool } = require('./src/config/db');
const { randomUUID } = require('crypto');

async function seedSuperAdminData() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('🌱 Seeding SuperAdmin dummy data...');

    // 1. Get role IDs
    const rolesRes = await client.query('SELECT id, nama_role FROM shared.roles');
    const roles = {};
    for (const r of rolesRes.rows) roles[r.nama_role] = r.id;

    // 2. Create Dummy Pending / Non-aktif Users
    console.log('   👤 Creating dummy inactive users...');
    const dummyUsers = [
      { nama: 'Bambang Supriyadi', email: 'bambang.sup@gmail.com', role: 'Orang Tua' },
      { nama: 'Citra Kirana', email: 'citra.k@siswa.sch.id', role: 'Siswa' },
      { nama: 'Ahmad Ridwan', email: 'ahmad.ridwan@sch.id', role: 'Wakil Kepala' },
      { nama: 'Dedi Kurniawan', email: 'dedi.k@guru.sch.id', role: 'Guru Mapel' }
    ];

    let userIds = [];
    for (const u of dummyUsers) {
      const uid = randomUUID();
      userIds.push(uid);
      await client.query(`
        INSERT INTO shared.users (id, nama, email, password_hash, is_active)
        VALUES ($1, $2, $3, 'pbkdf2_sha256$260000$dummy', false)
      `, [uid, u.nama, u.email]);

      if (roles[u.role]) {
        await client.query(`
          INSERT INTO shared.user_roles (user_id, role_id)
          VALUES ($1, $2)
        `, [uid, roles[u.role]]);
      }
    }

    // 3. Create Dummy Audit Logs
    console.log('   📝 Creating dummy audit logs...');
    // Clear existing dummy logs if we rerun this
    await client.query(`DELETE FROM shared.audit_log WHERE detail LIKE '%[DUMMY]%'`);

    // Fetch an active admin user for the logs
    const adminRes = await client.query(`SELECT id FROM shared.users LIMIT 1`);
    const adminId = adminRes.rows[0]?.id || userIds[0];

    const modulList = ['Autentikasi', 'Akademik', 'Keuangan', 'Pengaturan', 'Master Data'];
    const aksiList = ['LOGIN', 'LOGOUT', 'UPDATE', 'CREATE', 'DELETE', 'EXPORT'];
    const logs = [];

    for (let i = 0; i < 50; i++) {
      const modul = modulList[Math.floor(Math.random() * modulList.length)];
      const aksi = aksiList[Math.floor(Math.random() * aksiList.length)];
      const ip = `192.168.1.${Math.floor(Math.random() * 255)}`;
      const detail = `[DUMMY] User ${aksi} data in module ${modul}.`;
      // Generate random dates within the last 7 days
      const daysAgo = Math.floor(Math.random() * 7);
      
      await client.query(`
        INSERT INTO shared.audit_log (user_id, aksi, modul, detail, ip_address, created_at, device)
        VALUES ($1, $2, $3, $4, $5, NOW() - INTERVAL '${daysAgo} days', 'Chrome/Windows')
      `, [adminId, aksi, modul, detail, ip]);
    }

    await client.query('COMMIT');
    console.log('✅ SuperAdmin dummy data seeded successfully!');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', e);
  } finally {
    client.release();
    pool.end();
  }
}

seedSuperAdminData().catch(console.error);
