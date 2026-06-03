'use strict';

const { body, query } = require('express-validator');

const generateRaporValidator = [
  body('mode').notEmpty().withMessage('Mode wajib diisi').isIn(['kelas', 'siswa']).withMessage('Mode harus "kelas" atau "siswa"'),
  body('semesterId').notEmpty().withMessage('Semester ID wajib diisi').isUUID().withMessage('Semester ID tidak valid'),
  body('kelasId').optional({ nullable: true }).isUUID().withMessage('Kelas ID tidak valid'),
  body('siswaId').optional({ nullable: true }).isUUID().withMessage('Siswa ID tidak valid'),
  body('keteranganWali').optional().isString()
];

const publishRaporValidator = [
  body('kelasId').notEmpty().withMessage('Kelas ID wajib diisi').isUUID().withMessage('Kelas ID tidak valid'),
  body('semesterId').notEmpty().withMessage('Semester ID wajib diisi').isUUID().withMessage('Semester ID tidak valid')
];

module.exports = { generateRaporValidator, publishRaporValidator };
