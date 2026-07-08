'use strict';

const router = require('express').Router();
const KenaikanKelasController = require('../controllers/kenaikan_kelas.controller');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, KenaikanKelasController.getByTahunAjaran);
router.post('/bulk', verifyToken, KenaikanKelasController.bulkUpsert);

module.exports = router;
