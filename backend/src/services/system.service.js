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
  }
};

module.exports = SystemService;
