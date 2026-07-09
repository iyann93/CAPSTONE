import React, { useState, useEffect } from "react";

const PeringkatKelasWali = ({ user }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [activeSemester, setActiveSemester] = useState(null);

  const [raporData, setRaporData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialization
  useEffect(() => {
    const init = async () => {
      try {
        const { default: api } = await import('../../api/axios');
        const [kelasRes, semRes] = await Promise.all([
          api.get('/kelas'),
          api.get('/semester')
        ]);
        const dbClasses = kelasRes.data?.data || [];
        setClasses(dbClasses);
        if (dbClasses.length > 0) setSelectedClassId(dbClasses[0].id);

        const active = (semRes.data?.data || []).find(s => s.is_aktif);
        setActiveSemester(active);
      } catch (e) {
        console.error("Gagal inisialisasi:", e);
      }
    };
    init();
  }, []);

  // Fetch data per class
  const fetchClassData = async () => {
    if (!selectedClassId || !activeSemester) return;
    setLoading(true);
    try {
      const { default: api } = await import('../../api/axios');
      const raporRes = await api.get(`/rapor/kelas/${selectedClassId}?semester_id=${activeSemester.id}`);
      
      const data = raporRes.data?.data || [];
      // Data dari backend sudah diurutkan: ORDER BY r.peringkat NULLS LAST, r.rata_rata DESC
      setRaporData(data);
    } catch (e) {
      console.error("Gagal mengambil data peringkat kelas:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassData();
  }, [selectedClassId, activeSemester]);

  // UI Helpers
  const getMedalIcon = (rank) => {
    if (rank === 1 || rank === '1') return <svg width="24" height="24" viewBox="0 0 24 24" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5"><path d="M12 15l-3 3h6l-3-3z"/><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.5-6.3-4.8-6.3 4.8 2.3-7.5-6-4.6h7.6z"/></svg>;
    if (rank === 2 || rank === '2') return <svg width="24" height="24" viewBox="0 0 24 24" fill="#9CA3AF" stroke="#6B7280" strokeWidth="1.5"><path d="M12 15l-3 3h6l-3-3z"/><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.5-6.3-4.8-6.3 4.8 2.3-7.5-6-4.6h7.6z"/></svg>;
    if (rank === 3 || rank === '3') return <svg width="24" height="24" viewBox="0 0 24 24" fill="#D97706" stroke="#92400E" strokeWidth="1.5"><path d="M12 15l-3 3h6l-3-3z"/><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.5-6.3-4.8-6.3 4.8 2.3-7.5-6-4.6h7.6z"/></svg>;
    return null;
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Peringkat Kelas</h1>
          <p className="text-[14px] text-gray-500 mt-1">Daftar peringkat siswa berdasarkan nilai rata-rata tertinggi di kelas.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
             <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-gray-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
             <span className="text-[13px] font-bold text-gray-600">{activeSemester?.nama || "Pilih Semester"}</span>
           </div>
           <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-white border border-gray-200 text-gray-700 text-[13px] font-bold rounded-lg focus:ring-[#1A3D63] focus:border-[#1A3D63] block p-2 outline-none cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>Kelas {cls.nama_kelas}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-gray-800">Ranking Siswa</h2>
            <p className="text-[12px] text-gray-500">Nilai akan otomatis ter-update saat rapor di-generate.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-12 flex flex-col items-center justify-center gap-3 text-gray-400">
                <svg className="animate-spin h-8 w-8 text-[#1A3D63]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm font-bold animate-pulse">Memuat data peringkat...</span>
             </div>
          ) : raporData.length === 0 ? (
             <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <h3 className="text-[16px] font-bold text-gray-800">Belum Ada Data Peringkat</h3>
                <p className="text-[13px] text-gray-400 mt-1 max-w-sm">Data peringkat akan muncul secara otomatis setelah Anda meng-generate rapor untuk kelas ini.</p>
             </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="py-4 px-6 text-[12px] font-bold text-gray-500 uppercase tracking-wider w-24 text-center">Peringkat</th>
                  <th className="py-4 px-6 text-[12px] font-bold text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                  <th className="py-4 px-6 text-[12px] font-bold text-gray-500 uppercase tracking-wider text-center">Rata-rata</th>
                  <th className="py-4 px-6 text-[12px] font-bold text-gray-500 uppercase tracking-wider text-center">Predikat</th>
                  <th className="py-4 px-6 text-[12px] font-bold text-gray-500 uppercase tracking-wider text-center">Status Rapor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {raporData.map((item, index) => {
                  const rank = item.peringkat ? parseInt(item.peringkat) : index + 1;
                  const isTop3 = rank <= 3;
                  const avatarBg = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-purple-500", "bg-indigo-500"][item.siswa_id.charCodeAt(0) % 6] || "bg-[#1A3D63]";

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 px-6 text-center">
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-black text-[15px] ${isTop3 ? 'bg-amber-50 shadow-sm border border-amber-100' : 'text-gray-500'}`}>
                          {isTop3 ? getMedalIcon(rank) : `#${rank}`}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white`}>
                            {item.siswa_nama[0]}
                          </div>
                          <div>
                            <h3 className={`text-[14px] font-bold ${isTop3 ? 'text-[#1A3D63]' : 'text-gray-800'}`}>{item.siswa_nama}</h3>
                            <p className="text-[11px] text-gray-400 font-medium">NIS: {item.nis || "-"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center justify-center px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg">
                          <span className="text-[14px] font-black text-gray-700">{item.rata_rata || "0.00"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-[13px] font-bold ${
                          item.nilai_kategori === 'A' ? 'bg-green-100 text-green-700' :
                          item.nilai_kategori === 'B' ? 'bg-blue-100 text-blue-700' :
                          item.nilai_kategori === 'C' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {item.nilai_kategori || "-"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${item.is_published ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-100 text-gray-500'}`}>
                          {item.is_published ? "Sudah Terbit" : "Draft"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeringkatKelasWali;
