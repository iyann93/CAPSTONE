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

router.get(
  '/', 
  verifyToken, 
  authorize('beasiswa.read'), 
  BeasiswaController.getAll
);

router.get(
  '/:id', 
  verifyToken, 
  authorize('beasiswa.read'), 
  idParamValidator, 
  BeasiswaController.getById
);

router.post(
  '/', 
  verifyToken, 
  authorize('beasiswa.manage'), 
  createBeasiswaValidator, 
  BeasiswaController.create
);

router.put(
  '/:id', 
  verifyToken, 
  authorize('beasiswa.manage'), 
  [...idParamValidator, ...updateBeasiswaValidator], 
  BeasiswaController.update
);

router.delete(
  '/:id', 
  verifyToken, 
  authorize('beasiswa.manage'), 
  idParamValidator, 
  BeasiswaController.delete
);

module.exports = router;
