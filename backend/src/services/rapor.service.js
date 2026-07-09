'use strict';

const RaporRepository = require('../repositories/rapor.repository');

const RaporService = {
  getById: async (id) => {
    const data = await RaporRepository.findById(id);
    if (!data) { const e = new Error('Data rapor tidak ditemukan'); e.statusCode = 404; throw e; }
    return data;
  },
  
  getBySiswa: async (siswaId) => {
    return RaporRepository.findBySiswa(siswaId);
  },

  getByKelas: async (kelasId, semesterId) => {
    if (!semesterId) { const e = new Error('semester_id wajib diisi'); e.statusCode = 400; throw e; }
    return RaporRepository.findByKelas(kelasId, semesterId);
  },

  generate: async (body, userId) => {
    const { mode, kelasId, semesterId, siswaId, keteranganWali } = body;
    
    if (mode === 'kelas') {
      if (!kelasId) { const e = new Error('kelasId wajib diisi untuk mode kelas'); e.statusCode = 400; throw e; }
      const res = await RaporRepository.generatePerKelas(kelasId, semesterId, userId);
      return { message: `Berhasil meng-generate rapor untuk ${res.count} siswa beserta pemeringkatannya.` };
    } 
    else if (mode === 'siswa') {
      if (!siswaId || !kelasId) { const e = new Error('siswaId dan kelasId wajib diisi untuk mode siswa'); e.statusCode = 400; throw e; }
      const res = await RaporRepository.generatePerSiswa(siswaId, semesterId, kelasId, userId, keteranganWali);
      return res;
    }
    
    const e = new Error('Mode generate tidak valid (gunakan "kelas" atau "siswa")'); e.statusCode = 400; throw e;
  },

  publish: async (body, userId) => {
    const { kelasId, semesterId, siswaId } = body;
    const published = await RaporRepository.publish(kelasId, semesterId, userId, siswaId);
    if (published.length === 0) {
      return { message: 'Tidak ada rapor yang perlu dipublish (sudah dipublish atau belum di-generate).' };
    }
    if (siswaId) return { message: 'Berhasil mem-publish rapor siswa ini.' };
    return { message: `Berhasil mem-publish ${published.length} rapor kelas ini.` };
  },

  unpublish: async (siswaId, semesterId) => {
    return RaporRepository.unpublish(siswaId, semesterId);
  }
};

module.exports = RaporService;
