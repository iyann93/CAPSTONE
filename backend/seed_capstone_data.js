require('dotenv').config();
const { pool } = require('./src/config/db');

// Valid UUIDs: 8-4-4-4-12 hex chars
const IDs = {
  TA:     '00000001-0000-0000-0000-000000000001',
  SEM:    '00000002-0000-0000-0000-000000000001',
  GURU1:  '00000003-0000-0000-0000-000000000001',
  GURU2:  '00000003-0000-0000-0000-000000000002',
  KELAS1: '00000004-0000-0000-0000-000000000001',
  KELAS2: '00000004-0000-0000-0000-000000000002',
  KELAS3: '00000004-0000-0000-0000-000000000003',
  // SISWA
  SISWA:  (n) => `00000005-0000-0000-0000-${String(n).padStart(12,'0')}`,
  // KOMPONEN SPP
  KSPP:   (n) => `00000006-0000-0000-0000-${String(n).padStart(12,'0')}`,
  // TAGIHAN
  TAG:    (n) => `00000007-0000-0000-0000-${String(n).padStart(12,'0')}`,
  // TRANSAKSI
  TX:     (n) => `00000008-0000-0000-0000-${String(n).padStart(12,'0')}`,
  // KOMPONEN GAJI
  KG:     (n) => `00000009-0000-0000-0000-${String(n).padStart(12,'0')}`,
  // SLIP GAJI
  SLIP:   (n) => `00000010-0000-0000-0000-${String(n).padStart(12,'0')}`,
};

