const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function run() {
  try {
    const res = await pool.query("SELECT id FROM shared.roles WHERE nama_role = 'Bendahara'");
    if (res.rows.length === 0) {
      console.log('Role Bendahara not found');
      return;
    }
    const roleId = res.rows[0].id;
    
    const filePath = path.join(__dirname, 'data', 'role_permissions.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!data[roleId]) {
      data[roleId] = {};
    }
    
    data[roleId]["Tagihan SPP"] = { lihat: true, buat: true, ubah: true, hapus: true };
    data[roleId]["Pengaturan SPP"] = { lihat: true, buat: true, ubah: true, hapus: true };
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('Fixed permissions for Bendahara');
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

run();
