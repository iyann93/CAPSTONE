'use strict';

const router = require('express').Router();
const ExportController = require('../controllers/export.controller');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');

// We use authorize('system.manage') as a generic high-privilege check for full database export,
// though in a production app we might have a specific 'export.manage' permission.

// GET /api/v1/export/tables
router.get('/tables', verifyToken, authorize('system.manage'), ExportController.getTables);

// GET /api/v1/export/full
// Can return ZIP, Excel, or SQL
router.get('/full', verifyToken, authorize('system.manage'), ExportController.exportFull);

// GET /api/v1/export/table/:schema/:table
// Can return JSON, CSV, or Excel
router.get('/table/:schema/:table', verifyToken, authorize('system.manage'), ExportController.exportTable);

module.exports = router;
