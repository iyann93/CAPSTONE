import React, { useState, useEffect, useMemo } from "react";
import api from "../../api/axios";

const formatKelas = (kelas) => {
  if (!kelas) return '-';
  const k = kelas.toUpperCase();
  if (k.includes('VIII')) return 'VIII';
  if (k.includes('VII')) return 'VII';
  if (k.includes('IX')) return 'IX';
  return kelas;
};

const MonitoringSiswaKepsek = () => {
  const [data, setData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState({ kelas: "", semester: "", search: "" });
  const [selectedSiswa, setSelectedSiswa] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Panggil semua API secara paralel dan gunakan dummy fallback jika endpoint tidak ditemukan
      const [resSiswa, resKelas, resSem] = await Promise.all([
        api.get('/siswa').catch(() => ({ data: { data: [] } })),
        api.get('/kelas').catch(() => ({ data: { data: [] } })),
        api.get('/semester').catch(() => ({ data: { data: [] } }))
      ]);

      const dbClasses = resKelas.data?.data || [];
      setClasses(dbClasses);

      let dbSemesters = resSem.data?.data || [];
      if (dbSemesters.length === 0) {
        // Fallback jika API /semester belum tersedia dari Admin TU
        dbSemesters = [
          { id: "1", nama_semester: "Ganjil 2024/2025" },
          { id: "2", nama_semester: "Genap 2024/2025" },
          { id: "3", nama_semester: "Ganjil 2023/2024" },
          { id: "4", nama_semester: "Genap 2023/2024" }
        ];
      }
      setSemesters(dbSemesters);

      const allSiswa = resSiswa.data?.data || [];
      const mapped = allSiswa.map((s, idx) => ({
        id: s.id,
        nama: s.nama_lengkap,
        nisn: s.nisn || (s.nis + "000"),
        kelas: formatKelas(s.nama_kelas),
        kelasId: s.kelas_id,
        index: idx
      }));
      setData(mapped);
    } catch(e) {
      console.error("Error fetching data monitoring:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [nilaiSiswa, setNilaiSiswa] = useState({});
  const [absensiSiswa, setAbsensiSiswa] = useState({});
  const [loadingDetail, setLoadingDetail] = useState(false);
  
  const [selectedMapelData, setSelectedMapelData] = useState([]);
  const [loadingMapel, setLoadingMapel] = useState(false);

  useEffect(() => {
    const fetchClassDetail = async (isPolling = false) => {
      if (!filter.kelas || !filter.semester) return;
      try {
        if (!isPolling) setLoadingDetail(true);
        const t = Date.now();
        const [resNilai, resAbsensi] = await Promise.all([
          api.get(`/nilai/kelas/${filter.kelas}?semester_id=${filter.semester}&_t=${t}`).catch(() => ({ data: { data: [] } })),
          api.get(`/absensi?kelas_id=${filter.kelas}&semester_id=${filter.semester}&limit=2000&_t=${t}`).catch(() => ({ data: { data: [] } }))
        ]);
        
        const nilaiData = resNilai.data?.data || [];
        const nMap = {};
        nilaiData.forEach(n => {
           if (!nMap[n.siswa_id]) nMap[n.siswa_id] = { total: 0, count: 0 };
           const akhir = parseFloat(n.nilai_akhir);
           if (!isNaN(akhir)) {
             nMap[n.siswa_id].total += akhir;
             nMap[n.siswa_id].count += 1;
           }
        });
        setNilaiSiswa(nMap);

        const absensiData = resAbsensi.data?.data || [];
        const aMap = {};
        absensiData.forEach(a => {
           if (!aMap[a.siswa_id]) aMap[a.siswa_id] = { hadir: 0, total: 0 };
           aMap[a.siswa_id].total += 1;
           if (a.status === 'Hadir') aMap[a.siswa_id].hadir += 1;
        });
        setAbsensiSiswa(aMap);

      } catch (err) {
        console.error(err);
      } finally {
        if (!isPolling) setLoadingDetail(false);
      }
    };
    
    fetchClassDetail();
    const interval = setInterval(() => fetchClassDetail(true), 5000);
    return () => clearInterval(interval);
  }, [filter.kelas, filter.semester]);

  const filteredData = useMemo(() => {
    if (!filter.kelas || !filter.semester) return [];
    
    return data
      .filter(s => String(s.kelasId) === String(filter.kelas) || String(s.kelas) === String(filter.kelas))
      .filter(s => s.nama.toLowerCase().includes(filter.search.toLowerCase()))
      .map(s => {
        const nData = nilaiSiswa[s.id];
        const aData = absensiSiswa[s.id];

        let rataRata = "-";
        let status = "Belum Ada Nilai";
        
        if (nData && nData.count > 0) {
           const rata = nData.total / nData.count;
           rataRata = rata.toFixed(1);
           if (rata >= 90) status = "Sangat Baik";
           else if (rata >= 75) status = "Baik";
           else status = "Perlu Perhatian";
        }

        let kehadiran = "-";
        if (aData && aData.total > 0) {
           kehadiran = ((aData.hadir / aData.total) * 100).toFixed(0) + "%";
        }

        return {
          ...s,
          rataRata,
          kehadiran,
          status
        };
      });
  }, [data, filter, nilaiSiswa, absensiSiswa]);

  const getCatatanWali = (nisn) => {
    try {
      const saved = localStorage.getItem("wali_kelas_students");
      if (saved) {
        const parsed = JSON.parse(saved);
        for (const cls in parsed) {
          const student = parsed[cls].find(s => 
            s.id === nisn || s.nis === nisn || s.nisn === nisn || nisn.includes(s.id) || nisn.includes(s.nis)
          );
          if (student && student.note) return student.note;
        }
      }
    } catch (e) {}
    return "Siswa belum diberikan catatan khusus oleh Wali Kelas pada semester ini.";
  };

  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const fetchSiswaMapel = async () => {
      if (showDetailModal && selectedSiswa) {
        setLoadingMapel(true);
        try {
          const res = await api.get(`/nilai/siswa/${selectedSiswa.id}?semester_id=${filter.semester}`);
          setSelectedMapelData(res.data?.data || []);
        } catch (err) {
          setSelectedMapelData([]);
        } finally {
          setLoadingMapel(false);
        }
      }
    };
    fetchSiswaMapel();
  }, [showDetailModal, selectedSiswa, filter.semester]);

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fadeIn min-h-full relative">
      {/* Detail Modal Overlay */}
      {showDetailModal && selectedSiswa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-[95%] max-w-2xl shadow-xl flex flex-col overflow-hidden animate-slideUp">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#1A3D63] text-white">
              <h3 className="text-[16px] font-bold">Rapor Akademik Lengkap - {selectedSiswa.nama}</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-white/70 hover:text-white transition-colors">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold">
                  {selectedSiswa.nama.charAt(0)}
                </div>
                <div>
                  <h4 className="text-[16px] font-bold text-gray-800">{selectedSiswa.nama}</h4>
                  <p className="text-[13px] text-gray-500">NISN: {selectedSiswa.nisn} | Kelas: {selectedSiswa.kelas}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[11px] text-gray-400 font-bold uppercase">Semester</p>
                  <p className="text-[13px] font-bold text-[#1A3D63]">
                    {semesters.find(s => s.id === filter.semester)?.nama_semester || filter.semester}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-[14px] font-bold text-gray-700 mb-3">Distribusi Nilai Mata Pelajaran</h4>
                {loadingMapel ? (
                  <div className="text-center py-6 text-gray-500 text-[13px]">Memuat data nilai...</div>
                ) : selectedMapelData.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-[13px]">Belum ada data nilai mata pelajaran untuk siswa ini.</div>
                ) : (
                  <table className="w-full text-left border-collapse border border-gray-100 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr className="text-[12px] font-bold text-gray-500">
                        <th className="p-3 border-b border-gray-100">Mata Pelajaran</th>
                        <th className="p-3 border-b border-gray-100 text-center">KKM</th>
                        <th className="p-3 border-b border-gray-100 text-center">Nilai Akhir</th>
                        <th className="p-3 border-b border-gray-100 text-center">Predikat</th>
                      </tr>
                    </thead>
                    <tbody className="text-[13px] text-gray-700 divide-y divide-gray-50">
                      {selectedMapelData.map((item, i) => {
                        const nilai = parseFloat(item.nilai_akhir) || 0;
                        let predikat = "B";
                        if (nilai >= 90) predikat = "A";
                        else if (nilai < 75) predikat = "C";
                        return (
                          <tr key={i} className="hover:bg-gray-50/50">
                            <td className="p-3 font-semibold">{item.nama_mapel}</td>
                            <td className="p-3 text-center text-gray-500">75</td>
                            <td className="p-3 text-center font-bold text-[#1A3D63]">{nilai}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${predikat === 'A' ? 'bg-green-100 text-green-700' : predikat === 'B' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                {predikat}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <h5 className="text-[12px] font-bold text-green-700 mb-1">Catatan Wali Kelas</h5>
                    <p className="text-[13px] text-green-800 italic">"{getCatatanWali(selectedSiswa.id) || getCatatanWali(selectedSiswa.nisn)}"</p>
                 </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-right">
              <button onClick={() => setShowDetailModal(false)} className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-100 transition-colors shadow-sm">
                Tutup Dokumen
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Monitoring Siswa</span>
      </div>
      <div>
        <h1 className="text-[26px] font-bold text-[#1e293b]">Monitoring Perkembangan Siswa</h1>
        <p className="text-[14px] text-gray-500 mt-1">Pantau perkembangan nilai, kehadiran, dan aktivitas siswa secara individu berdasarkan filter Kelas dan Semester.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-end gap-5">
        <div className="flex-1 w-full min-w-[200px]">
          <label className="block text-[12px] font-bold text-gray-500 mb-2">Pilih Kelas</label>
          <select 
            value={filter.kelas} 
            onChange={(e) => {
              setFilter({...filter, kelas: e.target.value});
              setSelectedSiswa(null);
            }}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] block p-3 transition-colors cursor-pointer"
          >
            <option value="">-- Pilih Kelas --</option>
            {classes.length > 0 ? (
              classes.map(c => (
                <option key={c.id} value={c.id}>{c.nama_kelas}</option>
              ))
            ) : (
              <>
                <option value="VII A">VII A</option>
                <option value="VIII A">VIII A</option>
                <option value="IX A">IX A</option>
              </>
            )}
          </select>
        </div>
        
        <div className="flex-1 w-full min-w-[200px]">
          <label className="block text-[12px] font-bold text-gray-500 mb-2">Pilih Semester</label>
          <select 
            value={filter.semester} 
            onChange={(e) => {
              setFilter({...filter, semester: e.target.value});
              setSelectedSiswa(null);
            }}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] block p-3 transition-colors cursor-pointer"
          >
            <option value="">-- Pilih Semester --</option>
            {semesters.map(s => (
              <option key={s.id} value={s.id}>{s.nama_semester || s.nama}</option>
            ))}
          </select>
        </div>

        <div className="flex-[1.5] w-full min-w-[200px]">
          <label className="block text-[12px] font-bold text-gray-500 mb-2">Cari Nama Siswa</label>
          <input 
            type="text" 
            placeholder="Ketik nama siswa..."
            value={filter.search}
            onChange={(e) => setFilter({...filter, search: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] block p-3"
            disabled={!filter.kelas || !filter.semester}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
          {(!filter.kelas || !filter.semester) ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
               <div className="w-16 h-16 bg-blue-50 text-blue-300 rounded-full flex items-center justify-center mb-4">
                 <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
               </div>
               <p className="text-[15px] font-bold text-gray-700 mb-1">Silakan Pilih Filter</p>
               <p className="text-[13px] text-gray-500 max-w-sm">Anda harus memilih Kelas dan Semester terlebih dahulu pada formulir di atas untuk menampilkan data siswa.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-[13px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Siswa</th>
                    <th className="px-6 py-4">Rata-Rata</th>
                    <th className="px-6 py-4">Kehadiran</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-[14px]">
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-12"><div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#1A3D63] mb-2"></div><p className="text-gray-500 font-semibold">Menarik data dari database...</p></td></tr>
                  ) : filteredData.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-semibold">Tidak ada siswa yang sesuai pencarian.</td></tr>
                  ) : filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#EBF3FA] text-[#1A3D63] flex items-center justify-center font-bold shrink-0">
                            {item.nama.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{item.nama}</p>
                            <p className="text-[12px] text-gray-500">{item.nisn} • {item.kelas}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-700">{item.rataRata}</td>
                      <td className="px-6 py-4 text-gray-600">{item.kehadiran}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          item.status === "Sangat Baik" ? "bg-green-50 text-green-600 border border-green-100" :
                          item.status === "Perlu Perhatian" ? "bg-red-50 text-red-600 border border-red-100" :
                          "bg-blue-50 text-blue-600 border border-blue-100"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedSiswa(item)}
                          className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-colors ${
                            selectedSiswa?.id === item.id 
                              ? "bg-[#1A3D63] text-white shadow-md shadow-[#1A3D63]/20" 
                              : "bg-[#F4F6FA] text-[#1A3D63] hover:bg-[#EBF3FA]"
                          }`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {(!filter.kelas || !filter.semester) ? (
             <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
               <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4">
                 <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
               </div>
               <p className="text-[14px] text-gray-400 font-medium">Preview belum tersedia</p>
             </div>
          ) : selectedSiswa ? (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden animate-fadeIn sticky top-24">
              <div className="bg-[#1A3D63] p-6 text-white text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-3 border-2 border-white/50">
                  {selectedSiswa.nama.charAt(0)}
                </div>
                <h3 className="text-[20px] font-bold">{selectedSiswa.nama}</h3>
                <p className="text-[14px] text-blue-200 mt-1">{selectedSiswa.nisn} | {selectedSiswa.kelas}</p>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <h4 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-3">Ringkasan Akademik</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                      <p className="text-[11px] text-gray-500 mb-1">Rata-rata Nilai</p>
                      <p className="text-[20px] font-bold text-[#1A3D63]">{selectedSiswa.rataRata}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                      <p className="text-[11px] text-gray-500 mb-1">Kehadiran</p>
                      <p className="text-[20px] font-bold text-[#1A3D63]">{selectedSiswa.kehadiran}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-3">Aktivitas Terakhir</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-[13px] font-bold text-gray-800">Ujian Matematika</p>
                        <p className="text-[12px] text-gray-500">Nilai: 95 (Lulus KKM)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-[13px] font-bold text-gray-800">Tugas Sejarah</p>
                        <p className="text-[12px] text-gray-500">Dikumpulkan tepat waktu</p>
                      </div>
                    </div>
                    {selectedSiswa.rataRata < 70 && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-[13px] font-bold text-gray-800">Konseling BK</p>
                          <p className="text-[12px] text-gray-500">Dijadwalkan untuk penanganan nilai lambat</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => setShowDetailModal(true)}
                  className="w-full py-3 bg-[#EBF3FA] text-[#1A3D63] rounded-xl font-bold hover:bg-blue-100 transition-colors mt-2"
                >
                  Lihat Detail Lengkap
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
              <svg width="48" height="48" fill="none" stroke="#cbd5e1" strokeWidth="1.5" viewBox="0 0 24 24" className="mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <p className="text-[15px] font-bold text-gray-400">Pilih Siswa</p>
              <p className="text-[13px] text-gray-400 mt-1">Klik tombol "Lihat" pada tabel untuk memantau detail perkembangan akademik siswa.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonitoringSiswaKepsek;
