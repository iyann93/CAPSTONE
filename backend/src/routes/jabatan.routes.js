'use strict';

const express = require('express');
const router = express.Router();
const JabatanController = require('../controllers/jabatan.controller');

// Opsional: tambahkan middleware authentikasi
// const { verifyToken } = require('../middlewares/auth');
// router.use(verifyToken);

router.get('/', JabatanController.getAll);
router.get('/:id', JabatanController.getById);
router.post('/', JabatanController.create);
router.put('/:id', JabatanController.update);
router.delete('/:id', JabatanController.delete);

module.exports = router;
