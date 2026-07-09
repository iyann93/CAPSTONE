'use strict';
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD),
  port: parseInt(process.env.DB_PORT, 10),
});

async function main() {
  const BENDAHARA_ROLE_ID = '2568bd6c-e517-487b-b044-bab3ca89dbda';
  const PERM_MANAGE_ID   = '30000000-0000-0000-0000-000000000021';
  const PERM_READ_ID     = '30000000-0000-0000-0000-000000000022';

  // Cek apakah bendahara punya permission beasiswa.manage dan beasiswa.read
  const r1 = await pool.query(
    `SELECT rp.*, p.modul, p.aksi FROM shared.role_permissions rp
     JOIN shared.permissions p ON p.id = rp.permission_id
     WHERE rp.role_id = $1 AND p.modul = 'beasiswa'`,
    [BENDAHARA_ROLE_ID]
  );
  console.log('Bendahara beasiswa permissions:', r1.rows);

  if (r1.rows.length === 0) {
    console.log('\n⚠️  Bendahara TIDAK punya permission beasiswa! Akan ditambahkan...');

    await pool.query(
      `INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [BENDAHARA_ROLE_ID, PERM_MANAGE_ID]
    );
    await pool.query(
      `INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [BENDAHARA_ROLE_ID, PERM_READ_ID]
    );
    console.log('✅ Permission beasiswa.manage dan beasiswa.read berhasil ditambahkan ke Bendahara!');
  } else {
    // Cek mana yang kurang
    const hasMng = r1.rows.some(r => r.aksi === 'manage');
    const hasRead = r1.rows.some(r => r.aksi === 'read');
    console.log(`  beasiswa.manage: ${hasMng ? '✅' : '❌'}`);
    console.log(`  beasiswa.read:   ${hasRead ? '✅' : '❌'}`);

    if (!hasMng) {
      await pool.query(`INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [BENDAHARA_ROLE_ID, PERM_MANAGE_ID]);
      console.log('✅ beasiswa.manage ditambahkan');
    }
    if (!hasRead) {
      await pool.query(`INSERT INTO shared.role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [BENDAHARA_ROLE_ID, PERM_READ_ID]);
      console.log('✅ beasiswa.read ditambahkan');
    }
    if (hasMng && hasRead) {
      console.log('\n✅ Bendahara sudah punya semua permission beasiswa.');
    }
  }

  // Verifikasi akhir: cek user bendahara di DB
  const r2 = await pool.query(
    `SELECT u.id, u.email, r.nama_role
     FROM shared.users u
     JOIN shared.user_roles ur ON ur.user_id = u.id
     JOIN shared.roles r ON r.id = ur.role_id
     WHERE r.nama_role ILIKE '%bendahara%'
     LIMIT 5`
  );
  console.log('\nBendahara users:', r2.rows);

  // Cek nominal format: frontend kirim nominal sebagai string "250.000" atau angka?
  // Validator mengharuskan isNumeric(), jadi harus number
  console.log('\n📋 CATATAN:');
  console.log('Validator beasiswa mengharuskan siswaId = UUID, nominal = number (bukan string)');
  console.log('Frontend harus kirim: siswaId (UUID), nominal (number bersih)');

  await pool.end();
}

main().catch(e => { console.error(e.message); pool.end(); });
