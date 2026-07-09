require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool();

async function test() {
  try {
    const siswaRes = await pool.query('SELECT id, nis FROM academic.siswa LIMIT 1');
    if (siswaRes.rows.length === 0) {
      console.log("No siswa"); return;
    }
    const siswaId = siswaRes.rows[0].id;
    console.log("Siswa ID:", siswaId);

    const jadwalRes = await pool.query('SELECT id FROM academic.jadwal_pelajaran LIMIT 1');
    if (jadwalRes.rows.length === 0) {
      console.log("No jadwal"); return;
    }
    const jadwalId = jadwalRes.rows[0].id;
    console.log("Jadwal ID:", jadwalId);

    const userRes = await pool.query('SELECT id FROM shared.users LIMIT 1');
    const userId = userRes.rows[0].id;

    // Simulate bulkUpsert
    const absensiDataArray = [{
        siswaId,
        jadwalId,
        tanggal: '2026-07-05',
        status: 'Hadir',
        keterangan: ''
    }];

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const item of absensiDataArray) {
        const { siswaId, jadwalId, tanggal, status, keterangan } = item;
        const checkSql = `SELECT id FROM academic.absensi WHERE siswa_id = $1 AND jadwal_id = $2 AND tanggal = $3`;
        const checkRes = await client.query(checkSql, [siswaId, jadwalId, tanggal]);
        
        if (checkRes.rows.length > 0) {
          const id = checkRes.rows[0].id;
          const upSql = `UPDATE academic.absensi SET status = $1, keterangan = $2, dicatat_oleh = $3 WHERE id = $4 RETURNING *`;
          await client.query(upSql, [status, keterangan, userId, id]);
          console.log("Updated!");
        } else {
          const inSql = `INSERT INTO academic.absensi (siswa_id, jadwal_id, tanggal, status, keterangan, dicatat_oleh, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`;
          await client.query(inSql, [siswaId, jadwalId, tanggal, status, keterangan, userId]);
          console.log("Inserted!");
        }
      }
      await client.query('ROLLBACK'); // just test
    } catch(err) {
      console.error("DB Error:", err);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    pool.end();
  }
}
test();
