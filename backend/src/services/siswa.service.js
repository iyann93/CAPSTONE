'use strict';

const SiswaRepository = require('../repositories/siswa.repository');
const { paginate } = require('../utils/queryBuilder');

const SiswaService = {
  getAll: async (query) => {
    const { page, limit, offset } = paginate(query);
    const { search, sort, kelas_id: kelasId, jenis_kelamin: jenisKelamin, status } = query;
    const { rows, total } = await SiswaRepository.findAll({ limit, offset, search, sort, kelasId, jenisKelamin, status });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getById: async (id) => {
    const data = await SiswaRepository.findById(id);
    if (!data) { const e = new Error('Siswa tidak ditemukan'); e.statusCode = 404; throw e; }
    return data;
  },

  create: async (body) => {
    const { nis, nama_lengkap, jenisKelamin, tanggalLahir, alamat, status, kelasId } = body;
    const existing = await SiswaRepository.findByNis(nis);
    if (existing) { const e = new Error('NIS sudah terdaftar'); e.statusCode = 409; throw e; }
    return SiswaRepository.create({ nis, nama_lengkap, jenisKelamin, tanggalLahir, alamat, status, kelasId });
  },

  update: async (id, body) => {
    await SiswaService.getById(id);
    const { nis, nama_lengkap, jenisKelamin, tanggalLahir, alamat, status, kelasId } = body;
    if (nis) {
      const dup = await SiswaRepository.findByNis(nis, id);
      if (dup) { const e = new Error('NIS sudah digunakan'); e.statusCode = 409; throw e; }
    }
    return SiswaRepository.update(id, { nis, nama_lengkap, jenisKelamin, tanggalLahir, alamat, status, kelasId });
  },

  delete: async (id) => {
    const deleted = await SiswaRepository.delete(id);
    if (!deleted) { const e = new Error('Siswa tidak ditemukan'); e.statusCode = 404; throw e; }
    return deleted;
  },
};

module.exports = SiswaService;
