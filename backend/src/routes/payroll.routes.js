'use strict';

const router = require('express').Router();
const PayrollController    = require('../controllers/payroll.controller');
const verifyToken          = require('../middleware/verifyToken');
const authorize            = require('../middleware/authorize');
const {
  generatePayrollValidator,
  approvePayrollValidator,
  transferPayrollValidator,
  idParamValidator,
  userIdParamValidator,
  listPayrollValidator,
} = require('../validators/payroll.validator');

// ─── Action Routes (POST) ─────────────────────────────────────────────────────
// POST /api/v1/payroll/generate  — Hitung & buat slip gaji
router.post(
  '/generate',
  verifyToken,
  authorize('payroll.create'),
  generatePayrollValidator,
  PayrollController.generate
);

// POST /api/v1/payroll/approve   — Approve slip gaji (Draft → Approved)
router.post(
  '/approve',
  verifyToken,
  authorize('payroll.update'),
  approvePayrollValidator,
  PayrollController.approve
);

// POST /api/v1/payroll/transfer  — Transfer gaji (Approved → Transferred)
router.post(
  '/transfer',
  verifyToken,
  authorize('payroll.update'),
  transferPayrollValidator,
  PayrollController.transfer
);

// ─── Read Routes (GET) ────────────────────────────────────────────────────────
// GET /api/v1/payroll/riwayat/:userId  — Riwayat gaji per user (BEFORE /:id)
router.get(
  '/riwayat/:userId',
  verifyToken,
  authorize('payroll.read'),
  userIdParamValidator,
  PayrollController.getRiwayat
);

// GET /api/v1/payroll             — Daftar semua slip gaji (filter, sort, page)
router.get(
  '/',
  verifyToken,
  authorize('payroll.read'),
  listPayrollValidator,
  PayrollController.getAll
);

// GET /api/v1/payroll/:id         — Detail slip gaji + komponen + transfer
router.get(
  '/:id',
  verifyToken,
  authorize('payroll.read'),
  idParamValidator,
  PayrollController.getById
);

module.exports = router;
