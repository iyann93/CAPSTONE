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

// ─── KOMPONEN GAJI (Pengaturan) ───────────────────────────────────────────────
router.get(
  '/komponen',
  verifyToken,
  authorize('gaji.read'),
  PayrollController.getAllKomponen
);

router.post(
  '/komponen',
  verifyToken,
  authorize('gaji.manage'),
  // Add validation middleware here if needed in the future
  PayrollController.createKomponen
);

router.put(
  '/komponen/:id',
  verifyToken,
  authorize('gaji.manage'),
  idParamValidator,
  PayrollController.updateKomponen
);

router.delete(
  '/komponen/:id',
  verifyToken,
  authorize('gaji.manage'),
  idParamValidator,
  PayrollController.deleteKomponen
);

// ─── TEMPLATE GAJI JABATAN ─────────────────────────────────────────────────────
router.get(
  '/templates',
  verifyToken,
  authorize('gaji.read'),
  PayrollController.getTemplates
);

router.post(
  '/templates',
  verifyToken,
  authorize('gaji.manage'),
  PayrollController.upsertTemplate
);

// ─── OVERRIDE GAJI PEGAWAI ───────────────────────────────────────────────────
router.get(
  '/overrides',
  verifyToken,
  authorize('gaji.read'),
  PayrollController.getOverrides
);

router.post(
  '/overrides',
  verifyToken,
  authorize('gaji.manage'),
  PayrollController.upsertOverride
);

// ─── Action Routes (POST) ─────────────────────────────────────────────────────
// POST /api/v1/payroll/generate  — Hitung & buat slip gaji
router.post(
  '/generate',
  verifyToken,
  authorize('gaji.create'),
  generatePayrollValidator,
  PayrollController.generate
);

// POST /api/v1/payroll/approve   — Approve slip gaji (Draft → Approved)
router.post(
  '/approve',
  verifyToken,
  authorize('gaji.approve'),
  approvePayrollValidator,
  PayrollController.approve
);

// POST /api/v1/payroll/transfer  — Transfer gaji (Approved → Transferred)
router.post(
  '/transfer',
  verifyToken,
  authorize('gaji.manage'),
  transferPayrollValidator,
  PayrollController.transfer
);

// ─── Read Routes (GET) ────────────────────────────────────────────────────────
// GET /api/v1/payroll/employees  — Daftar pegawai (untuk list payroll)
router.get(
  '/employees',
  verifyToken,
  authorize('gaji.read'),
  PayrollController.getEmployees
);
// GET /api/v1/payroll/riwayat/:userId  — Riwayat gaji per user (BEFORE /:id)
router.get(
  '/riwayat/:userId',
  verifyToken,
  authorize('gaji.read'),
  userIdParamValidator,
  PayrollController.getRiwayat
);

// GET /api/v1/payroll             — Daftar semua slip gaji (filter, sort, page)
router.get(
  '/',
  verifyToken,
  authorize('gaji.read'),
  listPayrollValidator,
  PayrollController.getAll
);

// GET /api/v1/payroll/:id         — Detail slip gaji + komponen + transfer
router.get(
  '/:id',
  verifyToken,
  authorize('gaji.read'),
  idParamValidator,
  PayrollController.getById
);

module.exports = router;
