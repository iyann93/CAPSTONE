'use strict';

const { body } = require('express-validator');

const createJurusanValidator = [
  body('kode_jurusan').notEmpty().withMessage('Kode jurusan tidak boleh kosong').trim(),
  body('nama_jurusan').notEmpty().withMessage('Nama jurusan tidak boleh kosong').trim(),
  body('kepala_jurusan').optional().trim(),
];

const updateJurusanValidator = [
  body('kode_jurusan').optional().notEmpty().withMessage('Kode jurusan tidak boleh kosong').trim(),
  body('nama_jurusan').optional().notEmpty().withMessage('Nama jurusan tidak boleh kosong').trim(),
  body('kepala_jurusan').optional().trim(),
];

module.exports = { createJurusanValidator, updateJurusanValidator };
