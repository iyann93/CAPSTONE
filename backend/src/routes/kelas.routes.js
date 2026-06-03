'use strict';

const router = require('express').Router();
const KelasController = require('../controllers/kelas.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { createKelasValidator, updateKelasValidator } = require('../validators/kelas.validator');

router.get('/',     verifyToken, authorize('kelas.read'),   KelasController.getAll);
router.get('/:id',  verifyToken, authorize('kelas.read'),   KelasController.getById);
router.post('/',    verifyToken, authorize('kelas.create'), createKelasValidator, KelasController.create);
router.put('/:id',  verifyToken, authorize('kelas.update'), updateKelasValidator, KelasController.update);
router.delete('/:id', verifyToken, authorize('kelas.delete'), KelasController.delete);

module.exports = router;
