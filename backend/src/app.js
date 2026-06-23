'use strict';

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const httpLogger = require('./middleware/httpLogger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes           = require('./routes/auth.routes');
const usersRoutes          = require('./routes/users.routes');
const jurusanRoutes        = require('./routes/jurusan.routes');
const kelasRoutes          = require('./routes/kelas.routes');
const siswaRoutes          = require('./routes/siswa.routes');
const guruRoutes           = require('./routes/guru.routes');
const karyawanRoutes       = require('./routes/karyawan.routes');
const tahunAjaranRoutes    = require('./routes/tahun_ajaran.routes');
const semesterRoutes       = require('./routes/semester.routes');
const waliKelasRoutes      = require('./routes/wali_kelas.routes');
const mapelRoutes          = require('./routes/mapel.routes');
const jadwalPelajaranRoutes = require('./routes/jadwal_pelajaran.routes');
const absensiRoutes        = require('./routes/absensi.routes');
const nilaiRoutes          = require('./routes/nilai.routes');
const raporRoutes          = require('./routes/rapor.routes');
const financeRoutes        = require('./routes/finance.routes');
const payrollRoutes        = require('./routes/payroll.routes');
const dashboardRoutes      = require('./routes/dashboard.routes');
const beasiswaRoutes       = require('./routes/beasiswa.routes');
const systemRoutes         = require('./routes/system.routes');
const jabatanRoutes        = require('./routes/jabatan.routes');

const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);

// Serve static files (like uploaded images)
const path = require('path');
app.use('/public', express.static(path.join(__dirname, '../public')));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
const API = '/api/v1';
app.use(`${API}/auth`,             authRoutes);
app.use(`${API}/users`,            usersRoutes);
app.use(`${API}/jurusan`,          jurusanRoutes);
app.use(`${API}/kelas`,            kelasRoutes);
app.use(`${API}/siswa`,            siswaRoutes);
app.use(`${API}/guru`,             guruRoutes);
app.use(`${API}/karyawan`,         karyawanRoutes);
app.use(`${API}/tahun-ajaran`,     tahunAjaranRoutes);
app.use(`${API}/semester`,         semesterRoutes);
app.use(`${API}/wali-kelas`,       waliKelasRoutes);
app.use(`${API}/mapel`,            mapelRoutes);
app.use(`${API}/jadwal-pelajaran`, jadwalPelajaranRoutes);
app.use(`${API}/absensi`,          absensiRoutes);
app.use(`${API}/nilai`,            nilaiRoutes);
app.use(`${API}/rapor`,            raporRoutes);
app.use(`${API}/finance`,          financeRoutes);
app.use(`${API}/payroll`,          payrollRoutes);
app.use(`${API}/dashboard`,        dashboardRoutes);
app.use(`${API}/beasiswa`,         beasiswaRoutes);
app.use(`${API}/system`,           systemRoutes);
app.use(`${API}/jabatan`,          jabatanRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} tidak ditemukan`);
  err.statusCode = 404;
  next(err);
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
