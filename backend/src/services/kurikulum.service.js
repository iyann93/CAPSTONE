'use strict';

const KurikulumRepository = require('../repositories/kurikulum.repository');


const KurikulumService = {
  getAll: async (query) => {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    const result = await KurikulumRepository.findAll({
      limit,
      offset,
      search: query.search || '',
      sort: query.sort || '',
      tahunAjaranId: query.tahun_ajaran_id,
      status: query.status,
    });

    return {
      data: result.rows,
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  },

  getById: async (id) => {
    const data = await KurikulumRepository.findById(id);
    if (!data) throw new Error('Data kurikulum tidak ditemukan');
    return data;
  },

  create: async (payload) => {
    // Validate uniqueness of kode_kurikulum
    const existing = await KurikulumRepository.findByKode(payload.kode_kurikulum);
    if (existing) throw new ApiError(409, 'Kode kurikulum sudah digunakan');

    // Validate uniqueness of 'Aktif' status per tahun_ajaran_id
    if (payload.status === 'Aktif') {
      const activeCurriculums = await KurikulumRepository.findByStatusAndTahunAjaran('Aktif', payload.tahun_ajaran_id);
      if (activeCurriculums.length > 0) {
        throw new ApiError(400, 'Tahun Ajaran ini sudah memiliki Kurikulum berstatus Aktif. Silakan nonaktifkan yang lama terlebih dahulu.');
      }
    }
    const data = await KurikulumRepository.create(payload);
    return data;
  },

  update: async (id, payload) => {
    const existing = await KurikulumRepository.findById(id);
    if (!existing) throw new Error('Data kurikulum tidak ditemukan');

    if (payload.kode_kurikulum) {
      const dup = await KurikulumRepository.findByKode(payload.kode_kurikulum, id);
      if (dup) throw new ApiError(409, 'Kode kurikulum sudah digunakan');
    }

    const newStatus = payload.status !== undefined ? payload.status : existing.status;
    const newTahunAjaran = payload.tahun_ajaran_id !== undefined ? payload.tahun_ajaran_id : existing.tahun_ajaran_id;

    // Validate uniqueness of 'Aktif' status per tahun_ajaran_id
    if (newStatus === 'Aktif' && (newStatus !== existing.status || newTahunAjaran !== existing.tahun_ajaran_id)) {
      const activeCurriculums = await KurikulumRepository.findByStatusAndTahunAjaran('Aktif', newTahunAjaran);
      const otherActive = activeCurriculums.filter(c => c.id !== id);
      if (otherActive.length > 0) {
        throw new ApiError(400, 'Tahun Ajaran ini sudah memiliki Kurikulum berstatus Aktif. Silakan nonaktifkan yang lama terlebih dahulu.');
      }
    }

    const data = await KurikulumRepository.update(id, payload);
    return data;
  },

  delete: async (id) => {
    const existing = await KurikulumRepository.findById(id);
    if (!existing) throw new Error('Data kurikulum tidak ditemukan');
    
    // Deleting will just execute repo delete. The constraint is ON DELETE SET NULL on mapel.
    const data = await KurikulumRepository.delete(id);
    return data;
  }
};

module.exports = KurikulumService;
