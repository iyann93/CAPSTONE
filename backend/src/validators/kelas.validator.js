'use strict';

const { body } = require('express-validator');

const createKelasValidator = [
  body('nama_kelas').notEmpty().withMessage('Nama kelas tidak boleh kosong').trim(),
  body('tingkat').notEmpty().withMessage('Tingkat tidak boleh kosong'),
  body('tahun_ajaran').notEmpty().withMessage('Tahun ajaran tidak boleh kosong').trim(),
  body('jurusan_id').optional({ nullable: true }).isUUID().withMessage('jurusan_id harus berupa UUID yang valid'),
];

const updateKelasValidator = [
  body('nama_kelas').optional().notEmpty().withMessage('Nama kelas tidak boleh kosong').trim(),
  body('tingkat').optional().notEmpty(),
  body('tahun_ajaran').optional().notEmpty().trim(),
  body('jurusan_id').optional({ nullable: true }).isUUID().withMessage('jurusan_id harus berupa UUID yang valid'),
];

module.exports = { createKelasValidator, updateKelasValidator };
