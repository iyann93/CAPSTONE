'use strict';

const AbsensiRepository = require('../repositories/absensi.repository');
const { paginate } = require('../utils/queryBuilder');

const AbsensiService = {
  getAll: async (query) => {
    const { page, limit, offset } = paginate(query);
    const { search, sort, jadwal_id: jadwalId, siswa_id: siswaId, kelas_id: kelasId, status, tanggal } = query;
    const { rows, total } = await AbsensiRepository.findAll({ 
      limit, offset, search, sort, jadwalId, siswaId, kelasId, status, tanggal 
    });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getById: async (id) => {
    const data = await AbsensiRepository.findById(id);
    if (!data) { const e = new Error('Data absensi tidak ditemukan'); e.statusCode = 404; throw e; }
    return data;
  },

  create: async (body, userId) => {
    // Mendukung pengiriman array (bulk) atau objek tunggal
    const isBulk = Array.isArray(body);
    const dataToProcess = isBulk ? body : [body];
    
    // Pastikan status absensi valid di-handle di Validator, tapi di Service kita kirim ke DB
    const results = await AbsensiRepository.bulkUpsert(dataToProcess, userId);
    return isBulk ? results : results[0];
  },

  update: async (id, body, userId) => {
    await AbsensiService.getById(id);
    const { status, keterangan } = body;
    return AbsensiRepository.update(id, { status, keterangan, dicatatOleh: userId });
  },

  delete: async (id) => {
    const deleted = await AbsensiRepository.delete(id);
    if (!deleted) { const e = new Error('Data absensi tidak ditemukan'); e.statusCode = 404; throw e; }
    return deleted;
  },

  getRekapBulanan: async (query) => {
    const { bulan, tahun, kelas_id: kelasId } = query;
    if (!bulan || !tahun) {
      const e = new Error('Parameter bulan dan tahun wajib diisi'); e.statusCode = 400; throw e;
    }
    return AbsensiRepository.getRekapBulanan(bulan, tahun, kelasId);
  },

  getRekapSemester: async (query) => {
    const { semester_id: semesterId, kelas_id: kelasId } = query;
    if (!semesterId) {
      const e = new Error('Parameter semester_id wajib diisi'); e.statusCode = 400; throw e;
    }
    return AbsensiRepository.getRekapSemester(semesterId, kelasId);
  },

  getStatistik: async (query) => {
    const { start_date, end_date } = query;
    if (!start_date || !end_date) {
      const e = new Error('Parameter start_date dan end_date wajib diisi (Format: YYYY-MM-DD)'); e.statusCode = 400; throw e;
    }
    return AbsensiRepository.getStatistikGlobal(start_date, end_date);
  }
};

module.exports = AbsensiService;
