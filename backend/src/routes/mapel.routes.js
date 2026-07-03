'use strict';

const router = require('express').Router();
const MapelController = require('../controllers/mapel.controller');
const verifyToken = require('../middleware/verifyToken');

// Semua route hanya butuh verifyToken (tanpa authorize) agar Admin TU bisa akses
router.get('/',       verifyToken, MapelController.getAll);
router.get('/:id',    verifyToken, MapelController.getById);
router.post('/',      verifyToken, MapelController.create);
router.put('/:id',    verifyToken, MapelController.update);
router.delete('/:id', verifyToken, MapelController.delete);

module.exports = router;
