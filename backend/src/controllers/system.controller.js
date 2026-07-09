'use strict';

const SystemService = require('../services/system.service');
const EmailService = require('../services/email.service');
const response = require('../utils/response');

const SystemController = {
  getAuditLogs: async (req, res, next) => {
    try {
      const filters = { modul: req.query.modul };
      const logs = await SystemService.getAuditLogs(filters);
      return response.success(res, 200, 'Berhasil mengambil audit logs', logs);
    } catch (err) { next(err); }
  },

  getAllRoles: async (req, res, next) => {
    try {
      const roles = await SystemService.getAllRoles();
      return response.success(res, 200, 'Berhasil mengambil roles', roles);
    } catch (err) { next(err); }
  },

  getPendingUsers: async (req, res, next) => {
    try {
      const users = await SystemService.getPendingUsers();
      return response.success(res, 200, 'Berhasil mengambil pengguna pending/nonaktif', users);
    } catch (err) { next(err); }
  },

  activateUser: async (req, res, next) => {
    try {
      const user = await SystemService.activateUser(req.params.id);
      return response.success(res, 200, 'Berhasil mengaktivasi pengguna', user);
    } catch (err) { next(err); }
  },

  deactivateUser: async (req, res, next) => {
    try {
      const user = await SystemService.deactivateUser(req.params.id);
      return response.success(res, 200, 'Berhasil menonaktifkan pengguna', user);
    } catch (err) { next(err); }
  },

  getAllUsers: async (req, res, next) => {
    try {
      const users = await SystemService.getAllUsers();
      return response.success(res, 200, 'Berhasil mengambil semua pengguna', users);
    } catch (err) { next(err); }
  },

  getSiswaList: async (req, res, next) => {
    try {
      const siswa = await SystemService.getSiswaList();
      return response.success(res, 200, 'Berhasil mengambil daftar siswa', siswa);
    } catch (err) { next(err); }
  },

  createUser: async (req, res, next) => {
    try {
      const user = await SystemService.createUser(req.body);
      return response.success(res, 201, 'Berhasil membuat pengguna', user);
    } catch (err) { next(err); }
  },

  sendResetPasswordEmail: async (req, res, next) => {
    try {
      const userId = req.params.id;
      
      // Ambil data user dari database (kita butuh email dan nama)
      const users = await SystemService.getAllUsers(); // Atau method findById jika ada
      const user = users.find(u => String(u.id) === String(userId));
      
      if (!user) {
        return response.error(res, 404, 'Pengguna tidak ditemukan');
      }

      if (!user.email) {
        return response.error(res, 400, 'Pengguna ini tidak memiliki alamat email terdaftar.');
      }

      // Generate token dummy atau bisa save ke DB untuk divalidasi nanti
      const crypto = require('crypto');
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // Kirim email
      const userName = user.name || user.nama || 'Pengguna';
      await EmailService.sendResetPasswordEmail(user.email, userName, resetToken);
      
      return response.success(res, 200, 'Link reset password berhasil dikirim ke email pengguna.');
    } catch (err) { next(err); }
  },

  updateUser: async (req, res, next) => {
    try {
      const user = await SystemService.updateUser(req.params.id, req.body);
      return response.success(res, 200, 'Berhasil memperbarui pengguna', user);
    } catch (err) { next(err); }
  },

  deleteUser: async (req, res, next) => {
    try {
      await SystemService.deleteUser(req.params.id);
      return response.success(res, 200, 'Berhasil menghapus pengguna');
    } catch (err) { next(err); }
  }
};

module.exports = SystemController;
