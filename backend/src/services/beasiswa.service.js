'use strict';

const BeasiswaRepository = require('../repositories/beasiswa.repository');
const { paginate } = require('../utils/queryBuilder');

const BeasiswaService = {
  getAll: async (queryOpts) => {
    const { page, limit, offset } = paginate(queryOpts);
    const { rows, total } = await BeasiswaRepository.findAll({
      limit,
      offset,
      search: queryOpts.search,
      sort: queryOpts.sort,
      siswaId: queryOpts.siswa_id,
      status: queryOpts.status
    });

    return {
      data: rows,
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  },

  getById: async (id) => {
    const data = await BeasiswaRepository.findById(id);
    if (!data) {
      const err = new Error('Beasiswa tidak ditemukan');
      err.statusCode = 404;
      throw err;
    }
    return data;
  },

  create: async (data) => {
    return await BeasiswaRepository.create({
      ...data,
      nominal: parseFloat(data.nominal),
    });
  },

  update: async (id, data) => {
    // Check exist
    await BeasiswaService.getById(id);
    
    return await BeasiswaRepository.update(id, {
      ...data,
      nominal: data.nominal ? parseFloat(data.nominal) : undefined,
    });
  },

  delete: async (id) => {
    await BeasiswaService.getById(id);
    return await BeasiswaRepository.delete(id);
  }
};

module.exports = BeasiswaService;
