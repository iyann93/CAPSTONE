'use strict';

const { query, getClient } = require('../config/db');

const SystemRepository = {
  // === AUDIT LOGS ===
  getAuditLogs: async (filters = {}) => {
    let sql = `
      SELECT a.*, u.nama as user_name, u.email as user_email
      FROM shared.audit_log a
      LEFT JOIN shared.users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramIdx = 1;

    if (filters.modul) {
      sql += ` AND a.modul = $${paramIdx++}`;
      params.push(filters.modul);
    }
    
    // Default order by latest
    sql += ` ORDER BY a.created_at DESC LIMIT 100`;

    const res = await query(sql, params);
    return res.rows;
  },

  // === RBAC / ROLES ===
  getAllRoles: async () => {
    const sql = `
      SELECT r.*, COUNT(ur.user_id) as users_count
      FROM shared.roles r
      LEFT JOIN shared.user_roles ur ON r.id = ur.role_id
      GROUP BY r.id
      ORDER BY r.nama_role ASC
    `;
    const res = await query(sql);
    return res.rows;
  },

  getPermissionsForRole: async (roleId) => {
    const sql = `
      SELECT p.id, p.nama_permission, p.modul, p.aksi
      FROM shared.permissions p
      JOIN shared.role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = $1
    `;
    const res = await query(sql, [roleId]);
    return res.rows;
  },

  // === USERS FOR ACTIVATION ===
  getPendingUsers: async () => {
    // is_active = false
    const sql = `
      SELECT u.id, u.nama, u.email, u.created_at, u.is_active, u.last_login_at as "lastLogin",
             STRING_AGG(r.nama_role, ', ') as roles
      FROM shared.users u
      LEFT JOIN shared.user_roles ur ON u.id = ur.user_id
      LEFT JOIN shared.roles r ON ur.role_id = r.id
      WHERE u.is_active = false
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `;
    const res = await query(sql);
    return res.rows;
  },

  updateUserStatus: async (userId, isActive) => {
    const sql = `UPDATE shared.users SET is_active = $1 WHERE id = $2 RETURNING *`;
    const res = await query(sql, [isActive, userId]);
    return res.rows[0];
  },

  // === ALL USERS (CRUD) ===
  getAllUsers: async (filters = {}) => {
    const sql = `
      SELECT u.id, u.nama as name, u.email, u.is_active, u.created_at, u.last_login_at as "lastLogin", u.must_change_password as "mustChangePassword",
             COALESCE(u.email, u.nama) as user,
             STRING_AGG(DISTINCT r.nama_role, ', ') as role,
             j.nama as nama_jabatan,
             ot.siswa_id as linked_siswa_id,
             COALESCE(g.tanggal_lahir, k.tanggal_lahir, s.tanggal_lahir, u.tanggal_lahir) as tanggal_lahir,
             COALESCE(g.jenis_kelamin, k.jenis_kelamin, s.jenis_kelamin, u.jenis_kelamin) as jenis_kelamin,
             COALESCE(g.no_telepon, k.no_telepon, ot.no_telepon, u.no_telepon) as telepon,
             COALESCE(g.alamat, k.alamat, s.alamat, u.alamat_lengkap) as alamat
      FROM shared.users u
      LEFT JOIN shared.user_roles ur ON u.id = ur.user_id
      LEFT JOIN shared.roles r ON ur.role_id = r.id
      LEFT JOIN shared.jabatan j ON u.jabatan_id = j.id
      LEFT JOIN academic.guru g ON g.user_id = u.id
      LEFT JOIN academic.karyawan k ON k.user_id = u.id
      LEFT JOIN academic.siswa s ON s.user_id = u.id
      LEFT JOIN academic.orang_tua ot ON ot.user_id = u.id
      GROUP BY u.id, j.nama, ot.siswa_id, g.tanggal_lahir, k.tanggal_lahir, s.tanggal_lahir, u.tanggal_lahir,
               g.jenis_kelamin, k.jenis_kelamin, s.jenis_kelamin, u.jenis_kelamin,
               g.no_telepon, k.no_telepon, ot.no_telepon, u.no_telepon,
               g.alamat, k.alamat, s.alamat, u.alamat_lengkap
      ORDER BY u.created_at DESC
    `;
    const res = await query(sql);
    return res.rows;
  },

  createUserWithRole: async ({ nama, email, passwordHash, roleId, isActive = true, mustChangePassword = false, tanggalLahir, jenisKelamin, telepon, alamat }) => {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      const insertUser = `
        INSERT INTO shared.users (nama, email, password_hash, is_active, must_change_password, tanggal_lahir, jenis_kelamin, no_telepon, alamat_lengkap, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        RETURNING id
      `;
      const resUser = await client.query(insertUser, [nama, email, passwordHash, isActive, mustChangePassword, tanggalLahir || null, jenisKelamin || null, telepon || null, alamat || null]);
      const newUserId = resUser.rows[0].id;

      if (roleId) {
        const insertRole = `INSERT INTO shared.user_roles (user_id, role_id) VALUES ($1, $2)`;
        await client.query(insertRole, [newUserId, roleId]);
      }

      await client.query('COMMIT');
      return { id: newUserId };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  updateUserWithRole: async (userId, { nama, email, roleId, isActive, mustChangePassword, tanggalLahir, jenisKelamin, telepon, alamat }) => {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      
      // Update tabel master data jika record sudah ada untuk user ini
      // Cek Guru
      const guruRes = await client.query('SELECT id FROM academic.guru WHERE user_id = $1', [userId]);
      if (guruRes.rows.length > 0) {
        await client.query('UPDATE academic.guru SET tanggal_lahir = COALESCE($1, tanggal_lahir), jenis_kelamin = COALESCE($2, jenis_kelamin), no_telepon = COALESCE($3, no_telepon), alamat = COALESCE($4, alamat) WHERE user_id = $5', [tanggalLahir || null, jenisKelamin || null, telepon || null, alamat || null, userId]);
      }
      
      // Cek Karyawan
      const karRes = await client.query('SELECT id FROM academic.karyawan WHERE user_id = $1', [userId]);
      if (karRes.rows.length > 0) {
        await client.query('UPDATE academic.karyawan SET tanggal_lahir = COALESCE($1, tanggal_lahir), jenis_kelamin = COALESCE($2, jenis_kelamin), no_telepon = COALESCE($3, no_telepon), alamat = COALESCE($4, alamat) WHERE user_id = $5', [tanggalLahir || null, jenisKelamin || null, telepon || null, alamat || null, userId]);
      }

      // Cek Siswa
      const sisRes = await client.query('SELECT id FROM academic.siswa WHERE user_id = $1', [userId]);
      if (sisRes.rows.length > 0) {
        await client.query('UPDATE academic.siswa SET tanggal_lahir = COALESCE($1, tanggal_lahir), jenis_kelamin = COALESCE($2, jenis_kelamin), alamat = COALESCE($3, alamat) WHERE user_id = $4', [tanggalLahir || null, jenisKelamin || null, alamat || null, userId]);
      }
      
      // Selalu update ke shared.users sebagai fallback
      const updateUser = `
        UPDATE shared.users 
        SET nama = COALESCE($1, nama),
            email = COALESCE($2, email),
            is_active = COALESCE($3, is_active),
            must_change_password = COALESCE($4, must_change_password),
            tanggal_lahir = COALESCE($5, tanggal_lahir),
            jenis_kelamin = COALESCE($6, jenis_kelamin),
            no_telepon = COALESCE($7, no_telepon),
            alamat_lengkap = COALESCE($8, alamat_lengkap)
        WHERE id = $9
      `;
      await client.query(updateUser, [nama, email, isActive, mustChangePassword, tanggalLahir || null, jenisKelamin || null, telepon || null, alamat || null, userId]);

      if (roleId !== undefined) {
        await client.query(`DELETE FROM shared.user_roles WHERE user_id = $1`, [userId]);
        if (roleId) {
          await client.query(`INSERT INTO shared.user_roles (user_id, role_id) VALUES ($1, $2)`, [userId, roleId]);
        }
      }

      await client.query('COMMIT');
      return { id: userId };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  deleteUser: async (userId) => {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM shared.user_roles WHERE user_id = $1', [userId]);
      await client.query('DELETE FROM shared.users WHERE id = $1', [userId]);
      await client.query('COMMIT');
      return true;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  // Ambil semua siswa untuk dropdown pilih anak orang tua
  getSiswaList: async () => {
    const sql = `
      SELECT s.id, s.nama_lengkap, s.nis, k.nama_kelas,
             ot.user_id as linked_user_id
      FROM academic.siswa s
      LEFT JOIN academic.kelas k ON s.kelas_id = k.id
      LEFT JOIN academic.orang_tua ot ON ot.siswa_id = s.id
      ORDER BY s.nama_lengkap ASC
    `;
    const res = await query(sql);
    return res.rows;
  },

  // Simpan / update relasi orang tua - siswa di academic.orang_tua
  linkOrangTuaSiswa: async (userId, siswaId) => {
    // Cek dulu apakah user ini sudah ada di tabel orang_tua
    const checkRes = await query('SELECT id FROM academic.orang_tua WHERE user_id = $1', [userId]);
    if (checkRes.rows.length > 0) {
      // Update siswa_id saja
      const updateSql = `UPDATE academic.orang_tua SET siswa_id = $1 WHERE user_id = $2 RETURNING *`;
      const res = await query(updateSql, [siswaId, userId]);
      return res.rows[0];
    } else {
      // Insert baru dengan field minimal yang NOT NULL
      const insertSql = `
        INSERT INTO academic.orang_tua (user_id, siswa_id, hubungan, nama_ayah, nama_ibu, no_telepon)
        VALUES ($1, $2, 'ayah', '-', '-', '-')
        RETURNING *
      `;
      const res = await query(insertSql, [userId, siswaId]);
      return res.rows[0];
    }
  }
};

module.exports = SystemRepository;
