const { pool } = require('../config/db');

class OrangTuaRepository {
  async getAll() {
    const query = `
      SELECT 
        ot.id,
        ot.user_id,
        ot.siswa_id,
        ot.nama_ayah,
        ot.nama_ibu,
        ot.no_telepon,
        ot.pekerjaan_wali,
        ot.hubungan,
        s.nama_lengkap as nama_siswa,
        k.nama_kelas as kelas,
        s.alamat
      FROM academic.orang_tua ot
      LEFT JOIN academic.siswa s ON ot.siswa_id = s.id
      LEFT JOIN academic.kelas k ON s.kelas_id = k.id
      ORDER BY ot.nama_ayah ASC;
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  async getById(id) {
    const query = `
      SELECT * FROM academic.orang_tua WHERE id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  async create(data) {
    const { user_id, siswa_id, nama_ayah, nama_ibu, no_telepon, pekerjaan_wali, hubungan } = data;
    const query = `
      INSERT INTO academic.orang_tua (user_id, siswa_id, nama_ayah, nama_ibu, no_telepon, pekerjaan_wali, hubungan)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      user_id || null, 
      siswa_id, 
      nama_ayah || '-', 
      nama_ibu || '-', 
      no_telepon || '-', 
      pekerjaan_wali || null, 
      hubungan || 'ayah'
    ]);
    return rows[0];
  }

  async update(id, data) {
    const { siswa_id, nama_ayah, nama_ibu, no_telepon, pekerjaan_wali, hubungan } = data;
    const query = `
      UPDATE academic.orang_tua
      SET 
        siswa_id = COALESCE($1, siswa_id),
        nama_ayah = COALESCE($2, nama_ayah),
        nama_ibu = COALESCE($3, nama_ibu),
        no_telepon = COALESCE($4, no_telepon),
        pekerjaan_wali = COALESCE($5, pekerjaan_wali),
        hubungan = COALESCE($6, hubungan)
      WHERE id = $7
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      siswa_id, 
      nama_ayah, 
      nama_ibu, 
      no_telepon, 
      pekerjaan_wali, 
      hubungan, 
      id
    ]);
    return rows[0];
  }

  async delete(id) {
    const query = `DELETE FROM academic.orang_tua WHERE id = $1 RETURNING id;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = new OrangTuaRepository();
