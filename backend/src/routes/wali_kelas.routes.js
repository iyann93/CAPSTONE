'use strict';

const router = require('express').Router();
const WaliKelasController = require('../controllers/wali_kelas.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { createWaliKelasValidator, updateWaliKelasValidator } = require('../validators/wali_kelas.validator');

router.get('/',     verifyToken, authorize('wali_kelas.read'),   WaliKelasController.getAll);
router.get('/:id',  verifyToken, authorize('wali_kelas.read'),   WaliKelasController.getById);
router.post('/',    verifyToken, authorize('wali_kelas.create'), createWaliKelasValidator, WaliKelasController.create);
router.put('/:id',  verifyToken, authorize('wali_kelas.update'), updateWaliKelasValidator, WaliKelasController.update);
router.delete('/:id', verifyToken, authorize('wali_kelas.delete'), WaliKelasController.delete);

module.exports = router;
