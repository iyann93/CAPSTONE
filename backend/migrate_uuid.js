'use strict';
require('dotenv').config();
const { pool } = require('./src/config/db');
const { randomUUID } = require('crypto');

/**
 * Script: Migrate hardcoded sequential UUIDs → random UUIDs
 * 
 * Strategy:
 *  1. Temporarily set all FK constraints to DEFERRABLE
 *  2. For each role: generate new UUID, update roles + all FK refs
 *  3. For each user: generate new UUID, update users + all FK refs
 *  4. All inside one transaction
 */

async function migrateUUIDs() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── Step 1: Disable FK triggers temporarily ────────────────────────────────
    await client.query('SET session_replication_role = replica');

    // ── Step 2: Migrate ROLES ──────────────────────────────────────────────────
    console.log('\n🎭 Migrating role UUIDs...');
    const rolesRes = await client.query('SELECT id, nama_role FROM shared.roles ORDER BY id');
    const roleMap = {}; // old_id → new_id

    for (const role of rolesRes.rows) {
      const newId = randomUUID();
      roleMap[role.id] = newId;
      console.log(`  ${role.nama_role.padEnd(20)} : ${role.id} → ${newId}`);
    }

    // Update FK references to roles.id
    for (const [oldId, newId] of Object.entries(roleMap)) {
      await client.query(
        'UPDATE shared.role_permissions SET role_id = $1 WHERE role_id = $2',
        [newId, oldId]
      );
      await client.query(
        'UPDATE shared.user_roles SET role_id = $1 WHERE role_id = $2',
        [newId, oldId]
      );
      await client.query(
        'UPDATE shared.roles SET id = $1 WHERE id = $2',
        [newId, oldId]
      );
    }

    // ── Step 3: Migrate USERS ──────────────────────────────────────────────────
    console.log('\n👤 Migrating user UUIDs...');
    const usersRes = await client.query('SELECT id, email, nama FROM shared.users ORDER BY id');
    const userMap = {}; // old_id → new_id

    for (const user of usersRes.rows) {
      const newId = randomUUID();
      userMap[user.id] = newId;
      console.log(`  ${user.email.padEnd(30)} : ${user.id} → ${newId}`);
    }

    // Update ALL FK references to users.id
    const userFkRefs = [
      // [schema.table, column]
      ['shared.user_roles',            'user_id'],
      ['shared.audit_log',             'user_id'],
      ['shared.notifikasi',            'user_id'],
      ['shared.password_reset_tokens', 'user_id'],
      ['shared.pengumuman',            'dibuat_oleh'],
      ['shared.refresh_tokens',        'user_id'],
      ['academic.absensi',             'dicatat_oleh'],
      ['academic.guru',                'user_id'],
      ['academic.karyawan',            'user_id'],
      ['academic.kelulusan',           'divalidasi_oleh'],
      ['academic.orang_tua',           'user_id'],
      ['academic.rapor',               'generated_by'],
      ['academic.rapor',               'published_by'],
      ['academic.siswa',               'user_id'],
      ['finance.bukti_pembayaran',     'dicetak_oleh'],
      ['finance.laporan_keuangan',     'dibuat_oleh'],
      ['finance.pengeluaran',          'dibuat_oleh'],
      ['finance.pengeluaran',          'disetujui_oleh'],
      ['finance.rekening_user',        'user_id'],
      ['finance.slip_gaji',            'user_id'],
      ['finance.tagihan_spp',          'updated_by'],
      ['finance.transaksi_pembayaran', 'dicatat_oleh'],
    ];

    for (const [oldId, newId] of Object.entries(userMap)) {
      // Update all FK references first
      for (const [table, col] of userFkRefs) {
        await client.query(
          `UPDATE ${table} SET ${col} = $1 WHERE ${col} = $2`,
          [newId, oldId]
        );
      }
      // Then update primary key
      await client.query(
        'UPDATE shared.users SET id = $1 WHERE id = $2',
        [newId, oldId]
      );
    }

    // ── Step 4: Re-enable FK checks ────────────────────────────────────────────
    await client.query('SET session_replication_role = DEFAULT');

    await client.query('COMMIT');

    // ── Summary ────────────────────────────────────────────────────────────────
    console.log('\n✅ Migration selesai!\n');
    console.log('=== ROLE UUID MAPPING ===');
    for (const [old, newId] of Object.entries(roleMap)) {
      console.log(`  ${old} → ${newId}`);
    }
    console.log('\n=== USER UUID MAPPING ===');
    for (const [old, newId] of Object.entries(userMap)) {
      console.log(`  ${old} → ${newId}`);
    }

    // Verify the result
    console.log('\n=== VERIFIKASI HASIL ===');
    const verifyRoles = await client.query('SELECT id, nama_role FROM shared.roles ORDER BY nama_role');
    console.log('Roles:');
    verifyRoles.rows.forEach(r => console.log(`  [${r.id}] ${r.nama_role}`));

    const verifyUsers = await client.query('SELECT id, email, nama FROM shared.users ORDER BY email');
    console.log('\nUsers:');
    verifyUsers.rows.forEach(u => console.log(`  [${u.id}] ${u.email} (${u.nama})`));

  } catch (err) {
    await client.query('ROLLBACK');
    await client.query('SET session_replication_role = DEFAULT').catch(() => {});
    console.error('\n❌ GAGAL! Rollback dilakukan.');
    console.error(err.message);
    throw err;
  } finally {
    client.release();
    pool.end();
  }
}

migrateUUIDs().catch(() => process.exit(1));
