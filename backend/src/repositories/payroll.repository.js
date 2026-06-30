'use strict';

const { query, getClient } = require('../config/db');
const { whereBuilder, buildOrderBy } = require('../utils/queryBuilder');

// ─── Formula Engine ───────────────────────────────────────────────────────────
/**
 * Hitung nominal komponen berdasarkan formula_tipe & nilai_satuan
 * @param {object} kom  - Row dari finance.komponen_gaji
 * @param {object} vars - { gajiPokok, hariHadir, jumlahAlpha, jamLembur }
 * @returns {number}
 */
function hitungNominal(kom, { gajiPokok, hariHadir, jumlahAlpha, jamLembur }) {
  const satuan       = parseFloat(kom.nilai_satuan)   || 0;
  const nominalDef   = parseFloat(kom.nominal_default) || 0;

  switch (kom.formula_tipe) {
    case 'flat':
      return nominalDef;

    case 'per_hari_hadir':
      // Jika nilai_satuan ada (dari master komponen), pakai satuan * hari
      // Jika tidak, pakai nominal_default flat (sudah di-override dari template)
      if (satuan > 0) return hariHadir * satuan;
      return nominalDef; // flat dari template

    case 'per_alpha':
      if (satuan > 0) return jumlahAlpha * satuan;
      return nominalDef;

    case 'per_jam':
      return jamLembur * satuan;

    case 'persen_gaji_pokok':
      // nilai_satuan dianggap persen, misal 5 = 5%
      return (gajiPokok * satuan) / 100;

    default:
      return nominalDef;
  }
}

