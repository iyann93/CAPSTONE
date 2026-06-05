'use strict';

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const AuthRepository = require('../repositories/auth.repository');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const env = require('../config/env');
const { sendResetPasswordEmail } = require('./email.service');
const { getClient } = require('../config/db');

const SALT_ROUNDS = 10;

// Helper: convert JWT refresh expiry string to a Date object for DB storage
const refreshExpiryToDate = () => {
  const expiry = env.jwt.refreshExpiry; // e.g. '7d'
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error('Invalid JWT_REFRESH_EXPIRY format');
  const [, amount, unit] = match;
  const ms = { s: 1000, m: 60000, h: 3600000, d: 86400000 }[unit];
  return new Date(Date.now() + parseInt(amount, 10) * ms);
};

const AuthService = {
  /**
   * Login: validate credentials, issue tokens, store hashed refresh token
   */
  login: async ({ email, password, deviceInfo, ipAddress }) => {
    const user = await AuthRepository.findUserByEmail(email);
    if (!user) {
      const err = new Error('Email atau password salah');
      err.statusCode = 401;
      throw err;
    }

    if (!user.is_active) {
      const err = new Error('Akun tidak aktif. Hubungi administrator.');
      err.statusCode = 403;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const err = new Error('Email atau password salah');
      err.statusCode = 401;
      throw err;
    }

    // Generate tokens
    const payload = { userId: user.id, email: user.email, nama: user.nama };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Hash refresh token before storing — never store raw token
    const tokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
    const expiresAt = refreshExpiryToDate();

    await AuthRepository.saveRefreshToken({
      userId: user.id,
      tokenHash,
      deviceInfo: deviceInfo || null,
      ipAddress: ipAddress || null,
      expiresAt,
    });

    // Update last login timestamp
    await AuthRepository.updateLastLogin(user.id);

    const { password_hash: _, ...userData } = user;

    return { accessToken, refreshToken, user: userData };
  },

  /**
   * Refresh: validate refresh token from cookie, issue new access token
   */
  refresh: async (refreshToken) => {
    if (!refreshToken) {
      const err = new Error('Refresh token tidak ditemukan');
      err.statusCode = 401;
      throw err;
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      const err = new Error('Refresh token tidak valid atau sudah kadaluarsa');
      err.statusCode = 401;
      throw err;
    }

    // Find all active tokens for user and bcrypt.compare each
    const activeTokens = await AuthRepository.findActiveRefreshTokens(decoded.userId);
    let matchedToken = null;

    for (const stored of activeTokens) {
      const isMatch = await bcrypt.compare(refreshToken, stored.token_hash);
      if (isMatch) {
        matchedToken = stored;
        break;
      }
    }

    if (!matchedToken) {
      const err = new Error('Refresh token tidak valid atau sudah digunakan');
      err.statusCode = 401;
      throw err;
    }

    // Issue new access token only
    const payload = { userId: decoded.userId, email: decoded.email, nama: decoded.nama };
    const newAccessToken = signAccessToken(payload);

    return { accessToken: newAccessToken };
  },

  /**
   * Logout: revoke the refresh token matching the cookie value
   */
  logout: async (refreshToken) => {
    if (!refreshToken) return;

    try {
      const decoded = verifyRefreshToken(refreshToken);
      const activeTokens = await AuthRepository.findActiveRefreshTokens(decoded.userId);

      for (const stored of activeTokens) {
        const isMatch = await bcrypt.compare(refreshToken, stored.token_hash);
        if (isMatch) {
          await AuthRepository.revokeRefreshToken(stored.id);
          break;
        }
      }
    } catch {
      // Token already expired/invalid — still clear cookie, no error thrown
    }
  },

  /**
   * Me: return current authenticated user data
   */
  getMe: async (userId) => {
    const user = await AuthRepository.findUserById(userId);
    if (!user) {
      const err = new Error('User tidak ditemukan');
      err.statusCode = 404;
      throw err;
    }
    return user;
  },

  /**
   * Change Password
   */
  changePassword: async (userId, currentPassword, newPassword) => {
    const user = await AuthRepository.findUserById(userId);
    if (!user) {
      const err = new Error('User tidak ditemukan');
      err.statusCode = 404;
      throw err;
    }

    const fullUser = await AuthRepository.findUserByEmail(user.email);
    const isMatch = await bcrypt.compare(currentPassword, fullUser.password_hash);
    if (!isMatch) {
      const err = new Error('Password lama tidak sesuai');
      err.statusCode = 400;
      throw err;
    }

    const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    
    const client = await getClient();
    try {
      await client.query('BEGIN');
      
      await AuthRepository.updateUserPassword(userId, newPasswordHash, client);
      await AuthRepository.revokeAllUserTokens(userId, client);
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Forgot Password
   */
  forgotPassword: async (email, ipAddress) => {
    const user = await AuthRepository.findUserByEmail(email);
    // If not found, return successfully to prevent email enumeration
    if (!user || !user.is_active) {
      return;
    }

    // Generate secure random token
    const token = crypto.randomBytes(32).toString('hex');
    // Use SHA-256 for reset token hash so we can search it directly in DB
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    // Expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await AuthRepository.savePasswordResetToken({
      userId: user.id,
      tokenHash,
      expiresAt,
      ipAddress,
    });

    await sendResetPasswordEmail(user.email, user.nama, token);
  },

  /**
   * Validate Reset Token
   */
  validateResetToken: async (token) => {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const resetToken = await AuthRepository.findPasswordResetTokenByHash(tokenHash);
    
    if (!resetToken) {
      return false;
    }
    return true;
  },

  /**
   * Reset Password
   */
  resetPassword: async (token, newPassword) => {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const resetToken = await AuthRepository.findPasswordResetTokenByHash(tokenHash);
    
    if (!resetToken) {
      const err = new Error('Token tidak valid atau sudah kedaluwarsa');
      err.statusCode = 400;
      throw err;
    }

    const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    
    const client = await getClient();
    try {
      await client.query('BEGIN');
      
      // Update password
      await AuthRepository.updateUserPassword(resetToken.user_id, newPasswordHash, client);
      
      // Mark token as used
      await AuthRepository.markPasswordResetTokenAsUsed(resetToken.id, client);
      
      // Revoke all refresh tokens
      await AuthRepository.revokeAllUserTokens(resetToken.user_id, client);
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
};

module.exports = AuthService;
