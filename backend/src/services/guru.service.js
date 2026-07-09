'use strict';

const GuruRepository = require('../repositories/guru.repository');
const { paginate } = require('../utils/queryBuilder');

const GuruService = {
  getAll: async (query) => {
    const { page, limit, offset } = paginate(query);
    const { search, sort, jenis_kelamin: jenisKelamin, is_active: isActive } = query;
    const { rows, total } = await GuruRepository.findAll({ limit, offset, search, sort, jenisKelamin, isActive });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getById: async (id) => {
    const data = await GuruRepository.findById(id);
    if (!data) { const e = new Error('Guru tidak ditemukan'); e.statusCode = 404; throw e; }
    return data;
  },

  create: async (body) => {
    const { nip, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, mataPelajaran } = body;
    const existing = await GuruRepository.findByNip(nip);
    if (existing) { const e = new Error('NIP sudah terdaftar'); e.statusCode = 409; throw e; }
    return GuruRepository.create({ nip, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, mataPelajaran });
  },

  update: async (id, body) => {
    await GuruService.getById(id);
    const { nip, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, mataPelajaran, isActive } = body;
    if (nip) {
      const dup = await GuruRepository.findByNip(nip, id);
      if (dup) { const e = new Error('NIP sudah digunakan'); e.statusCode = 409; throw e; }
    }
    return GuruRepository.update(id, { nip, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, mataPelajaran, isActive });
  },

  delete: async (id) => {
    const deleted = await GuruRepository.delete(id);
    if (!deleted) { const e = new Error('Guru tidak ditemukan'); e.statusCode = 404; throw e; }
    return deleted;
  },
};

module.exports = GuruService;
