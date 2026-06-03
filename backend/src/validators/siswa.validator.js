'use strict';

const { body } = require('express-validator');

const createSiswaValidator = [
  body('nis').notEmpty().withMessage('NIS tidak boleh kosong').trim(),
  body('nama').notEmpty().withMessage('Nama tidak boleh kosong').trim(),
  body('jenis_kelamin').isIn(['L', 'P']).withMessage('Jenis kelamin harus L atau P'),
  body('tanggal_lahir').isDate().withMessage('Tanggal lahir tidak valid'),
  body('kelas_id').isUUID().withMessage('kelas_id harus berupa UUID yang valid'),
  body('email').optional().isEmail().withMessage('Email tidak valid').normalizeEmail(),
  body('no_telepon').optional(),
  body('alamat').optional().trim(),
];

const updateSiswaValidator = [
  body('nis').optional().notEmpty().trim(),
  body('nama').optional().notEmpty().trim(),
  body('jenis_kelamin').optional().isIn(['L', 'P']).withMessage('Jenis kelamin harus L atau P'),
  body('tanggal_lahir').optional().isDate(),
  body('kelas_id').optional().isUUID(),
  body('email').optional().isEmail().normalizeEmail(),
  body('is_active').optional().isBoolean(),
];

module.exports = { createSiswaValidator, updateSiswaValidator };
