'use strict';

const { body } = require('express-validator');
const { validate } = require('../middleware/validator');

const createKurikulumValidator = validate([
  body('kode_kurikulum')
    .notEmpty().withMessage('Kode kurikulum wajib diisi')
    .isString().withMessage('Kode kurikulum harus berupa teks')
    .trim(),
  body('nama_kurikulum')
    .notEmpty().withMessage('Nama kurikulum wajib diisi')
    .isString().withMessage('Nama kurikulum harus berupa teks')
    .trim(),
  body('tahun_ajaran_id')
    .notEmpty().withMessage('Tahun ajaran wajib diisi')
    .isString().withMessage('Format ID tahun ajaran harus teks')
    .isLength({ min: 36, max: 36 }).withMessage('Format ID tahun ajaran tidak valid'),
  body('status')
    .optional()
    .isIn(['Draft', 'Aktif', 'Arsip']).withMessage('Status hanya boleh Draft, Aktif, atau Arsip'),
  body('deskripsi')
    .optional()
    .isString()
    .trim()
]);

const updateKurikulumValidator = validate([
  body('kode_kurikulum')
    .optional()
    .notEmpty().withMessage('Kode kurikulum tidak boleh kosong jika diubah')
    .isString().withMessage('Kode kurikulum harus berupa teks')
    .trim(),
  body('nama_kurikulum')
    .optional()
    .notEmpty().withMessage('Nama kurikulum tidak boleh kosong jika diubah')
    .isString().withMessage('Nama kurikulum harus berupa teks')
    .trim(),
  body('tahun_ajaran_id')
    .optional()
    .isString().withMessage('Format ID tahun ajaran harus teks')
    .isLength({ min: 36, max: 36 }).withMessage('Format ID tahun ajaran tidak valid'),
  body('status')
    .optional()
    .isIn(['Draft', 'Aktif', 'Arsip']).withMessage('Status hanya boleh Draft, Aktif, atau Arsip'),
  body('deskripsi')
    .optional()
    .isString()
    .trim()
]);

module.exports = {
  createKurikulumValidator,
  updateKurikulumValidator
};
