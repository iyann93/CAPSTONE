'use strict';

const router = require('express').Router();
const AbsensiController = require('../controllers/absensi.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { 
  createAbsensiValidator, updateAbsensiValidator,
  rekapBulananValidator, rekapSemesterValidator, statistikValidator 
} = require('../validators/absensi.validator');

// ==== LAPORAN & STATISTIK (Harus didaftarkan sebelum /:id) ====
router.get('/rekap/bulanan',  verifyToken, authorize('absensi.read'), rekapBulananValidator, AbsensiController.getRekapBulanan);
router.get('/rekap/semester', verifyToken, authorize('absensi.read'), rekapSemesterValidator, AbsensiController.getRekapSemester);
router.get('/statistik',      verifyToken, authorize('absensi.read'), statistikValidator, AbsensiController.getStatistik);

// ==== CRUD DASAR ====
router.get('/',       verifyToken, authorize('absensi.read'),   AbsensiController.getAll);
router.get('/:id',    verifyToken, authorize('absensi.read'),   AbsensiController.getById);

// Mendukung bulk insert jika req.body adalah Array
router.post('/',      verifyToken, authorize('absensi.create'), createAbsensiValidator, AbsensiController.create);
router.put('/:id',    verifyToken, authorize('absensi.update'), updateAbsensiValidator, AbsensiController.update);
router.delete('/:id', verifyToken, authorize('absensi.delete'), AbsensiController.delete);

module.exports = router;
