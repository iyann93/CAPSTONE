'use strict';

const { body, query } = require('express-validator');

// Validasi untuk single object atau array object
const createAbsensiValidator = [
  body().custom((value) => {
    if (!Array.isArray(value)) value = [value]; // normalize
    for (const item of value) {
      if (!item.siswaId) throw new Error('siswaId wajib diisi pada setiap item');
      if (!item.jadwalId && !item.kelasId) throw new Error('jadwalId atau kelasId wajib diisi pada setiap item');
      if (!item.tanggal) throw new Error('tanggal wajib diisi pada setiap item');
      if (!['Hadir', 'Izin', 'Sakit', 'Alpha'].includes(item.status)) {
        throw new Error('Status harus Hadir, Izin, Sakit, atau Alpha');
      }
    }
    return true;
  })
];

const updateAbsensiValidator = [
  body('status').optional().isIn(['Hadir', 'Izin', 'Sakit', 'Alpha']).withMessage('Status tidak valid'),
  body('keterangan').optional().isString(),
];

const rekapBulananValidator = [
  query('bulan').notEmpty().withMessage('Parameter bulan wajib diisi').isInt({ min: 1, max: 12 }).withMessage('Bulan tidak valid'),
  query('tahun').notEmpty().withMessage('Parameter tahun wajib diisi').isInt({ min: 2000, max: 2100 }).withMessage('Tahun tidak valid'),
  query('kelas_id').optional().matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('kelas_id tidak valid'),
];

const rekapSemesterValidator = [
  query('semester_id').notEmpty().withMessage('Parameter semester_id wajib diisi').matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('semester_id tidak valid'),
  query('kelas_id').optional().matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).withMessage('kelas_id tidak valid'),
];

const statistikValidator = [
  query('start_date').notEmpty().withMessage('start_date wajib diisi').isISO8601().withMessage('Format start_date tidak valid'),
  query('end_date').notEmpty().withMessage('end_date wajib diisi').isISO8601().withMessage('Format end_date tidak valid'),
];

module.exports = { 
  createAbsensiValidator, updateAbsensiValidator, 
  rekapBulananValidator, rekapSemesterValidator, statistikValidator 
};
