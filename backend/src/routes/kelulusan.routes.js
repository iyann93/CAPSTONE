'use strict';

const router = require('express').Router();
const KelulusanController = require('../controllers/kelulusan.controller');
const verifyToken = require('../middleware/verifyToken');

router.get('/',            verifyToken, KelulusanController.getAll);
router.get('/:siswaId',    verifyToken, KelulusanController.getById);
router.post('/',           verifyToken, KelulusanController.save);
router.put('/:siswaId',    verifyToken, KelulusanController.save);
router.delete('/:siswaId', verifyToken, KelulusanController.delete);

module.exports = router;
