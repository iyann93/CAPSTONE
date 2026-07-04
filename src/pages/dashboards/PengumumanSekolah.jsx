import React, { useState, useEffect } from "react";
import { getTagihan } from "../../api/finance";

const BULAN_NAMES = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

const mockAnnouncements = [
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

const PengumumanSekolah = ({ user }) => {
  const [tab, setTab] = useState("Semua");
  const [search, setSearch] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [tunggakanList, setTunggakanList] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newAnn, setNewAnn] = useState({ title: "", date: "", author: "", category: "Akademik", importance: "Normal", desc: "", attachment: "" });

  const siswaId = user?.anak?.id;

  useEffect(() => {
    if (!siswaId) return;
    getTagihan({ siswa_id: siswaId, status: "belum_lunas" })
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        setTunggakanList(arr.filter(t => t.status === "belum_lunas" || t.status === "belum lunas"));
      })
      .catch(() => setTunggakanList([]));
  }, [siswaId]);

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
        <button onClick={() => setIsAdding(true)} className="bg-[#1A3D63] text-white px-4 py-2.5 rounded-xl text-[13px] font-bold shadow-sm hover:bg-[#122a46] transition-all flex items-center gap-2">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Buat Pengumuman Baru
        </button>
      </div>

      {/* Notifikasi Tunggakan SPP */}
      {tunggakanList.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 shadow-sm overflow-hidden animate-fadeIn">
          {/* Banner Header */}
          <div className="flex items-center gap-3 px-5 py-3 bg-red-600">
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z"/>
            </svg>
            <span className="text-white font-bold text-[14px]">
              Notifikasi Tagihan Tunggakan SPP ({tunggakanList.length} tagihan)
            </span>
          </div>
          {/* Tagihan List */}
          <div className="divide-y divide-red-100">
            {tunggakanList.map((t, idx) => {
              const bulanNama = BULAN_NAMES[(t.bulan ?? 1) - 1] || "-";
              const nominal = t.nominal ? `Rp ${Number(t.nominal).toLocaleString('id-ID')}` : "-";
              const jatuhTempo = t.jatuh_tempo ? new Date(t.jatuh_tempo).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : "-";
              const isOverdue = t.jatuh_tempo && new Date(t.jatuh_tempo) < new Date();
              return (
                <div key={t.id ?? idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" fill="none" stroke="#dc2626" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[13.5px] font-bold text-red-800">
                        Tagihan SPP — {bulanNama} {t.tahun ?? ""}
                      </p>
                      <p className="text-[12px] text-red-600 mt-0.5">
                        Nominal: <span className="font-bold">{nominal}</span>
                        <span className="mx-2 text-red-300">•</span>
                        Jatuh Tempo: <span className="font-bold">{jatuhTempo}</span>
                        {isOverdue && <span className="ml-2 px-1.5 py-0.5 bg-red-200 text-red-700 rounded text-[10px] font-bold">LEWAT JATUH TEMPO</span>}
                      </p>
                    </div>
                  </div>
                  <span className="flex-shrink-0 self-start sm:self-center px-3 py-1 bg-red-100 border border-red-200 rounded-lg text-[11px] font-bold text-red-700 uppercase tracking-wide">
                    Belum Lunas
                  </span>
                </div>
              );
            })}
          </div>
          <div className="px-5 py-3 bg-red-50 border-t border-red-100">
            <p className="text-[12px] text-red-500 leading-relaxed">
              ⚠️ Mohon segera melunasi tagihan di atas melalui menu <strong>Tagihan SPP</strong> agar tidak mengganggu proses administrasi sekolah.
            </p>
          </div>
        </div>
      )}

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
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-[#1e293b]">Buat Pengumuman Baru</h3>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Judul Pengumuman</label>
                <input type="text" value={newAnn.title} onChange={e => setNewAnn({...newAnn, title: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300" placeholder="Masukkan judul pengumuman" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Kategori</label>
                  <select value={newAnn.category} onChange={e => setNewAnn({...newAnn, category: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300">
                    <option value="Akademik">Akademik</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Penerimaan">Penerimaan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Urgensi</label>
                  <select value={newAnn.importance} onChange={e => setNewAnn({...newAnn, importance: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300">
                    <option value="Normal">Normal</option>
                    <option value="Penting">Penting</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Isi Pengumuman</label>
                <textarea rows="4" value={newAnn.desc} onChange={e => setNewAnn({...newAnn, desc: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300" placeholder="Tuliskan isi pengumuman secara detail..."></textarea>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Lampiran (Opsional)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mx-auto text-gray-400 mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  <span className="text-[12px] text-gray-500 font-medium">Klik untuk mengunggah file (PDF, JPG)</span>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setIsAdding(false)} className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 text-[13px] font-bold hover:bg-gray-50 transition-colors">Batal</button>
              <button onClick={() => {
                alert("Pengumuman baru berhasil diterbitkan!");
                setIsAdding(false);
              }} className="px-5 py-2 rounded-xl bg-[#1A3D63] text-white text-[13px] font-bold hover:bg-[#122a46] transition-colors flex items-center gap-2">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                Terbitkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PengumumanSekolah;



// trigger HMR
