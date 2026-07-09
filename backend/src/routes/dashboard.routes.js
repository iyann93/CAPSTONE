'use strict';

const router = require('express').Router();
const DashboardController = require('../controllers/dashboard.controller');
const verifyToken         = require('../middleware/verifyToken');
const authorize           = require('../middleware/authorize');

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
// GET /api/v1/dashboard/admin
router.get('/admin',
  verifyToken,
  authorize('dashboard.admin'),
  DashboardController.adminDashboard
);

// GET /api/v1/dashboard/stats/pembayaran
router.get('/stats/pembayaran',
  verifyToken,
  authorize('dashboard.admin'),
  DashboardController.statsPembayaran
);

// GET /api/v1/dashboard/stats/payroll
router.get('/stats/payroll',
  verifyToken,
  authorize('dashboard.admin'),
  DashboardController.statsPayroll
);

// ─── Guru Dashboard ───────────────────────────────────────────────────────────
// GET /api/v1/dashboard/guru  (uses JWT userId to resolve guru)
router.get('/guru',
  verifyToken,
  authorize('dashboard.guru'),
  DashboardController.guruDashboard
);

// ─── Siswa Dashboard ──────────────────────────────────────────────────────────
// GET /api/v1/dashboard/siswa  (uses JWT userId to resolve siswa)
router.get('/siswa',
  verifyToken,
  authorize('dashboard.siswa'),
  DashboardController.siswaDashboard
);

// ─── Bendahara Dashboard ──────────────────────────────────────────────────────
// GET /api/v1/dashboard/bendahara
router.get('/bendahara',
  verifyToken,
  authorize('spp.read'),
  DashboardController.adminDashboard
);

// ─── Kepsek Dashboard ─────────────────────────────────────────────────────────
// GET /api/v1/dashboard/kepsek/stats
router.get('/kepsek/stats',
  verifyToken,
  DashboardController.kepsekStats
);

module.exports = router;
