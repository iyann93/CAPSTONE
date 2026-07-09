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

const upload = require('../middleware/upload');

// ==== SPP (Tagihan) ====
router.post('/spp/generate-bulanan', verifyToken, authorize('spp.create'), FinanceController.generateTagihanBulanan);
router.delete('/spp/batal-bulanan', verifyToken, authorize('spp.manage'), FinanceController.deleteTagihanBulanan);
router.post('/spp/upload-bukti/:id', verifyToken, authorize('spp.read'), upload.single('bukti'), FinanceController.uploadBuktiSpp);
router.post('/spp/konfirmasi-bukti/:id', verifyToken, authorize('spp.manage'), FinanceController.konfirmasiBuktiSpp);
router.post('/spp',  verifyToken, authorize('spp.create'),  createTagihanValidator, FinanceController.createTagihan);
router.get('/spp',   verifyToken, authorize('spp.read'),    FinanceController.getAllTagihan);

// ==== PEMBAYARAN ====
router.post('/pembayaran',          verifyToken, authorize('pembayaran.create'), createPembayaranValidator, FinanceController.processPembayaran);
router.get('/pembayaran/laporan',   verifyToken, authorize('reports.read'),      laporanBulananValidator,    FinanceController.getLaporanBulanan);
router.get('/pembayaran',           verifyToken, authorize('pembayaran.read'),   FinanceController.getAllPembayaran);
router.get('/pembayaran/:id',       verifyToken, authorize('pembayaran.read'),   FinanceController.getPembayaranById);

// ==== DANA BEASISWA ====
router.get('/dana-beasiswa',        verifyToken, FinanceController.getAllDanaBeasiswa);
router.post('/dana-beasiswa',       verifyToken, FinanceController.createDanaBeasiswa);
router.delete('/dana-beasiswa/:id', verifyToken, FinanceController.deleteDanaBeasiswa);

// ==== OPERASIONAL TRANSACTIONS ====
router.get('/operasional',          verifyToken, FinanceController.getAllOperasional);
router.post('/operasional',         verifyToken, FinanceController.createOperasional);
router.delete('/operasional',       verifyToken, FinanceController.deleteMultipleOperasional);

module.exports = router;
