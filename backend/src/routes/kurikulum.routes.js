'use strict';

const router = require('express').Router();
const KurikulumController = require('../controllers/kurikulum.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { createKurikulumValidator, updateKurikulumValidator } = require('../validators/kurikulum.validator');

router.get('/',     verifyToken, KurikulumController.getAll);
router.get('/:id',  verifyToken, KurikulumController.getById);
router.get('/:id/mapel', verifyToken, KurikulumController.getMapel);
router.post('/',    verifyToken, authorize('academic.create'), createKurikulumValidator, KurikulumController.create);
router.put('/:id',  verifyToken, authorize('academic.update'), updateKurikulumValidator, KurikulumController.update);
router.delete('/:id', verifyToken, authorize('academic.delete'), KurikulumController.delete);

module.exports = router;
