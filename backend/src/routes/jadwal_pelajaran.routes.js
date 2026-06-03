'use strict';

const router = require('express').Router();
const JadwalPelajaranController = require('../controllers/jadwal_pelajaran.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { createJadwalPelajaranValidator, updateJadwalPelajaranValidator } = require('../validators/jadwal_pelajaran.validator');

router.get('/',     verifyToken, authorize('jadwal_pelajaran.read'),   JadwalPelajaranController.getAll);
router.get('/:id',  verifyToken, authorize('jadwal_pelajaran.read'),   JadwalPelajaranController.getById);
router.post('/',    verifyToken, authorize('jadwal_pelajaran.create'), createJadwalPelajaranValidator, JadwalPelajaranController.create);
router.put('/:id',  verifyToken, authorize('jadwal_pelajaran.update'), updateJadwalPelajaranValidator, JadwalPelajaranController.update);
router.delete('/:id', verifyToken, authorize('jadwal_pelajaran.delete'), JadwalPelajaranController.delete);

module.exports = router;
