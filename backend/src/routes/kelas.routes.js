'use strict';

const router = require('express').Router();
const KelasController = require('../controllers/kelas.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { createKelasValidator, updateKelasValidator } = require('../validators/kelas.validator');

router.get('/',     verifyToken, authorize('academic.read'),   KelasController.getAll);
router.get('/:id',  verifyToken, authorize('academic.read'),   KelasController.getById);
router.post('/',    verifyToken, authorize('academic.create'), createKelasValidator, KelasController.create);
router.put('/:id',  verifyToken, authorize('academic.update'), updateKelasValidator, KelasController.update);
router.delete('/:id', verifyToken, authorize('academic.delete'), KelasController.delete);

module.exports = router;
