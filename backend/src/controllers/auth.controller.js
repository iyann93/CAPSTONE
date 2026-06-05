'use strict';

const { validationResult } = require('express-validator');
const AuthService = require('../services/auth.service');
const response = require('../utils/response');
const env = require('../config/env');

const COOKIE_NAME = 'refreshToken';

const cookieOptions = {
  httpOnly: env.cookie.httpOnly,
  secure: env.cookie.secure,
  sameSite: env.cookie.sameSite,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const AuthController = {
  login: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      }

      const { email, password } = req.body;
      const deviceInfo = req.headers['user-agent'] || null;
      const ipAddress = req.ip || null;

      const { accessToken, refreshToken, user } = await AuthService.login({
        email, password, deviceInfo, ipAddress,
      });

      res.cookie(COOKIE_NAME, refreshToken, cookieOptions);

      return response.success(res, 200, 'Login berhasil', { accessToken, user });
    } catch (err) {
      next(err);
    }
  },

  refresh: async (req, res, next) => {
    try {
      const refreshToken = req.cookies?.[COOKIE_NAME];
      const { accessToken } = await AuthService.refresh(refreshToken);
      return response.success(res, 200, 'Access token diperbarui', { accessToken });
    } catch (err) {
      next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      const refreshToken = req.cookies?.[COOKIE_NAME];
      await AuthService.logout(refreshToken);
      res.clearCookie(COOKIE_NAME);
      return response.success(res, 200, 'Logout berhasil');
    } catch (err) {
      next(err);
    }
  },

  me: async (req, res, next) => {
    try {
      const user = await AuthService.getMe(req.user.userId);
      return response.success(res, 200, 'Data user berhasil diambil', user);
    } catch (err) {
      next(err);
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      }
      
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;

      await AuthService.changePassword(userId, currentPassword, newPassword);
      
      // Since refresh tokens are revoked, we should also clear the cookie
      res.clearCookie(COOKIE_NAME);
      
      return response.success(res, 200, 'Password berhasil diubah. Silakan login kembali.');
    } catch (err) {
      next(err);
    }
  },

  forgotPassword: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      }

      const { email } = req.body;
      const ipAddress = req.ip || null;

      await AuthService.forgotPassword(email, ipAddress);
      
      // Always return success even if email not found
      return response.success(res, 200, 'Jika email terdaftar, instruksi reset password telah dikirim ke email Anda.');
    } catch (err) {
      next(err);
    }
  },

  validateResetToken: async (req, res, next) => {
    try {
      const { token } = req.query;
      if (!token) {
        return response.error(res, 400, 'Token tidak valid');
      }

      const isValid = await AuthService.validateResetToken(token);
      if (!isValid) {
        return response.error(res, 400, 'Token tidak valid atau sudah kedaluwarsa');
      }

      return response.success(res, 200, 'Token valid');
    } catch (err) {
      next(err);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      }

      const { token, newPassword } = req.body;

      await AuthService.resetPassword(token, newPassword);
      
      // Clear cookie in case they had an old session
      res.clearCookie(COOKIE_NAME);

      return response.success(res, 200, 'Password berhasil diatur ulang. Silakan login dengan password baru.');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AuthController;
