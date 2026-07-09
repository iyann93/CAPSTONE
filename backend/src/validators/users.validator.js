'use strict';

const { body } = require('express-validator');

const createUserValidator = [
  body('nama').notEmpty().withMessage('Nama tidak boleh kosong').trim(),
  body('email').isEmail().withMessage('Email tidak valid').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password minimal 8 karakter'),
  body('no_telepon').optional().isMobilePhone('id-ID').withMessage('Nomor telepon tidak valid'),
];

const updateUserValidator = [
  body('nama').optional().notEmpty().withMessage('Nama tidak boleh kosong').trim(),
  body('no_telepon').optional().isMobilePhone('id-ID').withMessage('Nomor telepon tidak valid'),
  body('is_active').optional().isBoolean().withMessage('is_active harus boolean'),
];

module.exports = { createUserValidator, updateUserValidator };
