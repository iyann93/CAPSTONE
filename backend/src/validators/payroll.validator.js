'use strict';

const { body, param, query } = require('express-validator');

/**
 * Validator untuk POST /payroll/generate
 * Body: userId, bulan, tahun, gajiPokok, hariHadir?, jumlahAlpha?, jamLembur?
 */
const generatePayrollValidator = [
  body('userId')
    .notEmpty().withMessage('userId wajib diisi')
    .isUUID().withMessage('userId harus berformat UUID'),

  body('bulan')
    .notEmpty().withMessage('bulan wajib diisi')
    .isInt({ min: 1, max: 12 }).withMessage('bulan harus antara 1–12'),

  body('tahun')
    .notEmpty().withMessage('tahun wajib diisi')
    .isInt({ min: 2000, max: 2100 }).withMessage('tahun tidak valid'),

  body('gajiPokok')
    .optional()
    .isFloat({ min: 0 }).withMessage('gajiPokok harus berupa angka positif'),

  body('hariHadir')
    .optional()
    .isInt({ min: 0, max: 31 }).withMessage('hariHadir harus bilangan bulat 0–31'),

  body('jumlahAlpha')
    .optional()
    .isInt({ min: 0, max: 31 }).withMessage('jumlahAlpha harus bilangan bulat 0–31'),

  body('jamLembur')
    .optional()
    .isInt({ min: 0 }).withMessage('jamLembur harus bilangan bulat non-negatif'),
];

/**
 * Validator untuk POST /payroll/approve
 * Body: slipGajiId
 */
const approvePayrollValidator = [
  body('slipGajiId')
    .notEmpty().withMessage('slipGajiId wajib diisi')
    .isUUID().withMessage('slipGajiId harus berformat UUID'),
];

/**
 * Validator untuk POST /payroll/transfer
 * Body: slipGajiId, noReferensi, rekeningId?
 */
const transferPayrollValidator = [
  body('slipGajiId')
    .notEmpty().withMessage('slipGajiId wajib diisi')
    .isUUID().withMessage('slipGajiId harus berformat UUID'),

  body('noReferensi')
    .notEmpty().withMessage('noReferensi transfer wajib diisi')
    .isString().trim().isLength({ min: 3, max: 100 })
    .withMessage('noReferensi harus berupa string 3–100 karakter'),

  body('rekeningId')
    .optional({ nullable: true })
    .isUUID().withMessage('rekeningId harus berformat UUID'),
];

/**
 * Validator param :id (UUID)
 */
const idParamValidator = [
  param('id').isUUID().withMessage('ID harus berformat UUID'),
];

/**
 * Validator param :userId (UUID) — untuk riwayat
 */
const userIdParamValidator = [
  param('userId').isUUID().withMessage('userId harus berformat UUID'),
];

/**
 * Validator untuk query GET /payroll
 */
const listPayrollValidator = [
  query('bulan').optional().isInt({ min: 1, max: 12 }).withMessage('bulan tidak valid'),
  query('tahun').optional().isInt({ min: 2000, max: 2100 }).withMessage('tahun tidak valid'),
  query('status')
    .optional()
    .isIn(['Draft', 'Approved', 'Transferred'])
    .withMessage("status harus: 'Draft', 'Approved', atau 'Transferred'"),
  query('page').optional().isInt({ min: 1 }).withMessage('page harus bilangan positif'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit harus 1–100'),
];

module.exports = {
  generatePayrollValidator,
  approvePayrollValidator,
  transferPayrollValidator,
  idParamValidator,
  userIdParamValidator,
  listPayrollValidator,
};