// Existing user IDs from shared.users seed
const USERS = {
  GURU_MAPEL:  'a0000000-0000-0000-0000-000000000004',
  WALI_KELAS:  'a0000000-0000-0000-0000-000000000005',
  BENDAHARA:   'a0000000-0000-0000-0000-000000000006',
  KEPSEK:      'a0000000-0000-0000-0000-000000000002',
  WAKIL_KEP:   'a0000000-0000-0000-0000-000000000010',
};

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('🌱 Starting database seed...\n');

    // ── 1. TAHUN AJARAN ───────────────────────────────────────────────────────
    console.log('📅 Tahun Ajaran...');
    await client.query(`
      INSERT INTO academic.tahun_ajaran (id, nama, tanggal_mulai, tanggal_selesai, is_aktif)
      VALUES ($1, '2025/2026', '2025-07-15', '2026-06-28', true)
      ON CONFLICT (id) DO UPDATE SET is_aktif = true
    `, [IDs.TA]);
    console.log('  ✓');

    // ── 2. SEMESTER ───────────────────────────────────────────────────────────
    console.log('📚 Semester...');
    await client.query(`
      INSERT INTO academic.semester (id, tahun_ajaran_id, nomor, nama, tanggal_mulai, tanggal_selesai, is_aktif)
      VALUES ($1, $2, 2, 'Semester Genap 2025/2026', '2026-01-06', '2026-06-28', true)
      ON CONFLICT (id) DO UPDATE SET is_aktif = true
    `, [IDs.SEM, IDs.TA]);
    console.log('  ✓');

    // ── 3. GURU ───────────────────────────────────────────────────────────────
    console.log('👨‍🏫 Guru...');
    await client.query(`
      INSERT INTO academic.guru (id, user_id, nip, nama_lengkap, jenis_kelamin, status_kepegawaian, jabatan_tugas)
      VALUES
        ($1, $3, '198501012010011001', 'Dra. Sri Wahyuni',    'P', 'aktif', 'Guru Mapel'),
        ($2, $4, '198703152012012002', 'Ani Wulandari, S.Pd', 'P', 'aktif', 'Wali Kelas')
      ON CONFLICT (id) DO NOTHING
    `, [IDs.GURU1, IDs.GURU2, USERS.GURU_MAPEL, USERS.WALI_KELAS]);
    console.log('  ✓');

    // ── 4. KELAS ──────────────────────────────────────────────────────────────
    console.log('🏫 Kelas...');
    await client.query(`
      INSERT INTO academic.kelas (id, kode_kelas, nama_kelas, tingkat, wali_kelas_id, tahun_ajaran_id, kapasitas)
      VALUES
        ($1, 'VII-A',  'Kelas VII-A',  'VII',  $4, $7, 32),
        ($2, 'VIII-A', 'Kelas VIII-A', 'VIII', $5, $7, 32),
        ($3, 'IX-A',   'Kelas IX-A',  'IX',   $6, $7, 30)
      ON CONFLICT (id) DO NOTHING
    `, [IDs.KELAS1, IDs.KELAS2, IDs.KELAS3, IDs.GURU2, IDs.GURU1, IDs.GURU2, IDs.TA]);
    console.log('  ✓ 3 kelas');

    // ── 5. SISWA ──────────────────────────────────────────────────────────────
    console.log('🎓 Siswa...');
    // Check if siswa has kelas_id column
    const siswaCols = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema='academic' AND table_name='siswa'
    `);
    const colNames = siswaCols.rows.map(r => r.column_name);
    const hasKelasId = colNames.includes('kelas_id');

    if (!hasKelasId) {
      // Add kelas_id column
      console.log('  Adding kelas_id column to academic.siswa...');
      await client.query(`ALTER TABLE academic.siswa ADD COLUMN IF NOT EXISTS kelas_id UUID REFERENCES academic.kelas(id)`);
    }

    const siswaRows = [
      // [n, kelas_id, nisn, nis, nama_lengkap, jk, tahun_masuk]
      [1,  IDs.KELAS1, '0011234567', 'S001', 'Ahmad Fauzi',     'L', 2025],
      [2,  IDs.KELAS1, '0011234568', 'S002', 'Budi Santoso',    'L', 2025],
      [3,  IDs.KELAS1, '0011234569', 'S003', 'Citra Dewi',      'P', 2025],
      [4,  IDs.KELAS1, '0011234570', 'S004', 'Dian Pratiwi',    'P', 2025],
      [5,  IDs.KELAS2, '0011234571', 'S005', 'Eko Purnomo',     'L', 2024],
      [6,  IDs.KELAS2, '0011234572', 'S006', 'Fitri Handayani', 'P', 2024],
      [7,  IDs.KELAS2, '0011234573', 'S007', 'Gilang Ramadhan', 'L', 2024],
      [8,  IDs.KELAS3, '0011234574', 'S008', 'Hana Pertiwi',    'P', 2023],
      [9,  IDs.KELAS3, '0011234575', 'S009', 'Indra Kusuma',    'L', 2023],
      [10, IDs.KELAS3, '0011234576', 'S010', 'Joko Widodo Jr',  'L', 2023],
    ];

    for (const [n, kelasId, nisn, nis, nama, jk, tahun] of siswaRows) {
      await client.query(`
        INSERT INTO academic.siswa (id, kelas_id, nisn, nis, nama_lengkap, jenis_kelamin, tahun_masuk, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'aktif')
        ON CONFLICT (id) DO UPDATE SET kelas_id=$2, nama_lengkap=$5, status='aktif'
      `, [IDs.SISWA(n), kelasId, nisn, nis, nama, jk, tahun]);
    }
    console.log(`  ✓ ${siswaRows.length} siswa`);

    // ── 6. KOMPONEN SPP ───────────────────────────────────────────────────────
    console.log('💰 Komponen SPP...');
    const komponenSpp = [
      [1, 'SPP Bulanan Kelas VII',  300000, IDs.KELAS1],
      [2, 'SPP Bulanan Kelas VIII', 325000, IDs.KELAS2],
      [3, 'SPP Bulanan Kelas IX',   350000, IDs.KELAS3],
    ];
    for (const [n, nama, nominal, kelasId] of komponenSpp) {
      await client.query(`
        INSERT INTO finance.komponen_spp (id, nama, nominal, kelas_id, tahun_ajaran_id, is_aktif, denda, default_jatuh_tempo, catatan)
        VALUES ($1, $2, $3, $4, $5, true, 5000, 10, $6)
        ON CONFLICT (id) DO NOTHING
      `, [IDs.KSPP(n), nama, nominal, kelasId, IDs.TA, `Iuran SPP rutin bulanan - ${nama}`]);
    }
    console.log('  ✓ 3 komponen SPP');

    // ── 7. TAGIHAN SPP ────────────────────────────────────────────────────────
    console.log('📋 Tagihan SPP (Mei & Juni 2026)...');
    const kelasKompMap = {
      [IDs.KELAS1]: { kompId: IDs.KSPP(1), nominal: 300000 },
      [IDs.KELAS2]: { kompId: IDs.KSPP(2), nominal: 325000 },
      [IDs.KELAS3]: { kompId: IDs.KSPP(3), nominal: 350000 },
    };

    let tagNum = 1;
    const lunasTagIds = [];

    // Mei 2026 – siswa 1-7 lunas, 8-10 belum_bayar
    // nominal_akhir is a GENERATED ALWAYS column (computed as nominal - potongan)
    for (const [n, kelasId] of siswaRows.map(r => [r[0], r[1]])) {
      const { kompId, nominal } = kelasKompMap[kelasId];
      const status = n <= 7 ? 'lunas' : 'belum_bayar';
      const tagId  = IDs.TAG(tagNum);
      await client.query(`
        INSERT INTO finance.tagihan_spp
          (id, siswa_id, komponen_spp_id, bulan, tahun, nominal, potongan, status, jatuh_tempo, created_at, updated_at)
        VALUES ($1, $2, $3, 5, 2026, $4, 0, $5, '2026-05-10', NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `, [tagId, IDs.SISWA(n), kompId, nominal, status]);
      if (status === 'lunas') lunasTagIds.push({ id: tagId, nominal });
      tagNum++;
    }

    // Juni 2026 – semua belum_bayar
    for (const [n, kelasId] of siswaRows.map(r => [r[0], r[1]])) {
      const { kompId, nominal } = kelasKompMap[kelasId];
      await client.query(`
        INSERT INTO finance.tagihan_spp
          (id, siswa_id, komponen_spp_id, bulan, tahun, nominal, potongan, status, jatuh_tempo, created_at, updated_at)
        VALUES ($1, $2, $3, 6, 2026, $4, 0, 'belum_bayar', '2026-06-10', NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `, [IDs.TAG(tagNum), IDs.SISWA(n), kompId, nominal]);
      tagNum++;
    }
    console.log(`  ✓ ${tagNum - 1} tagihan (${lunasTagIds.length} lunas)`);

    // ── 8. TRANSAKSI PEMBAYARAN ───────────────────────────────────────────────
    console.log('💳 Transaksi Pembayaran...');
    const metodes = ['transfer', 'tunai', 'transfer', 'tunai', 'transfer', 'tunai', 'transfer'];
    for (const [i, t] of lunasTagIds.entries()) {
      await client.query(`
        INSERT INTO finance.transaksi_pembayaran
          (id, tagihan_id, dicatat_oleh, jumlah_bayar, metode, tanggal_bayar, no_referensi)
        VALUES ($1, $2, $3, $4, $5, $6::timestamptz, $7)
        ON CONFLICT (id) DO NOTHING
      `, [
        IDs.TX(i + 1), t.id, USERS.BENDAHARA, t.nominal,
        metodes[i % metodes.length],
        `2026-05-${String(i + 5).padStart(2,'0')}`,
        `REF-MEI26-${String(i + 1).padStart(4,'0')}`,
      ]);
    }
    console.log(`  ✓ ${lunasTagIds.length} transaksi`);

    // ── 9. KOMPONEN GAJI ──────────────────────────────────────────────────────
    console.log('💼 Komponen Gaji...');
    await client.query(`
      INSERT INTO finance.komponen_gaji (id, nama, tipe, kategori, formula_tipe, nilai_satuan, nominal_default, is_aktif)
      VALUES
        ($1, 'Gaji Pokok',          'gaji_pokok', 'umum', 'flat',              0,    3500000, true),
        ($2, 'Tunjangan Jabatan',   'tunjangan',  'umum', 'flat',              0,     750000, true),
        ($3, 'Tunjangan Transport', 'tunjangan',  'umum', 'flat',              0,     300000, true),
        ($4, 'Potongan BPJS TK',    'potongan',   'umum', 'persen_gaji_pokok', 2,          0, true),
        ($5, 'Potongan BPJS Kes',   'potongan',   'umum', 'persen_gaji_pokok', 1,          0, true),
        ($6, 'Lembur Per Jam',      'tunjangan',  'umum', 'per_jam',        25000,          0, true)
      ON CONFLICT (id) DO NOTHING
    `, [IDs.KG(1), IDs.KG(2), IDs.KG(3), IDs.KG(4), IDs.KG(5), IDs.KG(6)]);
    console.log('  ✓ 6 komponen gaji');

    // ── 10. SLIP GAJI ─────────────────────────────────────────────────────────
    console.log('📄 Slip Gaji (Mei 2026)...');
    const pegawai = [
      { uid: USERS.GURU_MAPEL, gaji: 3500000, status: 'dibayar' },
      { uid: USERS.WALI_KELAS, gaji: 3500000, status: 'dibayar' },
      { uid: USERS.KEPSEK,     gaji: 5000000, status: 'disetujui' },
      { uid: USERS.WAKIL_KEP,  gaji: 4000000, status: 'disetujui' },
      { uid: USERS.BENDAHARA,  gaji: 3200000, status: 'draft' },
    ];

    const transferredSlips = [];
    for (const [i, p] of pegawai.entries()) {
      const tunjangan = 750000 + 300000;
      const potongan  = parseFloat((p.gaji * 0.03).toFixed(2));
      const bersih    = p.gaji + tunjangan - potongan;
      const slipId    = IDs.SLIP(i + 1);
      await client.query(`
        INSERT INTO finance.slip_gaji (id, user_id, bulan, tahun, gaji_pokok, total_tunjangan, total_potongan, status, dibuat_at)
        VALUES ($1, $2, 5, 2026, $3, $4, $5, $6, NOW())
        ON CONFLICT (id) DO NOTHING
      `, [slipId, p.uid, p.gaji, tunjangan, potongan, p.status]);
      if (p.status === 'dibayar') transferredSlips.push({ id: slipId, amount: bersih });
    }
    console.log(`  ✓ ${pegawai.length} slip gaji`);

    // Transfer records
    for (const [i, s] of transferredSlips.entries()) {
      await client.query(`
        INSERT INTO finance.transfer_gaji (slip_gaji_id, jumlah, status, tanggal_transfer, no_referensi)
        VALUES ($1, $2, 'berhasil', '2026-05-25', $3)
        ON CONFLICT DO NOTHING
      `, [s.id, s.amount, `TRF-MEI26-${String(i + 1).padStart(4,'0')}`]);
    }
    console.log(`  ✓ ${transferredSlips.length} transfer gaji`);

    await client.query('COMMIT');
    console.log('\n✅ Seed selesai!\n');

    // Summary
    const c = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM academic.siswa)               AS siswa,
        (SELECT COUNT(*) FROM academic.kelas)               AS kelas,
        (SELECT COUNT(*) FROM finance.komponen_spp)         AS komponen_spp,
        (SELECT COUNT(*) FROM finance.tagihan_spp)          AS tagihan_spp,
        (SELECT COUNT(*) FROM finance.transaksi_pembayaran) AS transaksi,
        (SELECT COUNT(*) FROM finance.komponen_gaji)        AS komponen_gaji,
        (SELECT COUNT(*) FROM finance.slip_gaji)            AS slip_gaji,
        (SELECT COUNT(*) FROM finance.transfer_gaji)        AS transfer_gaji
    `);
    console.log('📊 Final counts:');
    console.table(c.rows[0]);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n❌ Seed FAILED:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
