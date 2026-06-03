'use strict';

const router = require('express').Router();
const GuruController = require('../controllers/guru.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { createGuruValidator, updateGuruValidator } = require('../validators/guru.validator');

router.get('/',     verifyToken, authorize('guru.read'),   GuruController.getAll);
router.get('/:id',  verifyToken, authorize('guru.read'),   GuruController.getById);
router.post('/',    verifyToken, authorize('guru.create'), createGuruValidator, GuruController.create);
router.put('/:id',  verifyToken, authorize('guru.update'), updateGuruValidator, GuruController.update);
router.delete('/:id', verifyToken, authorize('guru.delete'), GuruController.delete);

module.exports = router;
