'use strict';

const { body } = require('express-validator');

const createJadwalPelajaranValidator = [
  body('kelasId').notEmpty().withMessage('Kelas wajib diisi').isString().isLength({ min: 36, max: 36 }).withMessage('Kelas ID tidak valid'),
  body('mapelId').notEmpty().withMessage('Mapel wajib diisi').isString().isLength({ min: 36, max: 36 }).withMessage('Mapel ID tidak valid'),
  body('guruId').notEmpty().withMessage('Guru wajib diisi').isString().isLength({ min: 36, max: 36 }).withMessage('Guru ID tidak valid'),
  body('semesterId').notEmpty().withMessage('Semester wajib diisi').isString().isLength({ min: 36, max: 36 }).withMessage('Semester ID tidak valid'),
  body('hari').notEmpty().withMessage('Hari wajib diisi').isIn(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']).withMessage('Hari tidak valid'),
  body('jamMulai').notEmpty().withMessage('Jam mulai wajib diisi').matches(/^([01]\d|2[0-3]):?([0-5]\d)$/).withMessage('Format jam mulai tidak valid (HH:MM)'),
  body('jamSelesai').notEmpty().withMessage('Jam selesai wajib diisi').matches(/^([01]\d|2[0-3]):?([0-5]\d)$/).withMessage('Format jam selesai tidak valid (HH:MM)'),
];

const updateJadwalPelajaranValidator = [
  body('kelasId').optional().isString().isLength({ min: 36, max: 36 }).withMessage('Kelas ID tidak valid'),
  body('mapelId').optional().isString().isLength({ min: 36, max: 36 }).withMessage('Mapel ID tidak valid'),
  body('guruId').optional().isString().isLength({ min: 36, max: 36 }).withMessage('Guru ID tidak valid'),
  body('semesterId').optional().isString().isLength({ min: 36, max: 36 }).withMessage('Semester ID tidak valid'),
  body('hari').optional().isIn(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']).withMessage('Hari tidak valid'),
  body('jamMulai').optional().matches(/^([01]\d|2[0-3]):?([0-5]\d)$/).withMessage('Format jam mulai tidak valid (HH:MM)'),
  body('jamSelesai').optional().matches(/^([01]\d|2[0-3]):?([0-5]\d)$/).withMessage('Format jam selesai tidak valid (HH:MM)'),
];

module.exports = { createJadwalPelajaranValidator, updateJadwalPelajaranValidator };
