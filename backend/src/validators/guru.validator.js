'use strict';

const { body } = require('express-validator');

const createGuruValidator = [
  body('nip').notEmpty().withMessage('NIP tidak boleh kosong').isNumeric().withMessage('NIP harus berupa angka').isLength({ min: 6, max: 6 }).withMessage('NIP harus terdiri dari 6 angka').trim(),
  body('nama').notEmpty().withMessage('Nama tidak boleh kosong').trim(),
  body('jenis_kelamin').isIn(['L', 'P']).withMessage('Jenis kelamin harus L atau P'),
  body('tanggal_lahir').isDate().withMessage('Tanggal lahir tidak valid'),
  body('mata_pelajaran').optional().trim(),
  body('email').optional().isEmail().normalizeEmail(),
];

const updateGuruValidator = [
  body('nip').optional().notEmpty().isNumeric().isLength({ min: 6, max: 6 }).trim(),
  body('nama').optional().notEmpty().trim(),
  body('jenis_kelamin').optional().isIn(['L', 'P']),
  body('tanggal_lahir').optional().isDate(),
  body('mata_pelajaran').optional().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('is_active').optional().isBoolean(),
];

module.exports = { createGuruValidator, updateGuruValidator };
