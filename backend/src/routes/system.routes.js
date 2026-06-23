'use strict';

const router = require('express').Router();
const SystemController = require('../controllers/system.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');

// GET /api/v1/system/audit-logs
router.get('/audit-logs', verifyToken, authorize('system.read'), SystemController.getAuditLogs);

router.get('/frontend-state', verifyToken, async (req, res, next) => {
  try {
    const pool = require('../config/db');
    const result = await pool.query('SELECT state FROM shared.frontend_state WHERE user_id = $1', [req.user.userId]);
    res.json({ success: true, data: result.rows[0]?.state || {} });
  } catch (err) { next(err); }
});

router.put('/frontend-state', verifyToken, async (req, res, next) => {
  try {
    const pool = require('../config/db');
    await pool.query(
      `INSERT INTO shared.frontend_state (user_id, state) VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET state = EXCLUDED.state`,
      [req.user.userId, req.body]
    );
    res.json({ success: true });
  } catch (err) { next(err); }
});

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
router.get('/siswa', verifyToken, authorize('users.manage'), SystemController.getSiswaList);
router.post('/users', verifyToken, authorize('users.manage'), SystemController.createUser);
router.put('/users/:id', verifyToken, authorize('users.manage'), SystemController.updateUser);
router.delete('/users/:id', verifyToken, authorize('users.manage'), SystemController.deleteUser);

module.exports = router;
