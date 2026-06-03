'use strict';

const router = require('express').Router();
const UsersController = require('../controllers/users.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { createUserValidator, updateUserValidator } = require('../validators/users.validator');

router.get('/',     verifyToken, authorize('users.read'),   UsersController.getAll);
router.get('/:id',  verifyToken, authorize('users.read'),   UsersController.getById);
router.post('/',    verifyToken, authorize('users.create'), createUserValidator, UsersController.create);
router.put('/:id',  verifyToken, authorize('users.update'), updateUserValidator, UsersController.update);
router.delete('/:id', verifyToken, authorize('users.delete'), UsersController.delete);

module.exports = router;
