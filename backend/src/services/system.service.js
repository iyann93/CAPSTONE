'use strict';

const SystemRepository = require('../repositories/system.repository');
const AuthRepository = require('../repositories/auth.repository');

const SystemService = {
  getAuditLogs: async (filters) => {
    return SystemRepository.getAuditLogs(filters);
  },

  getAllRoles: async () => {
    const roles = await SystemRepository.getAllRoles();
    for (const role of roles) {
      role.permissions = await SystemRepository.getPermissionsForRole(role.id);
    }
    return roles;
  },

  getPendingUsers: async () => {
    return SystemRepository.getPendingUsers();
  },

  activateUser: async (userId) => {
    return SystemRepository.updateUserStatus(userId, true);
  },

  deactivateUser: async (userId) => {
    await AuthRepository.revokeAllUserTokens(userId);
    return SystemRepository.updateUserStatus(userId, false);
  },

  getAllUsers: async (filters) => {
    return SystemRepository.getAllUsers(filters);
  },

  getSiswaList: async () => {
    return SystemRepository.getSiswaList();
  },

  createUser: async (data) => {
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await SystemRepository.createUserWithRole({
      nama: data.nama,
      email: data.email,
      passwordHash: passwordHash,
      roleId: data.roleId,
      isActive: data.isActive !== undefined ? data.isActive : true,
      mustChangePassword: data.mustChangePassword,
      tanggalLahir: data.tanggal_lahir,
      jenisKelamin: data.jenis_kelamin,
      telepon: data.telepon,
      alamat: data.alamat
    });

    // Jika role Orang Tua dan ada siswaId, simpan relasi
    if (data.siswaId) {
      await SystemRepository.linkOrangTuaSiswa(user.id, data.siswaId);
    }

    return user;
  },

  updateUser: async (userId, data) => {
    await SystemRepository.updateUserWithRole(userId, {
      nama: data.nama,
      email: data.email,
      roleId: data.roleId,
      isActive: data.isActive,
      mustChangePassword: data.mustChangePassword,
      tanggalLahir: data.tanggal_lahir,
      jenisKelamin: data.jenis_kelamin,
      telepon: data.telepon,
      alamat: data.alamat
    });

    // Jika ada siswaId baru (update relasi orang tua)
    if (data.siswaId) {
      await SystemRepository.linkOrangTuaSiswa(userId, data.siswaId);
    }

    // Cabut token (force logout) jika akun dinonaktifkan / diset menunggu verifikasi
    if (data.isActive === false) {
      await AuthRepository.revokeAllUserTokens(userId);
    }

    return { id: userId };
  },

  deleteUser: async (userId) => {
    return SystemRepository.deleteUser(userId);
  }
};

module.exports = SystemService;
