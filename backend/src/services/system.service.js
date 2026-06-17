'use strict';

const SystemRepository = require('../repositories/system.repository');

const SystemService = {
  getAuditLogs: async (filters) => {
    return SystemRepository.getAuditLogs(filters);
  },

  getAllRoles: async () => {
    const roles = await SystemRepository.getAllRoles();
    // For each role, fetch permissions
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
    return SystemRepository.updateUserStatus(userId, false);
  },

  getAllUsers: async (filters) => {
    return SystemRepository.getAllUsers(filters);
  },

  createUser: async (data) => {
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(data.password, 10);
    return SystemRepository.createUserWithRole({
      nama: data.nama,
      email: data.email,
      passwordHash: passwordHash,
      roleId: data.roleId
    });
  },

  updateUser: async (userId, data) => {
    return SystemRepository.updateUserWithRole(userId, {
      nama: data.nama,
      email: data.email,
      roleId: data.roleId,
      isActive: data.isActive
    });
  },

  deleteUser: async (userId) => {
    return SystemRepository.deleteUser(userId);
  }
};

module.exports = SystemService;
