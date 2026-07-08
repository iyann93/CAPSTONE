'use strict';

const router = require('express').Router();
const CatatanSiswaController = require('../controllers/catatan_siswa.controller');
const verifyToken = require('../middleware/verifyToken');

// Hanya butuh token, tidak menggunakan authorize ketat untuk simulasi Wali Kelas
router.get('/', verifyToken, CatatanSiswaController.getAll);
router.post('/upsert', verifyToken, CatatanSiswaController.upsert);

module.exports = router;
