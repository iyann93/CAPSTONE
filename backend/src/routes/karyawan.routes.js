'use strict';

const router = require('express').Router();
const KaryawanController = require('../controllers/karyawan.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { createKaryawanValidator, updateKaryawanValidator } = require('../validators/karyawan.validator');

router.get('/',     verifyToken, authorize('karyawan.read'),   KaryawanController.getAll);
router.get('/:id',  verifyToken, authorize('karyawan.read'),   KaryawanController.getById);
router.post('/',    verifyToken, authorize('karyawan.create'), createKaryawanValidator, KaryawanController.create);
router.put('/:id',  verifyToken, authorize('karyawan.update'), updateKaryawanValidator, KaryawanController.update);
router.delete('/:id', verifyToken, authorize('karyawan.delete'), KaryawanController.delete);

module.exports = router;
