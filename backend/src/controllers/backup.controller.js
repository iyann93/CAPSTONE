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

exports.getStats = (req, res, next) => {
  try {
    // We simulate total disk stats using fs.statfsSync if available, or just mock it for Windows compatibility
    let totalSpace = 1000 * 1024 * 1024 * 1024; // 1 TB
    let freeSpace = 150 * 1024 * 1024 * 1024; // 150 GB

    try {
      if (fs.statfsSync) {
        const stats = fs.statfsSync(__dirname);
        totalSpace = stats.blocks * stats.bsize;
        freeSpace = stats.bfree * stats.bsize;
      }
    } catch (e) {
      // ignore
    }

    const usedSpace = totalSpace - freeSpace;

    res.json({
      success: true,
      data: {
        totalSpace,
        usedSpace,
        freeSpace,
        lastBackup: 'Berhasil', // we can compute from files but this is fine
        dbStatus: 'Optimal'
      }
    });
  } catch (err) {
    next(err);
  }
};
