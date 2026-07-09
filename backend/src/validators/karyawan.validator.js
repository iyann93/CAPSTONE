'use strict';

const { body } = require('express-validator');

const createKaryawanValidator = [
  body('nip').notEmpty().withMessage('NIP tidak boleh kosong').trim(),
  body('nama').notEmpty().withMessage('Nama tidak boleh kosong').trim(),
  body('jenis_kelamin').isIn(['L', 'P']).withMessage('Jenis kelamin harus L atau P'),
  body('tanggal_lahir').isDate().withMessage('Tanggal lahir tidak valid'),
  body('jabatan').optional().trim(),
  body('departemen').optional().trim(),
  body('email').optional().isEmail().normalizeEmail(),
];

const updateKaryawanValidator = [
  body('nip').optional().notEmpty().trim(),
  body('nama').optional().notEmpty().trim(),
  body('jenis_kelamin').optional().isIn(['L', 'P']),
  body('tanggal_lahir').optional().isDate(),
  body('jabatan').optional().trim(),
  body('departemen').optional().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('is_active').optional().isBoolean(),
];

module.exports = { createKaryawanValidator, updateKaryawanValidator };
