'use strict';

const { body } = require('express-validator');

const createMapelValidator = [
  body('kodeMapel').notEmpty().withMessage('Kode mapel wajib diisi').isString(),
  body('namaMapel').notEmpty().withMessage('Nama mapel wajib diisi').isString(),
  body('tingkat').optional().isInt().withMessage('Tingkat harus berupa angka'),
  body('deskripsi').optional().isString(),
  body('jurusanId').optional({ nullable: true }).isUUID().withMessage('Jurusan ID tidak valid'),
];

const updateMapelValidator = [
  body('kodeMapel').optional().isString(),
  body('namaMapel').optional().isString(),
  body('tingkat').optional().isInt().withMessage('Tingkat harus berupa angka'),
  body('deskripsi').optional().isString(),
  body('jurusanId').optional({ nullable: true }).isUUID().withMessage('Jurusan ID tidak valid'),
];

module.exports = { createMapelValidator, updateMapelValidator };
