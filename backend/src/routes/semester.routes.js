'use strict';

const router = require('express').Router();
const SemesterController = require('../controllers/semester.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { createSemesterValidator, updateSemesterValidator } = require('../validators/semester.validator');

// Special route for setting active
router.put('/:id/active', verifyToken, authorize('semester.update'), SemesterController.setActive);

router.get('/',     verifyToken, authorize('semester.read'),   SemesterController.getAll);
router.get('/:id',  verifyToken, authorize('semester.read'),   SemesterController.getById);
router.post('/',    verifyToken, authorize('semester.create'), createSemesterValidator, SemesterController.create);
router.put('/:id',  verifyToken, authorize('semester.update'), updateSemesterValidator, SemesterController.update);
router.delete('/:id', verifyToken, authorize('semester.delete'), SemesterController.delete);

module.exports = router;
