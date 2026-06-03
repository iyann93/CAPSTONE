'use strict';

const SiswaRepository = require('../repositories/siswa.repository');
const { paginate } = require('../utils/queryBuilder');

const SiswaService = {
  getAll: async (query) => {
    const { page, limit, offset } = paginate(query);
    const { search, sort, kelas_id: kelasId, jenis_kelamin: jenisKelamin, is_active: isActive } = query;
    const { rows, total } = await SiswaRepository.findAll({ limit, offset, search, sort, kelasId, jenisKelamin, isActive });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getById: async (id) => {
    const data = await SiswaRepository.findById(id);
    if (!data) { const e = new Error('Siswa tidak ditemukan'); e.statusCode = 404; throw e; }
    return data;
  },

  create: async (body) => {
    const { nis, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, kelasId } = body;
    const existing = await SiswaRepository.findByNis(nis);
    if (existing) { const e = new Error('NIS sudah terdaftar'); e.statusCode = 409; throw e; }
    return SiswaRepository.create({ nis, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, kelasId });
  },

  update: async (id, body) => {
    await SiswaService.getById(id);
    const { nis, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, kelasId, isActive } = body;
    if (nis) {
      const dup = await SiswaRepository.findByNis(nis, id);
      if (dup) { const e = new Error('NIS sudah digunakan'); e.statusCode = 409; throw e; }
    }
    return SiswaRepository.update(id, { nis, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, kelasId, isActive });
  },

  delete: async (id) => {
    const deleted = await SiswaRepository.delete(id);
    if (!deleted) { const e = new Error('Siswa tidak ditemukan'); e.statusCode = 404; throw e; }
    return deleted;
  },
};

module.exports = SiswaService;
