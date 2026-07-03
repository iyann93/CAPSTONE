'use strict';

const router = require('express').Router();
const OrangTuaController = require('../controllers/orang_tua.controller');
const verifyToken = require('../middleware/verifyToken');

router.get('/',       verifyToken, OrangTuaController.getAll);
router.get('/:id',   verifyToken, OrangTuaController.getById);
router.post('/',     verifyToken, OrangTuaController.create);
router.put('/:id',   verifyToken, OrangTuaController.update);
router.delete('/:id', verifyToken, OrangTuaController.delete);

module.exports = router;
