'use strict';

const router = require('express').Router();
const AuthController = require('../controllers/auth.controller');
const verifyToken = require('../middleware/verifyToken');
const { loginValidator } = require('../validators/auth.validator');

router.post('/login',   loginValidator, AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout',  AuthController.logout);
router.get('/me',       verifyToken, AuthController.me);

module.exports = router;
