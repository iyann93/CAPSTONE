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

  create: async ({ nis, nisn, nama_lengkap, jenisKelamin, tempatLahir, tanggalLahir, alamat, status, kelasId }) => {
    // Check if NIS already exists
    const existing = await SiswaRepository.findByNis(nis);
    if (existing) {
      const err = new Error('NIS sudah terdaftar');
      err.statusCode = 400;
      throw err;
    }
    return await SiswaRepository.create({ nis, nisn, nama_lengkap, jenisKelamin, tempatLahir, tanggalLahir, alamat, status, kelasId });
  },

  update: async (id, { nis, nisn, nama_lengkap, jenisKelamin, tempatLahir, tanggalLahir, alamat, status, kelasId }) => {
    const existing = await SiswaRepository.findById(id);
    if (!existing) {
      const err = new Error('Data siswa tidak ditemukan');
      err.statusCode = 404;
      throw err;
    }
    // Check NIS conflict
    if (nis) {
      const nisConflict = await SiswaRepository.findByNis(nis, id);
      if (nisConflict) {
        const err = new Error('NIS sudah terdaftar untuk siswa lain');
        err.statusCode = 400;
        throw err;
      }
    }
    return await SiswaRepository.update(id, { nis, nama_lengkap, jenisKelamin, tempatLahir, tanggalLahir, alamat, status, kelasId });
  },

  delete: async (id) => {
    const deleted = await SiswaRepository.delete(id);
    if (!deleted) { const e = new Error('Siswa tidak ditemukan'); e.statusCode = 404; throw e; }
    return deleted;
  },
};

module.exports = SiswaService;
