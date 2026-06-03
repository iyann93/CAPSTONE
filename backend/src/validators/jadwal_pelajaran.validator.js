'use strict';

const { body } = require('express-validator');

const createJadwalPelajaranValidator = [
  body('kelasId').notEmpty().withMessage('Kelas wajib diisi').isUUID().withMessage('Kelas ID tidak valid'),
  body('mapelId').notEmpty().withMessage('Mapel wajib diisi').isUUID().withMessage('Mapel ID tidak valid'),
  body('guruId').notEmpty().withMessage('Guru wajib diisi').isUUID().withMessage('Guru ID tidak valid'),
  body('semesterId').notEmpty().withMessage('Semester wajib diisi').isUUID().withMessage('Semester ID tidak valid'),
  body('hari').notEmpty().withMessage('Hari wajib diisi').isInt({ min: 1, max: 7 }).withMessage('Hari harus berupa angka 1-7 (Senin-Minggu)'),
  body('jamMulai').notEmpty().withMessage('Jam mulai wajib diisi').matches(/^([01]\d|2[0-3]):?([0-5]\d)$/).withMessage('Format jam mulai tidak valid (HH:MM)'),
  body('jamSelesai').notEmpty().withMessage('Jam selesai wajib diisi').matches(/^([01]\d|2[0-3]):?([0-5]\d)$/).withMessage('Format jam selesai tidak valid (HH:MM)'),
];

const updateJadwalPelajaranValidator = [
  body('kelasId').optional().isUUID().withMessage('Kelas ID tidak valid'),
  body('mapelId').optional().isUUID().withMessage('Mapel ID tidak valid'),
  body('guruId').optional().isUUID().withMessage('Guru ID tidak valid'),
  body('semesterId').optional().isUUID().withMessage('Semester ID tidak valid'),
  body('hari').optional().isInt({ min: 1, max: 7 }).withMessage('Hari harus berupa angka 1-7'),
  body('jamMulai').optional().matches(/^([01]\d|2[0-3]):?([0-5]\d)$/).withMessage('Format jam mulai tidak valid (HH:MM)'),
  body('jamSelesai').optional().matches(/^([01]\d|2[0-3]):?([0-5]\d)$/).withMessage('Format jam selesai tidak valid (HH:MM)'),
];

module.exports = { createJadwalPelajaranValidator, updateJadwalPelajaranValidator };
