'use strict';

const { body } = require('express-validator');

const createWaliKelasValidator = [
  body('guruId').notEmpty().withMessage('Guru wajib diisi').isUUID().withMessage('Guru ID tidak valid'),
  body('kelasId').notEmpty().withMessage('Kelas wajib diisi').isUUID().withMessage('Kelas ID tidak valid'),
  body('tahunAjaranId').notEmpty().withMessage('Tahun ajaran wajib diisi').isUUID().withMessage('Tahun ajaran ID tidak valid'),
];

const updateWaliKelasValidator = [
  body('guruId').optional().isUUID().withMessage('Guru ID tidak valid'),
  body('kelasId').optional().isUUID().withMessage('Kelas ID tidak valid'),
  body('tahunAjaranId').optional().isUUID().withMessage('Tahun ajaran ID tidak valid'),
];

module.exports = { createWaliKelasValidator, updateWaliKelasValidator };
