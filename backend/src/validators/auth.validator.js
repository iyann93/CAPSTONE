'use strict';

const { body } = require('express-validator');

const loginValidator = [
  body('email').isEmail().withMessage('Email tidak valid').normalizeEmail(),
  body('password').notEmpty().withMessage('Password tidak boleh kosong'),
];

const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Password lama tidak boleh kosong'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password baru minimal 6 karakter'),
];

const forgotPasswordValidator = [
  body('email').isEmail().withMessage('Email tidak valid').normalizeEmail(),
];

const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Token tidak boleh kosong'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password baru minimal 6 karakter'),
];

module.exports = {
  loginValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
};
