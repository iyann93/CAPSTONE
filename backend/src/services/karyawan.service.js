'use strict';

const KaryawanRepository = require('../repositories/karyawan.repository');

const PAGE_SIZE = 20;

const KaryawanService = {
  getAll: async ({ page = 1, limit = PAGE_SIZE }) => {
    const offset = (page - 1) * limit;
    const { rows, total } = await KaryawanRepository.findAll({ limit, offset });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getById: async (id) => {
    const data = await KaryawanRepository.findById(id);
    if (!data) {
      const err = new Error('Karyawan tidak ditemukan'); err.statusCode = 404; throw err;
    }
    return data;
  },

  create: async (body) => {
    const { nip, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, jabatan, departemen } = body;
    const existing = await KaryawanRepository.findByNip(nip);
    if (existing) {
      const err = new Error('NIP sudah terdaftar'); err.statusCode = 409; throw err;
    }
    return KaryawanRepository.create({ nip, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, jabatan, departemen });
  },

  update: async (id, body) => {
    const existing = await KaryawanRepository.findById(id);
    if (!existing) {
      const err = new Error('Karyawan tidak ditemukan'); err.statusCode = 404; throw err;
    }
    const { nip, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, jabatan, departemen, isActive } = body;
    return KaryawanRepository.update(id, { nip, nama, jenisKelamin, tanggalLahir, alamat, noTelepon, email, jabatan, departemen, isActive });
  },

  delete: async (id) => {
    const deleted = await KaryawanRepository.delete(id);
    if (!deleted) {
      const err = new Error('Karyawan tidak ditemukan'); err.statusCode = 404; throw err;
    }
    return deleted;
  },
};

module.exports = KaryawanService;
