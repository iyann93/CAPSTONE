'use strict';

const { query, getClient } = require('../config/db');

const AuthRepository = {
  /**
   * Find a user by email from shared.users
   */
  findUserByEmail: async (email) => {
    const sql = `
      SELECT u.id, u.nama, u.email, u.password_hash, u.no_telepon, u.alamat_lengkap,
             u.is_active, u.last_login_at, u.created_at,
             (SELECT r.nama_role FROM shared.user_roles ur JOIN shared.roles r ON ur.role_id = r.id WHERE ur.user_id = u.id LIMIT 1) AS role,
             (SELECT json_build_object(
                 'id', s.id,
                 'nama', s.nama_lengkap,
                 'nisn', s.nisn,
                 'nis', s.nis,
                 'kelas', k.nama_kelas,
                 'wali', w.nama
               )
              FROM academic.orang_tua o
              JOIN academic.siswa s ON o.siswa_id = s.id
              LEFT JOIN academic.kelas k ON s.kelas_id = k.id
              LEFT JOIN shared.users w ON k.wali_kelas_id = w.id
              WHERE o.user_id = u.id LIMIT 1) AS anak
      FROM shared.users u
      WHERE u.email = $1
      LIMIT 1
    `;
    const result = await query(sql, [email]);
    return result.rows[0] || null;
  },

  /**
   * Find user by id
   */
  findUserById: async (id) => {
    const sql = `
      SELECT u.id, u.nama, u.email, u.no_telepon, u.alamat_lengkap,
             u.is_active, u.last_login_at, u.created_at,
             (SELECT r.nama_role FROM shared.user_roles ur JOIN shared.roles r ON ur.role_id = r.id WHERE ur.user_id = u.id LIMIT 1) AS role,
             (SELECT json_build_object(
                 'id', s.id,
                 'nama', s.nama_lengkap,
                 'nisn', s.nisn,
                 'nis', s.nis,
                 'kelas', k.nama_kelas,
                 'wali', w.nama
               )
              FROM academic.orang_tua o
              JOIN academic.siswa s ON o.siswa_id = s.id
              LEFT JOIN academic.kelas k ON s.kelas_id = k.id
              LEFT JOIN shared.users w ON k.wali_kelas_id = w.id
              WHERE o.user_id = u.id LIMIT 1) AS anak
      FROM shared.users u
      WHERE u.id = $1
      LIMIT 1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  /**
   * Update last_login_at for a user
   */
  updateLastLogin: async (userId) => {
    const sql = `
      UPDATE shared.users
      SET last_login_at = NOW()
      WHERE id = $1
    `;
    return query(sql, [userId]);
  },

  /**
   * Save a hashed refresh token to shared.refresh_tokens
   */
  saveRefreshToken: async ({ userId, tokenHash, deviceInfo, ipAddress, expiresAt }) => {
    const sql = `
      INSERT INTO shared.refresh_tokens
        (user_id, token_hash, device_info, ip_address, created_at, expires_at, is_revoked)
      VALUES ($1, $2, $3, $4, NOW(), $5, false)
      RETURNING id
    `;
    const result = await query(sql, [userId, tokenHash, deviceInfo, ipAddress, expiresAt]);
    return result.rows[0];
  },

  /**
   * Find all active (non-revoked, non-expired) refresh tokens for a user
   */
  findActiveRefreshTokens: async (userId) => {
    const sql = `
      SELECT id, token_hash, expires_at
      FROM shared.refresh_tokens
      WHERE user_id = $1
        AND is_revoked = false
        AND expires_at > NOW()
    `;
    const result = await query(sql, [userId]);
    return result.rows;
  },

  /**
   * Revoke a refresh token by its id
   */
  revokeRefreshToken: async (tokenId) => {
    const sql = `
      UPDATE shared.refresh_tokens
      SET is_revoked = true, revoked_at = NOW()
      WHERE id = $1
    `;
    return query(sql, [tokenId]);
  },

  /**
   * Revoke all active refresh tokens for a user (for full logout)
   */
  revokeAllUserTokens: async (userId, client = null) => {
    const sql = `
      UPDATE shared.refresh_tokens
      SET is_revoked = true, revoked_at = NOW()
      WHERE user_id = $1 AND is_revoked = false
    `;
    const dbClient = client || query;
    return dbClient.query ? dbClient.query(sql, [userId]) : dbClient(sql, [userId]);
  },

  /**
   * Update user password
   */
  updateUserPassword: async (userId, newPasswordHash, client = null) => {
    const sql = `
      UPDATE shared.users
      SET password_hash = $1, password_changed_at = NOW(), updated_at = NOW()
      WHERE id = $2
    `;
    const dbClient = client || query;
    return dbClient.query ? dbClient.query(sql, [newPasswordHash, userId]) : dbClient(sql, [newPasswordHash, userId]);
  },

  /**
   * Save password reset token
   */
  savePasswordResetToken: async ({ userId, tokenHash, expiresAt, ipAddress }) => {
    const sql = `
      INSERT INTO shared.password_reset_tokens
        (user_id, token_hash, created_at, expires_at, is_used, ip_address)
      VALUES ($1, $2, NOW(), $3, false, $4)
    `;
    return query(sql, [userId, tokenHash, expiresAt, ipAddress]);
  },

  /**
   * Find a valid password reset token by its hash
   */
  findPasswordResetTokenByHash: async (tokenHash) => {
    const sql = `
      SELECT id, user_id, token_hash, created_at, expires_at, is_used, used_at, ip_address
      FROM shared.password_reset_tokens
      WHERE token_hash = $1 AND is_used = false AND expires_at > NOW()
      LIMIT 1
    `;
    const result = await query(sql, [tokenHash]);
    return result.rows[0] || null;
  },

  /**
   * Mark a password reset token as used
   */
  markPasswordResetTokenAsUsed: async (tokenId, client = null) => {
    const sql = `
      UPDATE shared.password_reset_tokens
      SET is_used = true, used_at = NOW()
      WHERE id = $1
    `;
    const dbClient = client || query;
    return dbClient.query ? dbClient.query(sql, [tokenId]) : dbClient(sql, [tokenId]);
  },
};

module.exports = AuthRepository;
