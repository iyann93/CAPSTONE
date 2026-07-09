'use strict';

const router = require('express').Router();
const JadwalPelajaranController = require('../controllers/jadwal_pelajaran.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { createJadwalPelajaranValidator, updateJadwalPelajaranValidator } = require('../validators/jadwal_pelajaran.validator');

router.get('/',     verifyToken, authorize('jadwal.read'),   JadwalPelajaranController.getAll);
router.get('/:id',  verifyToken, authorize('jadwal.read'),   JadwalPelajaranController.getById);
router.post('/',    verifyToken, authorize('jadwal.create'), createJadwalPelajaranValidator, JadwalPelajaranController.create);
router.put('/:id',  verifyToken, authorize('jadwal.update'), updateJadwalPelajaranValidator, JadwalPelajaranController.update);
router.delete('/:id', verifyToken, authorize('jadwal.delete'), JadwalPelajaranController.delete);

module.exports = router;
