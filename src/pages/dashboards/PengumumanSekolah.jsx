import React, { useState } from "react";

const mockAnnouncements = [
  {
    id: 1,
    title: "Jadwal Ujian Akhir Semester Genap TA 2023/2024",
    date: "20 Jun 2024",
    author: "Bpk. Drs. Wahyu (Waka Kurikulum)",
    category: "Akademik",
    importance: "Penting",
    desc: "Diberitahukan kepada seluruh Orang Tua/Wali siswa bahwa Ujian Akhir Semester Genap akan dilaksanakan mulai tanggal 24 Juni hingga 28 Juni 2024. Kartu ujian dapat diambil melalui TU mulai hari ini. Pastikan siswa mempersiapkan diri dengan baik dan hadir tepat waktu sesuai jadwal.",
    attachment: "Jadwal_UAS_Genap_2024.pdf"
  },
  {
    id: 2,
    title: "Pentas Seni & Bazar Kreativitas Siswa Akhir Tahun",
    date: "15 Jun 2024",
    author: "Ibu Indah Sari (Pembina OSIS)",
    category: "Kegiatan",
    importance: "Normal",
    desc: "Undangan resmi menghadiri acara Pentas Seni Akhir Tahun SMAN 1 Contoh yang diselenggarakan pada Sabtu, 22 Juni 2024. Acara ini akan menampilkan kreativitas seni, musik, dan bazar produk kewirausahaan siswa kelas X dan XI. Kehadiran Bapak/Ibu sangat kami harapkan untuk memberikan apresiasi.",
    attachment: "Undangan_Pensi_2024.pdf"
  },
  {
    id: 3,
    title: "Sosialisasi Program Kenaikan & Kelulusan Kelas XII",
    date: "10 Jun 2024",
    author: "Bpk. Drs. Ahmad Wijaya (Kepala Sekolah)",
    category: "Akademik",
    importance: "Penting",
    desc: "Rapat koordinasi dan pemaparan kriteria kenaikan kelas serta kelulusan akan dilaksanakan secara tatap muka di Aula Sekolah pada tanggal 14 Juni 2024 pukul 09.00 WIB. Pertemuan ini sangat penting guna membahas arah pendidikan anak ke depan serta penyelesaian administrasi akhir tahun.",
    attachment: "Panduan_Kelulusan_Kenaikan.pdf"
  },
  {
    id: 4,
    title: "Penerimaan Proposal Beasiswa Prestasi Semester Ganjil",
    date: "05 Jun 2024",
    author: "Ibu Siti Aminah (Bendahara)",
    category: "Penerimaan",
    importance: "Normal",
    desc: "Pengajuan beasiswa prestasi akademik dan non-akademik untuk periode semester ganjil tahun ajaran berikutnya telah dibuka. Bagi orang tua yang ingin mengajukan putra/putrinya silakan mengisi formulir beasiswa di portal web sekolah atau menghubungi ruang Bendahara.",
    attachment: "Formulir_Beasiswa_S1.pdf"
  }
];

const PengumumanSekolah = () => {
  const [tab, setTab] = useState("Semua");
  const [search, setSearch] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const filtered = mockAnnouncements.filter(ann => {
    const tabOk = tab === "Semua" || ann.category === tab;
    const searchOk = ann.title.toLowerCase().includes(search.toLowerCase()) || 
                     ann.desc.toLowerCase().includes(search.toLowerCase());
    return tabOk && searchOk;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb */}
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Pengumuman Sekolah</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Pengumuman Sekolah</h1>
          <p className="text-[14px] text-gray-500 mt-1">Informasi resmi terupdate dari pihak sekolah</p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: List of Announcements */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex gap-1.5 flex-wrap">
              {["Semua", "Akademik", "Kegiatan", "Penerimaan"].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${
                    tab === t ? "bg-[#1A3D63] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-auto">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                placeholder="Cari pengumuman..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-4 py-2 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 w-full md:w-52"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filtered.map(ann => (
              <div
                key={ann.id}
                onClick={() => setSelectedAnnouncement(ann)}
                className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md cursor-pointer transition-all ${
                  selectedAnnouncement?.id === ann.id ? "border-[#1A3D63] bg-blue-50/10" : "border-gray-100"
                }`}
              >
                <div className="flex justify-between items-start gap-4 mb-2 flex-wrap">
                  <div className="flex gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                      ann.importance === "Penting" ? "bg-red-50 text-red-600 border border-red-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                    }`}>
                      {ann.importance}
                    </span>
                    <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[10px] font-bold">
                      {ann.category}
                    </span>
                  </div>
                  <span className="text-[12px] text-gray-400">{ann.date}</span>
                </div>
                <h3 className="text-[15.5px] font-bold text-gray-800 hover:text-[#1A3D63] transition-colors">{ann.title}</h3>
                <p className="text-[13px] text-gray-500 line-clamp-2 mt-2 leading-relaxed">{ann.desc}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                  <span className="text-[11.5px] text-gray-400">Oleh: {ann.author}</span>
                  <span className="text-[12px] font-bold text-[#1A3D63] hover:underline flex items-center gap-1">
                    Baca Selengkapnya
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-500">
                Belum ada pengumuman untuk pencarian ini.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Detailed Announcement View */}
        <div className="space-y-4">
          {selectedAnnouncement ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 sticky top-6 animate-fadeIn">
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <h3 className="text-[14px] font-bold text-gray-700">Detail Pengumuman</h3>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                    selectedAnnouncement.importance === "Penting" ? "bg-red-50 text-red-600 border border-red-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}>
                    {selectedAnnouncement.importance}
                  </span>
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[10px] font-bold">
                    {selectedAnnouncement.category}
                  </span>
                </div>
                <h2 className="text-[18px] font-bold text-gray-800 leading-tight">{selectedAnnouncement.title}</h2>
                <div className="text-[12px] text-gray-400 space-y-0.5">
                  <p>Tanggal: {selectedAnnouncement.date}</p>
                  <p>Pembuat: {selectedAnnouncement.author}</p>
                </div>
                <p className="text-[13.5px] text-gray-600 leading-relaxed pt-2 whitespace-pre-line">{selectedAnnouncement.desc}</p>
                
                {selectedAnnouncement.attachment && (
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#475569" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span className="text-[12.5px] text-gray-600 truncate max-w-[150px]">{selectedAnnouncement.attachment}</span>
                    </div>
                    <button
                      onClick={() => alert(`Mengunduh berkas: ${selectedAnnouncement.attachment}`)}
                      className="text-[11px] font-bold text-[#1A3D63] hover:underline"
                    >
                      Unduh Lampiran
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center text-gray-400 h-60 flex flex-col justify-center items-center">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="mb-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <p className="text-[13px]">Pilih pengumuman di sebelah kiri untuk melihat detail isi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PengumumanSekolah;
