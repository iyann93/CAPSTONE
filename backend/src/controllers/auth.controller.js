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
};

module.exports = AuthController;
