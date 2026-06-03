'use strict';

const { body, query } = require('express-validator');

const createTagihanValidator = [
  body('siswaId').notEmpty().isUUID().withMessage('Siswa ID tidak valid'),
  body('komponenSppId').optional().isUUID(),
  body('bulan').notEmpty().isInt({ min: 1, max: 12 }),
  body('tahun').notEmpty().isInt({ min: 2000, max: 2100 }),
  body('nominal').notEmpty().isNumeric(),
  body('potongan').optional().isNumeric(),
  body('jatuhTempo').notEmpty().isISO8601().withMessage('Format tanggal jatuh_tempo tidak valid')
];

const createPembayaranValidator = [
  body('tagihanId').notEmpty().isUUID().withMessage('Tagihan ID tidak valid'),
  body('jumlahBayar').notEmpty().isNumeric(),
  body('metode').notEmpty().isString(),
  body('noReferensi').optional().isString(),
  body('keterangan').optional().isString()
];

const laporanBulananValidator = [
  query('bulan').notEmpty().isInt({ min: 1, max: 12 }),
  query('tahun').notEmpty().isInt({ min: 2000, max: 2100 })
];

module.exports = { createTagihanValidator, createPembayaranValidator, laporanBulananValidator };
