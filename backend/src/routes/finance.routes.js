'use strict';

const router = require('express').Router();
const FinanceController = require('../controllers/finance.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { createTagihanValidator, createPembayaranValidator, laporanBulananValidator } = require('../validators/finance.validator');

// ==== SPP (Tagihan) ====
// POST /api/v1/finance/spp -> Sesuai instruksi prompt (Bisa dipisah di routes/spp.js, tapi karena berdekatan kita kelola disini)
router.post('/spp', verifyToken, authorize('finance.create'), createTagihanValidator, FinanceController.createTagihan);
router.get('/spp', verifyToken, authorize('finance.read'), FinanceController.getAllTagihan);

// ==== PEMBAYARAN ====
router.post('/pembayaran', verifyToken, authorize('finance.create'), createPembayaranValidator, FinanceController.processPembayaran);
router.get('/pembayaran/laporan', verifyToken, authorize('finance.report'), laporanBulananValidator, FinanceController.getLaporanBulanan); // Special Route
router.get('/pembayaran', verifyToken, authorize('finance.read'), FinanceController.getAllPembayaran);
router.get('/pembayaran/:id', verifyToken, authorize('finance.read'), FinanceController.getPembayaranById);

module.exports = router;
