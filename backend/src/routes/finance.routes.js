'use strict';

const router = require('express').Router();
const FinanceController = require('../controllers/finance.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { createTagihanValidator, createPembayaranValidator, laporanBulananValidator } = require('../validators/finance.validator');

// ==== KOMPONEN SPP (Pengaturan) ====
router.get('/komponen-spp',        verifyToken, authorize('spp.read'),   FinanceController.getAllKomponenSpp);
router.post('/komponen-spp',       verifyToken, authorize('spp.manage'), FinanceController.createKomponenSpp);
router.put('/komponen-spp/:id',    verifyToken, authorize('spp.manage'), FinanceController.updateKomponenSpp);
router.delete('/komponen-spp/:id', verifyToken, authorize('spp.manage'), FinanceController.deleteKomponenSpp);

// ==== SPP (Tagihan) ====
router.post('/spp/generate-bulanan', verifyToken, authorize('spp.create'), FinanceController.generateTagihanBulanan);
router.post('/spp',  verifyToken, authorize('spp.create'),  createTagihanValidator, FinanceController.createTagihan);
router.get('/spp',   verifyToken, authorize('spp.read'),    FinanceController.getAllTagihan);

// ==== PEMBAYARAN ====
router.post('/pembayaran',          verifyToken, authorize('pembayaran.create'), createPembayaranValidator, FinanceController.processPembayaran);
router.get('/pembayaran/laporan',   verifyToken, authorize('reports.read'),      laporanBulananValidator,    FinanceController.getLaporanBulanan);
router.get('/pembayaran',           verifyToken, authorize('pembayaran.read'),   FinanceController.getAllPembayaran);
router.get('/pembayaran/:id',       verifyToken, authorize('pembayaran.read'),   FinanceController.getPembayaranById);

module.exports = router;
