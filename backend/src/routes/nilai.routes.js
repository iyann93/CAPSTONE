'use strict';

const router = require('express').Router();
const NilaiController = require('../controllers/nilai.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { createNilaiValidator, updateNilaiValidator, getByKelasValidator } = require('../validators/nilai.validator');

// Spesifik reports (sebelum /:id agar tidak tertangkap salah)
router.get('/siswa/:id', verifyToken, authorize('nilai.read'), NilaiController.getBySiswa);
router.get('/kelas/:id', verifyToken, authorize('nilai.read'), getByKelasValidator, NilaiController.getByKelas);

// CRUD Default
router.get('/',       verifyToken, authorize('nilai.read'),   NilaiController.getAll);
router.get('/:id',    verifyToken, authorize('nilai.read'),   NilaiController.getById);
router.post('/',      verifyToken, authorize('nilai.create'), createNilaiValidator, NilaiController.create);
router.put('/:id',    verifyToken, authorize('nilai.update'), updateNilaiValidator, NilaiController.update);
router.delete('/:id', verifyToken, authorize('nilai.delete'), NilaiController.delete);

module.exports = router;
