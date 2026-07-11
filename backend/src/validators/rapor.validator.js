'use strict';

const { body, query } = require('express-validator');

const generateRaporValidator = [
  body('mode').notEmpty().withMessage('Mode wajib diisi').isIn(['kelas', 'siswa']).withMessage('Mode harus "kelas" atau "siswa"'),
  body('semesterId').notEmpty().withMessage('Semester ID wajib diisi').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Semester ID tidak valid'),
  body('kelasId').optional({ nullable: true }).matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Kelas ID tidak valid'),
  body('siswaId').optional({ nullable: true }).matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Siswa ID tidak valid'),
  body('keteranganWali').optional().isString()
];

const publishRaporValidator = [
  body('kelasId').notEmpty().withMessage('Kelas ID wajib diisi').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Kelas ID tidak valid'),
  body('semesterId').notEmpty().withMessage('Semester ID wajib diisi').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Semester ID tidak valid'),
  body('siswaId').optional({ nullable: true }).matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('Siswa ID tidak valid')
];

module.exports = { generateRaporValidator, publishRaporValidator };
