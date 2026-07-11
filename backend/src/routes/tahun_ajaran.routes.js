'use strict';

const router = require('express').Router();
const TahunAjaranController = require('../controllers/tahun_ajaran.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { createTahunAjaranValidator, updateTahunAjaranValidator } = require('../validators/tahun_ajaran.validator');

// Special route for getting active
router.get('/active', verifyToken, TahunAjaranController.getActive);
// Special route for setting active
router.put('/:id/active', verifyToken, authorize('tahun_ajaran.update'), TahunAjaranController.setActive);

router.get('/',     verifyToken, authorize('tahun_ajaran.read'),   TahunAjaranController.getAll);
router.get('/:id',  verifyToken, authorize('tahun_ajaran.read'),   TahunAjaranController.getById);
router.post('/',    verifyToken, authorize('tahun_ajaran.create'), createTahunAjaranValidator, TahunAjaranController.create);
router.put('/:id',  verifyToken, authorize('tahun_ajaran.update'), updateTahunAjaranValidator, TahunAjaranController.update);
router.delete('/:id', verifyToken, authorize('tahun_ajaran.delete'), TahunAjaranController.delete);

module.exports = router;
