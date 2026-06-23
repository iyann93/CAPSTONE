'use strict';

const { body } = require('express-validator');

const createSiswaValidator = [
  body('nis').notEmpty().withMessage('NIS tidak boleh kosong').trim(),
  body('nisn').notEmpty().withMessage('NISN tidak boleh kosong').trim(),
  body('nama_lengkap').notEmpty().withMessage('Nama lengkap tidak boleh kosong').trim(),
  body('jenis_kelamin').isIn(['L', 'P']).withMessage('Jenis kelamin harus L atau P'),
  body('tanggal_lahir').optional({ checkFalsy: true }).isISO8601().withMessage('Tanggal lahir tidak valid'),
  body('kelas_id').optional({ checkFalsy: true }).isString().withMessage('kelas_id harus berupa string'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Email tidak valid').normalizeEmail(),
  body('no_telepon').optional(),
  body('alamat').optional().trim(),
];

const updateSiswaValidator = [
  body('nis').optional().notEmpty().trim(),
  body('nisn').optional().notEmpty().trim(),
  body('nama_lengkap').optional().notEmpty().trim(),
  body('jenis_kelamin').optional().isIn(['L', 'P']).withMessage('Jenis kelamin harus L atau P'),
  body('tanggal_lahir').optional({ checkFalsy: true }).isISO8601(),
  body('kelas_id').optional({ checkFalsy: true }).isString(),
  body('email').optional({ checkFalsy: true }).isEmail().normalizeEmail(),
  body('is_active').optional().isBoolean(),
];

module.exports = { createSiswaValidator, updateSiswaValidator };
