'use strict';

const SppRepository = require('../repositories/spp.repository');
const PembayaranRepository = require('../repositories/pembayaran.repository');
const KomponenSppRepository = require('../repositories/komponen_spp.repository');
const { paginate } = require('../utils/queryBuilder');

const FinanceService = {
  // === KOMPONEN SPP ===
  getAllKomponenSpp: async () => {
    return KomponenSppRepository.findAll();
  },

  createKomponenSpp: async (body) => {
    return KomponenSppRepository.create(body);
  },

  updateKomponenSpp: async (id, body) => {
    const data = await KomponenSppRepository.update(id, body);
    if (!data) { const e = new Error('Komponen SPP tidak ditemukan'); e.statusCode = 404; throw e; }
    return data;
  },

  deleteKomponenSpp: async (id) => {
    const data = await KomponenSppRepository.delete(id);
    if (!data) { const e = new Error('Komponen SPP tidak ditemukan'); e.statusCode = 404; throw e; }
    return data;
  },

  generateTagihanBulanan: async (bulan, tahun, userId, kelasId = null) => {
    return KomponenSppRepository.generateBulanan(bulan, tahun, userId, kelasId);
  },

  // === SPP TAGIHAN ===
  getAllTagihan: async (query) => {
    const { page, limit, offset } = paginate(query);
    const { search, sort, siswa_id: siswaId, kelas_id: kelasId, bulan, tahun, status } = query;
    const { rows, total } = await SppRepository.findAllTagihan({ limit, offset, search, sort, siswaId, kelasId, bulan, tahun, status });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },
  
  createTagihan: async (body, userId) => {
    return SppRepository.createTagihan(body, userId);
  },

  // === PEMBAYARAN ===
  getAllPembayaran: async (query) => {
    const { page, limit, offset } = paginate(query);
    const { search, sort, tagihan_id: tagihanId, siswa_id: siswaId, metode, tanggal_awal: tanggalAwal, tanggal_akhir: tanggalAkhir } = query;
    const { rows, total } = await PembayaranRepository.findAll({ limit, offset, search, sort, tagihanId, siswaId, metode, tanggalAwal, tanggalAkhir });
    return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getPembayaranById: async (id) => {
    const data = await PembayaranRepository.findById(id);
    if (!data) { const e = new Error('Data pembayaran tidak ditemukan'); e.statusCode = 404; throw e; }
    return data;
  },

  processPembayaran: async (body, userId) => {
    return PembayaranRepository.processPembayaran(body, userId);
  },

  getLaporanBulanan: async (query) => {
    const { bulan, tahun } = query;
    if (!bulan || !tahun) { const e = new Error('Parameter bulan dan tahun wajib diisi'); e.statusCode = 400; throw e; }
    return PembayaranRepository.getLaporanBulanan(bulan, tahun);
  }
};

module.exports = FinanceService;
