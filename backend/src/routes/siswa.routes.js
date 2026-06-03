'use strict';

const router = require('express').Router();
const SiswaController = require('../controllers/siswa.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { createSiswaValidator, updateSiswaValidator } = require('../validators/siswa.validator');

router.get('/',     verifyToken, authorize('siswa.read'),   SiswaController.getAll);
router.get('/:id',  verifyToken, authorize('siswa.read'),   SiswaController.getById);
router.post('/',    verifyToken, authorize('siswa.create'), createSiswaValidator, SiswaController.create);
router.put('/:id',  verifyToken, authorize('siswa.update'), updateSiswaValidator, SiswaController.update);
router.delete('/:id', verifyToken, authorize('siswa.delete'), SiswaController.delete);

module.exports = router;
