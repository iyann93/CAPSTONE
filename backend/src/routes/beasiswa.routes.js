'use strict';

const router = require('express').Router();
const BeasiswaController = require('../controllers/beasiswa.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const {
  createBeasiswaValidator,
  updateBeasiswaValidator,
  idParamValidator,
} = require('../validators/beasiswa.validator');

// Gunakan 'finance.read', 'finance.create', dll.
// atau bisa menyesuaikan dengan RBAC role (misal 'beasiswa.read')

router.get(
  '/', 
  verifyToken, 
  authorize('finance.read'), 
  BeasiswaController.getAll
);

router.get(
  '/:id', 
  verifyToken, 
  authorize('finance.read'), 
  idParamValidator, 
  BeasiswaController.getById
);

router.post(
  '/', 
  verifyToken, 
  authorize('finance.create'), 
  createBeasiswaValidator, 
  BeasiswaController.create
);

router.put(
  '/:id', 
  verifyToken, 
  authorize('finance.update'), 
  [...idParamValidator, ...updateBeasiswaValidator], 
  BeasiswaController.update
);

router.delete(
  '/:id', 
  verifyToken, 
  authorize('finance.delete'), 
  idParamValidator, 
  BeasiswaController.delete
);

module.exports = router;
