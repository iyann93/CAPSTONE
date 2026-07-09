'use strict';

const router = require('express').Router();
const AuthController = require('../controllers/auth.controller');
const verifyToken = require('../middleware/verifyToken');
const { 
  loginValidator, 
  changePasswordValidator, 
  forgotPasswordValidator, 
  resetPasswordValidator 
} = require('../validators/auth.validator');
const { 
  forgotPasswordLimiter, 
  resetPasswordLimiter 
} = require('../middleware/rateLimiter');

router.post('/login',   loginValidator, AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout',  AuthController.logout);
router.get('/me',       verifyToken, AuthController.me);

// Change Password
router.post('/change-password', verifyToken, changePasswordValidator, AuthController.changePassword);

// Forgot Password & Reset Password
router.post('/forgot-password', forgotPasswordLimiter, forgotPasswordValidator, AuthController.forgotPassword);
router.get('/reset-password/validate', resetPasswordLimiter, AuthController.validateResetToken);
router.post('/reset-password', resetPasswordLimiter, resetPasswordValidator, AuthController.resetPassword);

module.exports = router;
