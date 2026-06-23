'use strict';

const router = require('express').Router();
const SiswaController = require('../controllers/siswa.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { createSiswaValidator, updateSiswaValidator } = require('../validators/siswa.validator');

router.get('/',     verifyToken, SiswaController.getAll);
router.get('/:id',  verifyToken, SiswaController.getById);
router.post('/',    verifyToken, createSiswaValidator, SiswaController.create);
router.put('/:id',  verifyToken, updateSiswaValidator, SiswaController.update);
router.delete('/:id', verifyToken, SiswaController.delete);

module.exports = router;
