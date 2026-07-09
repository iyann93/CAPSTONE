'use strict';

const router = require('express').Router();
const JurusanController = require('../controllers/jurusan.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { createJurusanValidator, updateJurusanValidator } = require('../validators/jurusan.validator');

router.get('/',     verifyToken, authorize('jurusan.read'),   JurusanController.getAll);
router.get('/:id',  verifyToken, authorize('jurusan.read'),   JurusanController.getById);
router.post('/',    verifyToken, authorize('jurusan.create'), createJurusanValidator, JurusanController.create);
router.put('/:id',  verifyToken, authorize('jurusan.update'), updateJurusanValidator, JurusanController.update);
router.delete('/:id', verifyToken, authorize('jurusan.delete'), JurusanController.delete);

module.exports = router;
