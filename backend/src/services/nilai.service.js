'use strict';

const NilaiRepository = require('../repositories/nilai.repository');
const { paginate } = require('../utils/queryBuilder');

const NilaiService = {
  getAll: async (query) => {
    const { page, limit, offset } = paginate(query);
    const { search, sort, siswa_id: siswaId, mata_pelajaran_id: mapelId, semester_id: semesterId, guru_id: guruId } = query;
    const { rows, total } = await NilaiRepository.findAll({ 
      limit, offset, search, sort, siswaId, mapelId, semesterId, guruId 
    });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getById: async (id) => {
    const data = await NilaiRepository.findById(id);
    if (!data) { const e = new Error('Data nilai tidak ditemukan'); e.statusCode = 404; throw e; }
    return data;
  },
  
  getBySiswa: async (siswaId, query) => {
    const { semester_id: semesterId } = query;
    const { page, limit, offset } = paginate(query);
    const { search, sort } = query;
    
    const { rows, total } = await NilaiRepository.findAll({ 
      limit, offset, search, sort, siswaId, semesterId 
    });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getByKelas: async (kelasId, query) => {
    const { semester_id: semesterId, mata_pelajaran_id: mapelId } = query;
    if (!semesterId) {
      const e = new Error('Parameter semester_id wajib diisi untuk rekap per kelas'); e.statusCode = 400; throw e;
    }
    const data = await NilaiRepository.findByKelas(kelasId, semesterId, mapelId);
    return data;
  },

  create: async (body, userId) => {
    const { siswaId, mataPelajaranId, semesterId, nilaiHarian, nilaiUts, nilaiUas, catatan } = body;
    // user.id dimasukkan sebagai guru_id karena yang menginput nilai biasanya adalah user Guru
    return NilaiRepository.create({ 
      siswaId, mataPelajaranId, semesterId, guruId: userId, 
      nilaiHarian, nilaiUts, nilaiUas, catatan 
    });
  },

  update: async (id, body) => {
    const { nilaiHarian, nilaiUts, nilaiUas, catatan } = body;
    return NilaiRepository.update(id, { nilaiHarian, nilaiUts, nilaiUas, catatan });
  },

  delete: async (id) => {
    const deleted = await NilaiRepository.delete(id);
    if (!deleted) { const e = new Error('Data nilai tidak ditemukan'); e.statusCode = 404; throw e; }
    return deleted;
  }
};

module.exports = NilaiService;
