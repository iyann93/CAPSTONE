'use strict';

const { body } = require('express-validator');

const createSemesterValidator = [
  body('nama').notEmpty().withMessage('Nama semester wajib diisi').isString(),
  body('tahunAjaranId').notEmpty().withMessage('Tahun ajaran wajib diisi').isString().withMessage('Tahun ajaran ID tidak valid'),
  body('tanggalMulai').notEmpty().withMessage('Tanggal mulai wajib diisi').isISO8601().withMessage('Format tanggal tidak valid'),
  body('tanggalSelesai').notEmpty().withMessage('Tanggal selesai wajib diisi').isISO8601().withMessage('Format tanggal tidak valid'),
];

const updateSemesterValidator = [
  body('nama').optional().isString(),
  body('tahunAjaranId').optional().isString().withMessage('Tahun ajaran ID tidak valid'),
  body('tanggalMulai').optional().isISO8601().withMessage('Format tanggal tidak valid'),
  body('tanggalSelesai').optional().isISO8601().withMessage('Format tanggal tidak valid'),
];

module.exports = { createSemesterValidator, updateSemesterValidator };
