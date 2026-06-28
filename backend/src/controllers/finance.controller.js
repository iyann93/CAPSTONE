'use strict';

const FinanceService = require('../services/finance.service');
const response = require('../utils/response');
const { validationResult } = require('express-validator');

const FinanceController = {
  // ─── KOMPONEN SPP ──────────────────────────────────────────────────────────
  getAllKomponenSpp: async (req, res, next) => {
    try {
      const data = await FinanceService.getAllKomponenSpp();
      return response.success(res, 200, 'Komponen SPP berhasil diambil', data);
    } catch (err) { next(err); }
  },

  createKomponenSpp: async (req, res, next) => {
    try {
      const data = await FinanceService.createKomponenSpp(req.body);
      return response.success(res, 201, 'Komponen SPP berhasil dibuat', data);
    } catch (err) { next(err); }
  },

  updateKomponenSpp: async (req, res, next) => {
    try {
      const data = await FinanceService.updateKomponenSpp(req.params.id, req.body);
      return response.success(res, 200, 'Komponen SPP berhasil diperbarui', data);
    } catch (err) { next(err); }
  },

  deleteKomponenSpp: async (req, res, next) => {
    try {
      await FinanceService.deleteKomponenSpp(req.params.id);
      return response.success(res, 200, 'Komponen SPP berhasil dihapus', null);
    } catch (err) { next(err); }
  },

  // ─── GENERATE TAGIHAN BULANAN ──────────────────────────────────────────────
  generateTagihanBulanan: async (req, res, next) => {
    try {
      const { bulan, tahun, kelas_id: kelasId } = req.body;
      if (!bulan || !tahun) {
        return response.error(res, 400, 'Parameter bulan dan tahun wajib diisi');
      }
      const data = await FinanceService.generateTagihanBulanan(parseInt(bulan), parseInt(tahun), req.user.userId, kelasId);
      return response.success(res, 201, `Berhasil men-generate ${data.generated} tagihan SPP`, data);
    } catch (err) { next(err); }
  },

  deleteTagihanBulanan: async (req, res, next) => {
    try {
      const { bulan, tahun } = req.body;
      if (!bulan || !tahun) {
        return response.error(res, 400, 'Parameter bulan dan tahun wajib diisi');
      }
      const deletedCount = await FinanceService.deleteTagihanBulanan(parseInt(bulan), parseInt(tahun));
      return response.success(res, 200, `Berhasil membatalkan ${deletedCount} tagihan SPP yang belum lunas`, { deletedCount });
    } catch (err) { next(err); }
  },

  // ─── SPP TAGIHAN ───────────────────────────────────────────────────────────
  getAllTagihan: async (req, res, next) => {
    try {
      let queryParams = { ...req.query };
      // Jika login sebagai orang tua, hanya ambil tagihan untuk anaknya
      if (req.user.role === 'Orang Tua') {
        const { pool } = require('../config/db');
        const otRes = await pool.query('SELECT siswa_id FROM academic.orang_tua WHERE user_id = $1', [req.user.userId]);
        if (otRes.rows.length > 0) {
          queryParams.siswa_id = otRes.rows[0].siswa_id;
        } else {
          // Jika belum ada data anak terkait, kembalikan kosong
          return response.success(res, 200, 'Data tagihan SPP berhasil diambil', [], { page: 1, limit: 10, total: 0, totalPages: 0 });
        }
      }
      const { data, meta } = await FinanceService.getAllTagihan(queryParams);
      return response.success(res, 200, 'Data tagihan SPP berhasil diambil', data, meta);
    } catch (err) { next(err); }
  },

  createTagihan: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await FinanceService.createTagihan(req.body, req.user.userId);
      return response.success(res, 201, 'Tagihan SPP berhasil dibuat', data);
    } catch (err) { next(err); }
  },

  uploadBuktiSpp: async (req, res, next) => {
    try {
      if (!req.file) {
        return response.error(res, 400, 'File bukti pembayaran wajib diupload');
      }
      // URL bisa disesuaikan dengan domain/host nantinya, untuk sekarang path relatif
      const fileUrl = `/public/uploads/bukti/${req.file.filename}`;
      const data = await FinanceService.uploadBuktiSpp(req.params.id, fileUrl);
      return response.success(res, 200, 'Bukti pembayaran berhasil diupload', data);
    } catch (err) { next(err); }
  },

  konfirmasiBuktiSpp: async (req, res, next) => {
    try {
      const { action } = req.body; // 'terima' atau 'tolak'
      if (!['terima', 'tolak'].includes(action)) {
        return response.error(res, 400, 'Aksi tidak valid, gunakan "terima" atau "tolak"');
      }
      const data = await FinanceService.konfirmasiBuktiSpp(req.params.id, action, req.user.userId);
      return response.success(res, 200, `Konfirmasi bukti pembayaran (${action}) berhasil`, data);
    } catch (err) { next(err); }
  },

  // ─── PEMBAYARAN ─────────────────────────────────────────────────────────────
  getAllPembayaran: async (req, res, next) => {
    try {
      const { data, meta } = await FinanceService.getAllPembayaran(req.query);
      return response.success(res, 200, 'Riwayat pembayaran berhasil diambil', data, meta);
    } catch (err) { next(err); }
  },

  getPembayaranById: async (req, res, next) => {
    try {
      const data = await FinanceService.getPembayaranById(req.params.id);
      return response.success(res, 200, 'Detail pembayaran berhasil diambil', data);
    } catch (err) { next(err); }
  },

  processPembayaran: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await FinanceService.processPembayaran(req.body, req.user.userId);
      return response.success(res, 201, 'Pembayaran berhasil diproses', data);
    } catch (err) { next(err); }
  },

  getLaporanBulanan: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(Object.assign(new Error('Validation failed'), { type: 'validation', errors: errors.array() }));
      const data = await FinanceService.getLaporanBulanan(req.query);
      return response.success(res, 200, 'Laporan keuangan bulanan berhasil diambil', data);
    } catch (err) { next(err); }
  }
};

module.exports = FinanceController;