// ─── Repository ───────────────────────────────────────────────────────────────
const PayrollRepository = {

  // ── LIST / SEARCH ──────────────────────────────────────────────────────────
  findAllSlips: async ({ limit, offset, search, sort, userId, bulan, tahun, status }) => {
    const wb = whereBuilder();
    wb.addLike(search, ['u.nama', 'u.email']);
    wb.addExact(userId,  's.user_id');
    wb.addExact(bulan,   's.bulan');
    wb.addExact(tahun,   's.tahun');
    wb.addExact(status,  's.status');

    const { where, values, nextIdx } = wb.build();
    const orderBy = buildOrderBy(
      sort,
      { nama: 'u.nama', bulan: 's.bulan', tahun: 's.tahun', status: 's.status', gaji_bersih: 's.gaji_bersih' },
      's.tahun DESC, s.bulan DESC'
    );

    const sql = `
      SELECT
        s.id, s.user_id, s.bulan, s.tahun,
        s.gaji_pokok, s.total_tunjangan, s.total_potongan, s.gaji_bersih,
        s.status, s.dibuat_at,
        u.nama   AS user_nama,
        u.email  AS user_email
      FROM finance.slip_gaji s
      INNER JOIN shared.users u ON s.user_id = u.id
      ${where}
      ${orderBy}
      LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
    `;
    const countSql = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN s.status = 'dibayar' THEN 1 END) as dibayar,
        COUNT(CASE WHEN s.status != 'dibayar' THEN 1 END) as belum_dibayar
      FROM finance.slip_gaji s
      INNER JOIN shared.users u ON s.user_id = u.id
      ${where}
    `;

    const [data, countRes] = await Promise.all([
      query(sql, [...values, limit, offset]),
      query(countSql, values),
    ]);
    const total = parseInt(countRes.rows[0].total, 10) || 0;
    const dibayar = parseInt(countRes.rows[0].dibayar, 10) || 0;
    const belum_dibayar = parseInt(countRes.rows[0].belum_dibayar, 10) || 0;

    return { 
      rows: data.rows, 
      total, 
      summary: { total, dibayar, belum_dibayar } 
    };
  },


  // ── DETAIL BY ID (dengan detail komponen & transfer) ───────────────────────
  findSlipById: async (id) => {
    const sqlSlip = `
      SELECT
        s.*,
        u.nama  AS user_nama,
        u.email AS user_email
      FROM finance.slip_gaji s
      INNER JOIN shared.users u ON s.user_id = u.id
      WHERE s.id = $1
    `;
    const resSlip = await query(sqlSlip, [id]);
    if (resSlip.rows.length === 0) return null;

    const slip = resSlip.rows[0];

    // Detail komponen (tunjangan + potongan)
    const sqlDetail = `
      SELECT
        d.id, d.nominal, d.keterangan,
        k.id           AS komponen_id,
        k.nama         AS komponen_nama,
        k.tipe         AS komponen_tipe,
        k.kategori     AS komponen_kategori,
        k.formula_tipe,
        k.nilai_satuan
      FROM finance.detail_slip_gaji d
      INNER JOIN finance.komponen_gaji k ON d.komponen_gaji_id = k.id
      WHERE d.slip_gaji_id = $1
      ORDER BY k.tipe, k.nama
    `;
    const resDetail = await query(sqlDetail, [id]);
    slip.tunjangan = resDetail.rows.filter(r => r.komponen_tipe === 'tunjangan');
    slip.potongan  = resDetail.rows.filter(r => r.komponen_tipe === 'potongan');
    slip.details   = resDetail.rows;

    // Info transfer jika ada
    const sqlTransfer = `
      SELECT t.*, r.no_rekening, r.nama_bank
      FROM finance.transfer_gaji t
      LEFT JOIN finance.rekening_user r ON t.rekening_id = r.id
      WHERE t.slip_gaji_id = $1
    `;
    const resTransfer = await query(sqlTransfer, [id]);
    slip.transfer = resTransfer.rows[0] || null;

    return slip;
  },

  // ── GENERATE SLIP GAJI (PostgreSQL Transaction) ────────────────────────────
  generateSlip: async (data) => {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const {
        userId,
        bulan,
        tahun,
        gajiPokok,
        hariHadir   = 0,
        jumlahAlpha = 0,
        jamLembur   = 0,
      } = data;

      // 1. Validasi user exists & dapatkan jabatan_id
      const userCheck = await client.query(
        `SELECT id, jabatan_id FROM shared.users WHERE id = $1`,
        [userId]
      );
      if (userCheck.rows.length === 0) {
        const err = new Error('User tidak ditemukan');
        err.statusCode = 404;
        throw err;
      }
      const userJabatanId = userCheck.rows[0].jabatan_id;

      // 2. Cek slip periode yang sudah ada
      const checkSql = `
        SELECT id, status FROM finance.slip_gaji
        WHERE user_id = $1 AND bulan = $2 AND tahun = $3
        FOR UPDATE
      `;
      const checkRes = await client.query(checkSql, [userId, bulan, tahun]);

      if (checkRes.rows.length > 0) {
        const existing = checkRes.rows[0];
        if (existing.status !== 'draft') {
          const err = new Error(
            `Slip gaji periode ${bulan}/${tahun} sudah berstatus '${existing.status}' dan tidak dapat di-generate ulang.`
          );
          err.statusCode = 409;
          throw err;
        }
        // Hapus draft lama agar bisa generate ulang
        await client.query(
          'DELETE FROM finance.detail_slip_gaji WHERE slip_gaji_id = $1',
          [existing.id]
        );
        await client.query('DELETE FROM finance.slip_gaji WHERE id = $1', [existing.id]);
      }

      // 3. Ambil semua komponen gaji aktif
      const compRes = await client.query(
        `SELECT * FROM finance.komponen_gaji WHERE is_aktif = true ORDER BY tipe, nama`
      );
      const komponenList = compRes.rows;

      if (komponenList.length === 0) {
        const err = new Error('Tidak ada komponen gaji aktif yang terdaftar di sistem.');
        err.statusCode = 422;
        throw err;
      }

      // 4. Ambil template jabatan dan override pegawai
      let templates = {};
      if (userJabatanId) {
        const tRes = await client.query(
          `SELECT komponen_gaji_id, nominal FROM finance.template_gaji_jabatan WHERE jabatan_id = $1`,
          [userJabatanId]
        );
        for (const t of tRes.rows) templates[t.komponen_gaji_id] = parseFloat(t.nominal);
      }

      let overrides = {};
      const oRes = await client.query(
        `SELECT komponen_gaji_id, nominal FROM finance.pengaturan_gaji_user WHERE user_id = $1`,
        [userId]
      );
      for (const o of oRes.rows) overrides[o.komponen_gaji_id] = parseFloat(o.nominal);

      // Terapkan Template & Override ke nominal_default
      for (let kom of komponenList) {
        if (templates[kom.id] !== undefined) {
          kom.nominal_default = templates[kom.id];
        }
        if (overrides[kom.id] !== undefined) {
          kom.nominal_default = overrides[kom.id];
        }
      }

      // 5. Hitung setiap komponen sesuai formula_tipe
      let totalTunjangan = 0;
      let totalPotongan  = 0;
      const detailToInsert = [];

      // Dapatkan Gaji Pokok hasil akhir (karena bisa jadi Gaji Pokok juga di-override dan diperlukan untuk hitungan persen)
      let finalGajiPokok = gajiPokok || 0;
      // Cari komponen Gaji Pokok dari list (tipe tunjangan, nama mengandung 'gaji pokok')
      const komGajiPokok = komponenList.find(k =>
        k.nama?.toLowerCase().includes('gaji pokok')
      );
      if (komGajiPokok) {
        // Prioritaskan nilai dari template/override yang sudah diset ke nominal_default
        finalGajiPokok = parseFloat(komGajiPokok.nominal_default) || finalGajiPokok;
      }

      const vars = { gajiPokok: finalGajiPokok, hariHadir, jumlahAlpha, jamLembur };

      for (const kom of komponenList) {
        // Lewati Gaji Pokok agar tidak masuk ke detail tunjangan (mencegah double-counting)
        if (komGajiPokok && kom.id === komGajiPokok.id) continue;

        const nominal = hitungNominal(kom, vars);

        // Hanya masukkan jika nominal > 0
        if (nominal > 0) {
          if (kom.tipe === 'tunjangan')      totalTunjangan += nominal;
          else if (kom.tipe === 'potongan') totalPotongan  += nominal;

          detailToInsert.push({
            komponenGajiId: kom.id,
            nominal,
            keterangan: _buildKeterangan(kom, vars, nominal),
          });
        }
      }

      // 6. Hitung gaji bersih
      const gajiBersih = parseFloat((finalGajiPokok + totalTunjangan - totalPotongan).toFixed(2));

      // 7. Insert slip gaji (gaji_bersih adalah generated column, otomatis dihitung DB)
      const insertSlip = `
        INSERT INTO finance.slip_gaji
          (user_id, bulan, tahun, gaji_pokok, total_tunjangan, total_potongan, status, dibuat_at)
        VALUES ($1, $2, $3, $4, $5, $6, 'draft', NOW())
        RETURNING *
      `;
      const slipRes = await client.query(insertSlip, [
        userId, bulan, tahun,
        finalGajiPokok, totalTunjangan, totalPotongan,
      ]);
      const slip   = slipRes.rows[0];
      const slipId = slip.id;

      // 8. Insert detail komponen (batch)
      for (const det of detailToInsert) {
        await client.query(
          `INSERT INTO finance.detail_slip_gaji (slip_gaji_id, komponen_gaji_id, nominal, keterangan)
           VALUES ($1, $2, $3, $4)`,
          [slipId, det.komponenGajiId, det.nominal, det.keterangan]
        );
      }

      await client.query('COMMIT');

      return {
        ...slip,
        total_tunjangan:  totalTunjangan,
        total_potongan:   totalPotongan,
        gaji_bersih:      gajiBersih,
        jumlah_komponen:  detailToInsert.length,
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  // ── APPROVE SLIP (Draft → Approved) ────────────────────────────────────────
  approveSlip: async (slipGajiId) => {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const checkRes = await client.query(
        `SELECT id, status FROM finance.slip_gaji WHERE id = $1 FOR UPDATE`,
        [slipGajiId]
      );
      if (checkRes.rows.length === 0) {
        const err = new Error('Slip gaji tidak ditemukan'); err.statusCode = 404; throw err;
      }
      if (checkRes.rows[0].status !== 'draft') {
        const err = new Error(
          `Slip gaji tidak dapat di-approve. Status saat ini: '${checkRes.rows[0].status}' (hanya draft yang bisa di-approve).`
        );
        err.statusCode = 409;
        throw err;
      }

      const res = await client.query(
        `UPDATE finance.slip_gaji SET status = 'disetujui' WHERE id = $1 RETURNING *`,
        [slipGajiId]
      );

      await client.query('COMMIT');
      return res.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  // ── REVERT SLIP (Dibayar/Disetujui → Draft) ─────────────────────────────────
  revertSlip: async (slipGajiId) => {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const checkRes = await client.query(
        `SELECT id, status FROM finance.slip_gaji WHERE id = $1 FOR UPDATE`,
        [slipGajiId]
      );
      if (checkRes.rows.length === 0) {
        const err = new Error('Slip gaji tidak ditemukan'); err.statusCode = 404; throw err;
      }
      
      // Delete transfer record if exists
      await client.query(`DELETE FROM finance.transfer_gaji WHERE slip_gaji_id = $1`, [slipGajiId]);

      // Update status back to draft
      const res = await client.query(
        `UPDATE finance.slip_gaji SET status = 'draft' WHERE id = $1 RETURNING *`,
        [slipGajiId]
      );

      await client.query('COMMIT');
      return res.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  // ── TRANSFER GAJI (Approved → Transferred) ─────────────────────────────────
  transferGaji: async (data) => {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const { slipGajiId, noReferensi, rekeningId } = data;

      // Lock slip gaji row
      const slipRes = await client.query(
        `SELECT id, status, gaji_bersih, user_id, bulan, tahun
         FROM finance.slip_gaji WHERE id = $1 FOR UPDATE`,
        [slipGajiId]
      );

      if (slipRes.rows.length === 0) {
        const err = new Error('Slip gaji tidak ditemukan'); err.statusCode = 404; throw err;
      }

      const slip = slipRes.rows[0];
      if (slip.status === 'dibayar') {
        const err = new Error('Gaji untuk periode ini sudah ditransfer sebelumnya.'); err.statusCode = 409; throw err;
      }
      if (slip.status !== 'disetujui') {
        const err = new Error(
          `Slip gaji belum di-approve. Status saat ini: '${slip.status}'.`
        );
        err.statusCode = 422;
        throw err;
      }

      // Cek no_referensi duplicate
      const dupRef = await client.query(
        `SELECT id FROM finance.transfer_gaji WHERE no_referensi = $1`,
        [noReferensi]
      );
      if (dupRef.rows.length > 0) {
        const err = new Error(`No referensi '${noReferensi}' sudah digunakan.`); err.statusCode = 409; throw err;
      }

      // Insert transfer record
      const inSql = `
        INSERT INTO finance.transfer_gaji
          (slip_gaji_id, jumlah, status, tanggal_transfer, no_referensi, rekening_id)
        VALUES ($1, $2, 'Sukses', NOW(), $3, $4)
        RETURNING *
      `;
      const transRes = await client.query(inSql, [
        slipGajiId,
        slip.gaji_bersih,
        noReferensi,
        rekeningId || null,
      ]);

      // Update status slip → dibayar
      await client.query(
        `UPDATE finance.slip_gaji SET status = 'dibayar' WHERE id = $1`,
        [slipGajiId]
      );

      await client.query('COMMIT');

      return {
        ...transRes.rows[0],
        slip_info: {
          bulan:      slip.bulan,
          tahun:      slip.tahun,
          gaji_bersih: slip.gaji_bersih,
        },
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  // ── RIWAYAT GAJI per user ──────────────────────────────────────────────────
  findRiwayatByUser: async (userId) => {
    const sql = `
      SELECT
        s.id, s.bulan, s.tahun, s.gaji_pokok,
        s.total_tunjangan, s.total_potongan, s.gaji_bersih,
        s.status, s.dibuat_at,
        t.tanggal_transfer, t.no_referensi, t.status AS transfer_status
      FROM finance.slip_gaji s
      LEFT JOIN finance.transfer_gaji t ON t.slip_gaji_id = s.id
      WHERE s.user_id = $1
      ORDER BY s.tahun DESC, s.bulan DESC
    `;
    const res = await query(sql, [userId]);
    return res.rows;
  },

  // ── DELETE SLIP GAJI ────────────────────────────────────────────────────────
  deleteSlip: async (id) => {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      
      // Delete details first
      await client.query('DELETE FROM finance.detail_slip_gaji WHERE slip_gaji_id = $1', [id]);
      
      // Delete transfer if any
      await client.query('DELETE FROM finance.transfer_gaji WHERE slip_gaji_id = $1', [id]);
      
      // Delete slip
      const res = await client.query('DELETE FROM finance.slip_gaji WHERE id = $1 RETURNING *', [id]);
      
      await client.query('COMMIT');
      return res.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // ── BULK DELETE SLIP GAJI ───────────────────────────────────────────────────
  bulkDeleteSlips: async (ids) => {
    if (!ids || ids.length === 0) return 0;
    
    const client = await getClient();
    try {
      await client.query('BEGIN');
      
      const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
      
      // Delete details first
      await client.query(`DELETE FROM finance.detail_slip_gaji WHERE slip_gaji_id IN (${placeholders})`, ids);
      
      // Delete transfer if any
      await client.query(`DELETE FROM finance.transfer_gaji WHERE slip_gaji_id IN (${placeholders})`, ids);
      
      // Delete slips
      const res = await client.query(`DELETE FROM finance.slip_gaji WHERE id IN (${placeholders}) RETURNING id`, ids);
      
      await client.query('COMMIT');
      return res.rowCount;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
};

// ─── Helper: bangun keterangan detail ────────────────────────────────────────
function _buildKeterangan(kom, { hariHadir, jumlahAlpha, jamLembur, gajiPokok }, nominal) {
  switch (kom.formula_tipe) {
    case 'flat':
      return `Nominal tetap: Rp ${nominal.toLocaleString('id-ID')}`;
    case 'per_hari_hadir':
      return `${hariHadir} hari hadir × Rp ${parseFloat(kom.nilai_satuan).toLocaleString('id-ID')}`;
    case 'per_alpha':
      return `${jumlahAlpha} hari alpha × Rp ${parseFloat(kom.nilai_satuan).toLocaleString('id-ID')}`;
    case 'per_jam':
      return `${jamLembur} jam lembur × Rp ${parseFloat(kom.nilai_satuan).toLocaleString('id-ID')}`;
    case 'persen_gaji_pokok':
      return `${parseFloat(kom.nilai_satuan)}% × gaji pokok Rp ${parseFloat(gajiPokok).toLocaleString('id-ID')}`;
    default:
      return `Sistem: formula ${kom.formula_tipe}`;
  }
}

module.exports = PayrollRepository;
