'use strict';

const bcrypt = require('bcrypt');
const UsersRepository = require('../repositories/users.repository');

const SALT_ROUNDS = 10;
const PAGE_SIZE = 20;

const UsersService = {
  getAll: async ({ page = 1, limit = PAGE_SIZE }) => {
    const offset = (page - 1) * limit;
    const { rows, total } = await UsersRepository.findAll({ limit, offset });
    return {
      data: rows,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  getById: async (id) => {
    const user = await UsersRepository.findById(id);
    if (!user) {
      const err = new Error('User tidak ditemukan');
      err.statusCode = 404;
      throw err;
    }
    return user;
  },

  create: async ({ nama, email, password, noTelepon, alamatLengkap }) => {
    const existing = await UsersRepository.findByEmail(email);
    if (existing) {
      const err = new Error('Email sudah terdaftar');
      err.statusCode = 409;
      throw err;
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    return UsersRepository.create({ nama, email, passwordHash, noTelepon, alamatLengkap });
  },

  update: async (id, data) => {
    const existing = await UsersRepository.findById(id);
    if (!existing) {
      const err = new Error('User tidak ditemukan');
      err.statusCode = 404;
      throw err;
    }
    const updated = await UsersRepository.update(id, {
      nama: data.nama,
      noTelepon: data.no_telepon,
      alamatLengkap: data.alamat_lengkap,
      isActive: data.is_active,
    });
    return updated;
  },

  delete: async (id) => {
    const deleted = await UsersRepository.delete(id);
    if (!deleted) {
      const err = new Error('User tidak ditemukan');
      err.statusCode = 404;
      throw err;
    }
    return deleted;
  },
};

module.exports = UsersService;
