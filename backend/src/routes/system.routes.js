'use strict';

const router = require('express').Router();
const SystemController = require('../controllers/system.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');

// GET /api/v1/system/audit-logs
router.get('/audit-logs', verifyToken, authorize('system.read'), SystemController.getAuditLogs);

// GET /api/v1/system/roles
router.get('/roles', verifyToken, authorize('system.read'), SystemController.getAllRoles);

// GET /api/v1/system/users/pending
router.get('/users/pending', verifyToken, authorize('users.manage'), SystemController.getPendingUsers);

// PUT /api/v1/system/users/:id/activate
router.put('/users/:id/activate', verifyToken, authorize('users.activate'), SystemController.activateUser);

// PUT /api/v1/system/users/:id/deactivate
router.put('/users/:id/deactivate', verifyToken, authorize('users.activate'), SystemController.deactivateUser);

// === ALL USERS CRUD (Super Admin) ===
router.get('/users', verifyToken, authorize('users.manage'), SystemController.getAllUsers);
router.post('/users', verifyToken, authorize('users.manage'), SystemController.createUser);
router.put('/users/:id', verifyToken, authorize('users.manage'), SystemController.updateUser);
router.delete('/users/:id', verifyToken, authorize('users.manage'), SystemController.deleteUser);

module.exports = router;
