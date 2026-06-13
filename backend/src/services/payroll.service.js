'use strict';

const PayrollRepository = require('../repositories/payroll.repository');
const KomponenGajiRepository = require('../repositories/komponen_gaji.repository');
const { paginate } = require('../utils/queryBuilder');

const PAGE_SIZE = 20;

const PayrollService = {
  // ── GET ALL (dengan filter, pagination) ─────────────────────────────────────
  getAll: async (queryParams) => {
    const { page, limit, offset } = paginate(queryParams, PAGE_SIZE);
    const {
      search, sort,
      user_id: userId,
      bulan, tahun, status,
    } = queryParams;

    const { rows, total } = await PayrollRepository.findAllSlips({
      limit, offset, search, sort,
      userId, bulan, tahun, status,
    });

    return {
      data: rows,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  // ── GET DETAIL BY ID ────────────────────────────────────────────────────────
  getById: async (id) => {
    const data = await PayrollRepository.findSlipById(id);
    if (!data) {
      const err = new Error('Data slip gaji tidak ditemukan');
      err.statusCode = 404;
      throw err;
    }
    return data;
  },

  // ── GENERATE SLIP GAJI ──────────────────────────────────────────────────────
  generate: async (body) => {
    const {
      userId, bulan, tahun, gajiPokok,
      hariHadir   = 0,
      jumlahAlpha = 0,
      jamLembur   = 0,
    } = body;

    return PayrollRepository.generateSlip({
      userId,
      bulan:       parseInt(bulan, 10),
      tahun:       parseInt(tahun, 10),
      gajiPokok:   parseFloat(gajiPokok),
      hariHadir:   parseInt(hariHadir, 10),
      jumlahAlpha: parseInt(jumlahAlpha, 10),
      jamLembur:   parseInt(jamLembur, 10),
    });
  },

  // ── APPROVE SLIP ────────────────────────────────────────────────────────────
  approve: async (body) => {
    const { slipGajiId } = body;
    return PayrollRepository.approveSlip(slipGajiId);
  },

  // ── TRANSFER GAJI ───────────────────────────────────────────────────────────
  transfer: async (body) => {
    const { slipGajiId, noReferensi, rekeningId } = body;
    return PayrollRepository.transferGaji({ slipGajiId, noReferensi, rekeningId });
  },

  // ── RIWAYAT per User ─────────────────────────────────────────────────────────
  getRiwayat: async (userId) => {
    return PayrollRepository.findRiwayatByUser(userId);
  },

  // ── KOMPONEN GAJI (Pengaturan) ───────────────────────────────────────────────
  getAllKomponen: async () => {
    return KomponenGajiRepository.findAll();
  },

  createKomponen: async (data) => {
    return KomponenGajiRepository.create(data);
  },

  updateKomponen: async (id, data) => {
    const existing = await KomponenGajiRepository.findById(id);
    if (!existing) {
      const err = new Error('Komponen gaji tidak ditemukan');
      err.statusCode = 404;
      throw err;
    }
    return KomponenGajiRepository.update(id, data);
  },

  deleteKomponen: async (id) => {
    const existing = await KomponenGajiRepository.findById(id);
    if (!existing) {
      const err = new Error('Komponen gaji tidak ditemukan');
      err.statusCode = 404;
      throw err;
    }
    return KomponenGajiRepository.delete(id);
  },
};

module.exports = PayrollService;
