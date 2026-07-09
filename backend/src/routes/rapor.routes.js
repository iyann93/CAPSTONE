'use strict';

const router = require('express').Router();
const RaporController = require('../controllers/rapor.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { generateRaporValidator, publishRaporValidator } = require('../validators/rapor.validator');

// ==== WRITE ACTIONS (Generate & Publish) ====
// POST /api/v1/rapor/generate
router.post('/generate', verifyToken, authorize('rapor.create'), generateRaporValidator, RaporController.generate);

// POST /api/v1/rapor/publish
router.post('/publish',  verifyToken, authorize('rapor.update'), publishRaporValidator, RaporController.publish);

// ==== READ ACTIONS ====
// GET /api/v1/rapor/siswa/:id -> Riwayat Rapor Siswa
router.get('/siswa/:id', verifyToken, authorize('rapor.read'), RaporController.getBySiswa);

// GET /api/v1/rapor/kelas/:id?semester_id=... -> Daftar Rapor Kelas (utk wali kelas)
router.get('/kelas/:id', verifyToken, authorize('rapor.read'), RaporController.getByKelas);

// GET /api/v1/rapor/:id -> Detail 1 Rapor
router.get('/:id',       verifyToken, authorize('rapor.read'), RaporController.getById);

module.exports = router;
