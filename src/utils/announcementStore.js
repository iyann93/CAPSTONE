// announcementStore.js
// Shared utility untuk menyimpan dan membaca pengumuman sekolah via localStorage

const STORAGE_KEY = 'school_announcements';

export const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Jadwal Ujian Akhir Semester Genap TA 2023/2024",
    date: "20 Jun 2024",
    author: "Drs. Wahyu (Waka Kurikulum)",
    category: "Akademik",
    importance: "Penting",
    desc: "Diberitahukan kepada seluruh Orang Tua/Wali siswa bahwa Ujian Akhir Semester Genap akan dilaksanakan mulai tanggal 24 Juni hingga 28 Juni 2024. Kartu ujian dapat diambil melalui TU mulai hari ini. Pastikan siswa mempersiapkan diri dengan baik dan hadir tepat waktu sesuai jadwal.",
    attachment: "Jadwal_UAS_Genap_2024.pdf"
  },
  {
    id: 2,
    title: "Pentas Seni & Bazar Kreativitas Siswa Akhir Tahun",
    date: "15 Jun 2024",
    author: "Indah Sari (Pembina OSIS)",
    category: "Kegiatan",
    importance: "Normal",
    desc: "Undangan resmi menghadiri acara Pentas Seni Akhir Tahun MBS Prambanan yang diselenggarakan pada Sabtu, 22 Juni 2024. Acara ini akan menampilkan kreativitas seni, musik, dan bazar produk kewirausahaan siswa kelas VIII dan IX. Kehadiran Bapak/Ibu sangat kami harapkan untuk memberikan apresiasi.",
    attachment: "Undangan_Pensi_2024.pdf"
  },
  {
    id: 3,
    title: "Sosialisasi Program Kenaikan & Kelulusan Kelas IX",
    date: "10 Jun 2024",
    author: "Drs. Ahmad Wijaya (Kepala Sekolah)",
    category: "Akademik",
    importance: "Penting",
    desc: "Rapat koordinasi dan pemaparan kriteria kenaikan kelas serta kelulusan akan dilaksanakan secara tatap muka di Aula Sekolah pada tanggal 14 Juni 2024 pukul 09.00 WIB. Pertemuan ini sangat penting guna membahas arah pendidikan anak ke depan serta penyelesaian administrasi akhir tahun.",
    attachment: "Panduan_Kelulusan_Kenaikan.pdf"
  },
  {
    id: 4,
    title: "Penerimaan Proposal Beasiswa Prestasi Semester Ganjil",
    date: "05 Jun 2024",
    author: "Siti Aminah (Bendahara)",
    category: "Penerimaan",
    importance: "Normal",
    desc: "Pengajuan beasiswa prestasi akademik dan non-akademik untuk periode semester ganjil tahun ajaran berikutnya telah dibuka. Bagi orang tua yang ingin mengajukan putra/putrinya silakan mengisi formulir beasiswa di portal web sekolah atau menghubungi ruang Bendahara.",
    attachment: "Formulir_Beasiswa_S1.pdf"
  }
];

/**
 * Ambil semua pengumuman dari localStorage.
 * Jika belum ada, inisialisasi dengan DEFAULT_ANNOUNCEMENTS.
 */
export function getAnnouncements() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Inisialisasi dengan data default
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ANNOUNCEMENTS));
      return DEFAULT_ANNOUNCEMENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_ANNOUNCEMENTS;
  } catch {
    return DEFAULT_ANNOUNCEMENTS;
  }
}

/**
 * Simpan array pengumuman ke localStorage.
 */
export function saveAnnouncements(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save announcements:', e);
  }
}

/**
 * Tambah pengumuman baru.
 * Author dan tanggal diisi otomatis jika tidak disertakan.
 */
export function addAnnouncement(ann) {
  const list = getAnnouncements();
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const newAnn = {
    ...ann,
    id: Date.now(),
    date: ann.date || dateStr,
  };
  const updated = [newAnn, ...list];
  saveAnnouncements(updated);
  return updated;
}

/**
 * Hapus pengumuman berdasarkan id.
 */
export function deleteAnnouncement(id) {
  const list = getAnnouncements();
  const updated = list.filter(a => a.id !== id);
  saveAnnouncements(updated);
  return updated;
}

/**
 * Ubah status aktif/nonaktif pengumuman.
 */
export function toggleAnnouncementStatus(id) {
  const list = getAnnouncements();
  const updated = list.map(a => {
    if (a.id === id) {
      return { ...a, isActive: a.isActive === false ? true : false };
    }
    return a;
  });
  saveAnnouncements(updated);
  return updated;
}

/**
 * Edit pengumuman yang sudah ada.
 */
export function editAnnouncement(id, updatedData) {
  const list = getAnnouncements();
  const updated = list.map(a => {
    if (a.id === id) {
      return { ...a, ...updatedData };
    }
    return a;
  });
  saveAnnouncements(updated);
  return updated;
}
