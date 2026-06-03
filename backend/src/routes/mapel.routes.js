'use strict';

const router = require('express').Router();
const MapelController = require('../controllers/mapel.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { createMapelValidator, updateMapelValidator } = require('../validators/mapel.validator');

router.get('/',     verifyToken, authorize('mapel.read'),   MapelController.getAll);
router.get('/:id',  verifyToken, authorize('mapel.read'),   MapelController.getById);
router.post('/',    verifyToken, authorize('mapel.create'), createMapelValidator, MapelController.create);
router.put('/:id',  verifyToken, authorize('mapel.update'), updateMapelValidator, MapelController.update);
router.delete('/:id', verifyToken, authorize('mapel.delete'), MapelController.delete);

module.exports = router;
