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
             (SELECT r.nama_role FROM shared.user_roles ur JOIN shared.roles r ON ur.role_id = r.id WHERE ur.user_id = u.id LIMIT 1) AS role
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
             (SELECT r.nama_role FROM shared.user_roles ur JOIN shared.roles r ON ur.role_id = r.id WHERE ur.user_id = u.id LIMIT 1) AS role
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
  revokeAllUserTokens: async (userId) => {
    const sql = `
      UPDATE shared.refresh_tokens
      SET is_revoked = true, revoked_at = NOW()
      WHERE user_id = $1 AND is_revoked = false
    `;
    return query(sql, [userId]);
  },
};

module.exports = AuthRepository;
