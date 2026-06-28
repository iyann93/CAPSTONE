'use strict';

const { body, param, query } = require('express-validator');

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const createBeasiswaValidator = [
  body('siswaId').custom(val => uuidRegex.test(val)).withMessage('siswaId harus berformat UUID'),
  body('namaBeasiswa').notEmpty().withMessage('namaBeasiswa wajib diisi').isString(),
  body('nominal').isNumeric().withMessage('nominal harus berupa angka').custom(val => val >= 0).withMessage('nominal tidak boleh negatif'),
  body('periode').notEmpty().withMessage('periode wajib diisi').isString(),
  body('status').notEmpty().withMessage('status wajib diisi').isString(),
  body('tanggalMulai').isISO8601().withMessage('tanggalMulai harus format YYYY-MM-DD'),
  body('tanggalSelesai').optional({ nullable: true }).isISO8601().withMessage('tanggalSelesai harus format YYYY-MM-DD'),
];

const updateBeasiswaValidator = [
  body('siswaId').optional().custom(val => uuidRegex.test(val)).withMessage('siswaId harus berformat UUID'),
  body('namaBeasiswa').optional().isString(),
  body('nominal').optional().isNumeric().custom(val => val >= 0),
  body('periode').optional().isString(),
  body('status').optional().isString(),
  body('tanggalMulai').optional().isISO8601(),
  body('tanggalSelesai').optional({ nullable: true }).isISO8601(),
];

const idParamValidator = [
  param('id').custom(val => uuidRegex.test(val)).withMessage('ID harus berformat UUID'),
];

module.exports = {
  createBeasiswaValidator,
  updateBeasiswaValidator,
  idParamValidator,
};
