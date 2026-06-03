'use strict';

const { body } = require('express-validator');

const loginValidator = [
  body('email').isEmail().withMessage('Email tidak valid').normalizeEmail(),
  body('password').notEmpty().withMessage('Password tidak boleh kosong'),
];

module.exports = { loginValidator };
