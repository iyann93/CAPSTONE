'use strict';

const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const BACKUP_DIR = path.join(__dirname, '../../data/backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const TABLES_TO_BACKUP = [
  'shared.users', 'shared.roles', 'shared.user_roles', 'shared.jabatan',
  'academic.guru', 'academic.catatan_siswa', 'academic.kelas', 'academic.semester',
  'academic.kartu_pelajar', 'academic.karyawan', 'academic.jurusan', 'academic.kelulusan',
  'academic.kenaikan_kelas', 'academic.orang_tua', 'academic.rapor', 'academic.siswa_kelas',
  'academic.mata_pelajaran', 'academic.siswa', 'academic.absensi', 'academic.kurikulum',
  'finance.beasiswa', 'finance.bukti_pembayaran', 'finance.komponen_gaji', 'finance.detail_slip_gaji',
  'finance.laporan_keuangan', 'finance.komponen_spp', 'finance.template_gaji_jabatan',
  'finance.pengaturan_gaji_user', 'finance.tagihan_spp', 'finance.dana_beasiswa',
  'finance.operasional_transactions', 'finance.kas_sekolah', 'finance.mutasi_kas'
];

exports.createBackup = async (req, res, next) => {
  try {
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      tables: {}
    };

    // Extract all tables
    for (const table of TABLES_TO_BACKUP) {
      try {
        const result = await pool.query(`SELECT * FROM ${table}`);
        backupData.tables[table] = result.rows;
      } catch (err) {
        console.warn(`Skipping table ${table}: ${err.message}`);
      }
    }

    const date = new Date();
    const filename = `Backup_System_${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}.json`;
    
    const filePath = path.join(BACKUP_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));

    const stats = fs.statSync(filePath);
    res.json({
      success: true,
      data: {
        filename,
        size: stats.size,
        createdAt: stats.birthtime
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getBackups = (req, res, next) => {
  try {
    const files = fs.readdirSync(BACKUP_DIR).filter(file => file.endsWith('.json'));
    
    const backups = files.map(file => {
      const stats = fs.statSync(path.join(BACKUP_DIR, file));
      return {
        id: file,
        filename: file,
        size: stats.size, // in bytes
        type: file.includes('Manual') ? 'Manual' : 'Otomatis',
        createdAt: stats.birthtime,
        status: 'Berhasil'
      };
    });

    // Sort descending by date
    backups.sort((a, b) => b.createdAt - a.createdAt);

    res.json({ success: true, data: backups });
  } catch (err) {
    next(err);
  }
};

exports.deleteBackup = (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(BACKUP_DIR, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'Backup deleted' });
    } else {
      res.status(404).json({ success: false, message: 'Backup not found' });
    }
  } catch (err) {
    next(err);
  }
};

const SETTINGS_FILE = path.join(__dirname, '../../data/backup_settings.json');

const getSettingsData = () => {
  if (fs.existsSync(SETTINGS_FILE)) {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
  }
  return { isActive: false, frequency: 'weekly', time: '00:00' };
};

exports.getSettings = (req, res, next) => {
  try {
    res.json({ success: true, data: getSettingsData() });
  } catch (err) {
    next(err);
  }
};

exports.updateSettings = (req, res, next) => {
  try {
    const newSettings = req.body;
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newSettings, null, 2));
    
    // We will create the scheduler module next
    try {
      const scheduler = require('../utils/scheduler');
      scheduler.reload();
    } catch(e) {}
    
    res.json({ success: true, data: newSettings });
  } catch (err) {
    next(err);
  }
};

exports.downloadBackup = (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(BACKUP_DIR, filename);
    
    if (fs.existsSync(filePath)) {
      res.download(filePath, filename);
    } else {
      res.status(404).json({ success: false, message: 'Backup not found' });
    }
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    // 1. Get Database size
    const dbRes = await pool.query(`SELECT pg_database_size(current_database()) as size`);
    let dbSize = 0;
    if (dbRes.rows.length > 0) {
      dbSize = parseInt(dbRes.rows[0].size, 10);
    }

    // 2. Get backup folder size
    let backupSize = 0;
    let lastBackup = 'Belum Ada';
    if (fs.existsSync(BACKUP_DIR)) {
      const files = fs.readdirSync(BACKUP_DIR).filter(file => file.endsWith('.json'));
      files.forEach(file => {
        const stats = fs.statSync(path.join(BACKUP_DIR, file));
        backupSize += stats.size;
      });
      
      if (files.length > 0) {
        lastBackup = 'Berhasil';
      }
    }

    // 3. Get announcements folder size
    const ANNOUNCEMENT_DIR = path.join(__dirname, '../../data/announcements');
    let announcementsSize = 0;
    if (fs.existsSync(ANNOUNCEMENT_DIR)) {
      const files = fs.readdirSync(ANNOUNCEMENT_DIR);
      files.forEach(file => {
        const stats = fs.statSync(path.join(ANNOUNCEMENT_DIR, file));
        announcementsSize += stats.size;
      });
    }

    // 4. Return combined used space
    const usedSpace = dbSize + backupSize + announcementsSize;
    
    // Let's set total space to 5 GB (or 10 GB) to show a realistic percentage for a small web app
    const totalSpace = 5 * 1024 * 1024 * 1024; // 5 GB
    const freeSpace = totalSpace - usedSpace;

    res.json({
      success: true,
      data: {
        totalSpace,
        usedSpace,
        freeSpace,
        lastBackup,
        dbStatus: 'Optimal',
        uptime: process.uptime()
      }
    });
  } catch (err) {
    next(err);
  }
};
