'use strict';

const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const SystemController = require('../controllers/system.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');

// GET /api/v1/system/audit-logs
router.get('/audit-logs', verifyToken, authorize('system.read'), SystemController.getAuditLogs);

// Announcements File Handling
const announcementStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../data/announcements');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname);
  }
});
const uploadAnnouncement = multer({ storage: announcementStorage });

router.post('/upload-announcement-file', verifyToken, uploadAnnouncement.single('file'), SystemController.uploadAnnouncementFile);
router.get('/announcements/:filename', SystemController.getAnnouncementFile);

// Logo File Handling
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../public');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Determine which logo to overwrite based on a form field or query param
    // Default to logo-wide.png, or if req.body.type === 'round', use logo-round.png
    const type = req.body.type === 'round' ? 'logo-round.png' : 'logo-wide.png';
    cb(null, type);
  }
});
const uploadLogo = multer({ storage: logoStorage });

router.post('/upload-logo', verifyToken, authorize('system.manage'), uploadLogo.single('logo'), (req, res) => {
  res.json({ success: true, message: 'Logo berhasil diperbarui' });
});

// Backup Routes
const BackupController = require('../controllers/backup.controller');
router.get('/backups', verifyToken, authorize('system.manage'), BackupController.getBackups);
router.post('/backups', verifyToken, authorize('system.manage'), BackupController.createBackup);
router.delete('/backups/:filename', verifyToken, authorize('system.manage'), BackupController.deleteBackup);
router.get('/backups/download/:filename', verifyToken, authorize('system.manage'), BackupController.downloadBackup);
router.get('/stats', verifyToken, authorize('system.read'), BackupController.getStats);

// Backup Auto Settings
router.get('/backup-settings', verifyToken, authorize('system.manage'), BackupController.getSettings);
router.put('/backup-settings', verifyToken, authorize('system.manage'), BackupController.updateSettings);

// System Settings
router.get('/settings', async (req, res, next) => {
  try {
    const { pool } = require('../config/db');
    const result = await pool.query('SELECT key, value FROM shared.system_settings');
    const settings = {};
    result.rows.forEach(r => settings[r.key] = r.value);
    res.json({ success: true, data: settings });
  } catch (err) { next(err); }
});

router.put('/settings', verifyToken, authorize('system.manage'), async (req, res, next) => {
  try {
    const { pool } = require('../config/db');
    const settings = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await pool.query(
        `INSERT INTO shared.system_settings (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
        [key, JSON.stringify(value)]
      );
    }
    res.json({ success: true });
  } catch (err) { next(err); }
});

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


const PERMS_FILE = path.join(__dirname, '../../data/role_permissions.json');

router.get('/role-permissions', verifyToken, (req, res) => {
  try {
    if (fs.existsSync(PERMS_FILE)) {
      const data = fs.readFileSync(PERMS_FILE, 'utf8');
      res.json({ success: true, data: JSON.parse(data) });
    } else {
      res.json({ success: true, data: {} });
    }
  } catch (err) { res.json({ success: true, data: {} }); }
});

router.put('/role-permissions', verifyToken, async (req, res) => {
  try {
    const fs = require('fs');
    if (!fs.existsSync(path.dirname(PERMS_FILE))) {
      fs.mkdirSync(path.dirname(PERMS_FILE), { recursive: true });
    }
    fs.writeFileSync(PERMS_FILE, JSON.stringify(req.body, null, 2));
    
    // Insert audit log
    const SystemRepository = require('../repositories/system.repository');
    await SystemRepository.insertAuditLog({
      user_id: req.user.userId,
      aksi: 'UPDATE_ROLE',
      modul: 'Role & Permission',
      detail: 'Ubah Role Permission',
      ip_address: req.ip || '127.0.0.1',
      device: req.headers['user-agent'] || 'Web Browser'
    });

    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
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
router.post('/users/:id/reset-password-email', verifyToken, authorize('users.manage'), SystemController.sendResetPasswordEmail);
router.put('/users/:id', verifyToken, authorize('users.manage'), SystemController.updateUser);
router.delete('/users/:id', verifyToken, authorize('users.manage'), SystemController.deleteUser);

module.exports = router;
