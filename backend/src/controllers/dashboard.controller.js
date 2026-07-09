'use strict';

const DashboardService = require('../services/dashboard.service');
const response = require('../utils/response');

const DashboardController = {

  // GET /dashboard/admin
  adminDashboard: async (req, res, next) => {
    try {
      const data = await DashboardService.getAdminDashboard();
      return response.success(res, 200, 'Dashboard admin berhasil diambil', data);
    } catch (err) { next(err); }
  },

  // GET /dashboard/guru  — menggunakan user_id dari JWT token (me)
  guruDashboard: async (req, res, next) => {
    try {
      const data = await DashboardService.getGuruDashboard(req.user.userId);
      return response.success(res, 200, 'Dashboard guru berhasil diambil', data);
    } catch (err) { next(err); }
  },

  // GET /dashboard/siswa  — menggunakan user_id dari JWT token (me)
  siswaDashboard: async (req, res, next) => {
    try {
      const data = await DashboardService.getSiswaDashboard(req.user.userId);
      return response.success(res, 200, 'Dashboard siswa berhasil diambil', data);
    } catch (err) { next(err); }
  },

  // GET /dashboard/stats/pembayaran  — tren pembayaran SPP (admin)
  statsPembayaran: async (req, res, next) => {
    try {
      const data = await DashboardService.getAdminDashboard();
      return response.success(res, 200, 'Statistik pembayaran berhasil diambil', {
        tren: data.tren_pembayaran,
        ringkasan: data.stats.pembayaran_spp,
      });
    } catch (err) { next(err); }
  },

  // GET /dashboard/stats/payroll  — tren payroll (admin)
  statsPayroll: async (req, res, next) => {
    try {
      const data = await DashboardService.getAdminDashboard();
      return response.success(res, 200, 'Statistik payroll berhasil diambil', {
        tren: data.tren_payroll,
        ringkasan: data.stats.payroll,
      });
    } catch (err) { next(err); }
  },

  // GET /dashboard/kepsek/stats
  kepsekStats: async (req, res, next) => {
    try {
      const data = await DashboardService.getKepsekStats();
      return response.success(res, 200, 'Statistik Kepala Sekolah berhasil diambil', data);
    } catch (err) { next(err); }
  },
};

module.exports = DashboardController;
