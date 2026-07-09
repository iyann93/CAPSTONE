require('dotenv').config();
const { pool } = require('./src/config/db');
async function seed() {
  try {
    await pool.query(`
      INSERT INTO finance.operasional_transactions (tipe, tanggal, nama, kategori, nominal, sumber_dana, keterangan, bukti) VALUES 
      ('pemasukan', '2026-06-10', 'Pencairan Dana BOS Tahap 2', 'Dana BOS', 15000000, 'Pemerintah Pusat', 'Dana BOS Reguler tahap 2', '["bukti_bos.jpg"]'),
      ('pemasukan', '2026-06-15', 'Sumbangan Alumni', 'Donasi', 5000000, 'Donatur', 'Sumbangan untuk pembangunan masjid', '["bukti_transfer_donasi.pdf"]'),
      ('pengeluaran', '2026-06-24', 'Pembayaran Listrik PLN', 'Listrik', 1800000, 'Dana BOS', 'Pembayaran listrik bulan berjalan.', '["struk_listrik_juni.jpg", "struk_listrik_tambahan.jpg"]'),
      ('pengeluaran', '2026-06-25', 'Pembelian ATK', 'ATK', 650000, 'Dana Donatur', 'Kertas HVS, tinta printer.', '["nota_atk.pdf"]'),
      ('pengeluaran', '2026-06-26', 'Langganan Internet', 'Internet', 850000, 'Dana BOS', 'Indihome 100Mbps.', '["bukti_transfer_indihome.png"]')
    `);
    console.log('Seeded data operasional');
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
seed();
