'use strict';

const { body } = require('express-validator');

const createTahunAjaranValidator = [
  body('nama').notEmpty().withMessage('Nama tahun ajaran wajib diisi').isString(),
  body('tanggalMulai').notEmpty().withMessage('Tanggal mulai wajib diisi').isISO8601().withMessage('Format tanggal tidak valid'),
  body('tanggalSelesai').notEmpty().withMessage('Tanggal selesai wajib diisi').isISO8601().withMessage('Format tanggal tidak valid'),
];

const updateTahunAjaranValidator = [
  body('nama').optional().isString(),
  body('tanggalMulai').optional().isISO8601().withMessage('Format tanggal tidak valid'),
  body('tanggalSelesai').optional().isISO8601().withMessage('Format tanggal tidak valid'),
];

module.exports = { createTahunAjaranValidator, updateTahunAjaranValidator };
