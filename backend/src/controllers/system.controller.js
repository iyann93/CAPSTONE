'use strict';

const SystemService = require('../services/system.service');
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

  createUser: async (req, res, next) => {
    try {
      const user = await SystemService.createUser(req.body);
      return response.success(res, 201, 'Berhasil membuat pengguna', user);
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
