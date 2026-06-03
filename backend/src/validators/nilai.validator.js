'use strict';

const { body, query } = require('express-validator');

const createNilaiValidator = [
  body('siswaId').notEmpty().withMessage('Siswa wajib diisi').isUUID().withMessage('Siswa ID tidak valid'),
  body('mataPelajaranId').notEmpty().withMessage('Mata pelajaran wajib diisi').isUUID().withMessage('Mata Pelajaran ID tidak valid'),
  body('semesterId').notEmpty().withMessage('Semester wajib diisi').isUUID().withMessage('Semester ID tidak valid'),
  body('nilaiHarian').notEmpty().withMessage('Nilai Tugas/Harian wajib diisi').isNumeric().withMessage('Nilai harus berupa angka'),
  body('nilaiUts').notEmpty().withMessage('Nilai UTS wajib diisi').isNumeric().withMessage('Nilai harus berupa angka'),
  body('nilaiUas').notEmpty().withMessage('Nilai UAS wajib diisi').isNumeric().withMessage('Nilai harus berupa angka'),
  body('catatan').optional().isString()
];

const updateNilaiValidator = [
  body('nilaiHarian').notEmpty().withMessage('Nilai Tugas/Harian wajib diisi').isNumeric().withMessage('Nilai harus berupa angka'),
  body('nilaiUts').notEmpty().withMessage('Nilai UTS wajib diisi').isNumeric().withMessage('Nilai harus berupa angka'),
  body('nilaiUas').notEmpty().withMessage('Nilai UAS wajib diisi').isNumeric().withMessage('Nilai harus berupa angka'),
  body('catatan').optional().isString()
];

const getByKelasValidator = [
  query('semester_id').notEmpty().withMessage('semester_id wajib diisi pada query params').isUUID().withMessage('semester_id tidak valid'),
  query('mata_pelajaran_id').optional().isUUID().withMessage('mata_pelajaran_id tidak valid')
];

module.exports = { createNilaiValidator, updateNilaiValidator, getByKelasValidator };
