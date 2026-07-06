import React, { useState } from "react";



function autoStatus(s) {
  if (s.nilai >= 70 && s.kehadiran >= 80 && s.mapel <= 2) return "Naik Kelas";
  return "Tidak Naik";
}

const GradePromotionDetail = ({ setView, classData, mode = "process", onSave }) => {
  const isSelesai = mode === "selesai" || classData?.status === "Selesai";
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchStudentsAndState = async () => {
      setLoading(true);
      try {
        const key = `grade_promotion_students_${classData?.kode || "default"}`;
        const savedStr = localStorage.getItem(key);
        const savedState = savedStr ? JSON.parse(savedStr) : null;

        const { default: api } = await import('../../api/axios');
        const resSiswa = await api.get('/siswa');
        const allSiswa = resSiswa.data?.data || [];
        const classSiswa = allSiswa.filter(s => s.kelas_id === classData?.kode);

        // If no students in DB for this class, fallback to dynamic mock data
        let baseStudents = [];
        const count = classSiswa.length > 0 ? classSiswa.length : (classData?.total || 36);
        
        for (let i = 0; i < count; i++) {
          const actual = classSiswa[i];
          const nama = actual ? actual.nama_lengkap : `Siswa ${classData?.kelas || "Kelas VII"} ${i + 1}`;
          const nis = actual ? actual.nis : `20231${i.toString().padStart(2, '0')}`;
          const init = nama.charAt(0).toUpperCase();
          const color = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-teal-500", "bg-pink-500"][i % 6];
          
          let status = isSelesai ? "Naik Kelas" : "Belum Ditentukan";
          
          if (savedState) {
            const savedStudent = savedState.find(s => s.nis === nis);
            if (savedStudent) status = savedStudent.status;
          }

          baseStudents.push({
            no: i + 1,
            nis,
            nama,
            init,
            color,
            nilai: 75 + (i % 20),
            kehadiran: 85 + (i % 15),
            mapel: i % 3,
            status
          });
        }
        setStudents(baseStudents);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (classData) fetchStudentsAndState();
  }, [classData, isSelesai]);

  const [activeTab, setActiveTab] = useState("Semua");
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const tabs = ["Semua","Naik Kelas","Tidak Naik","Belum Ditentukan"];
  const naik = students.filter(s => s.status === "Naik Kelas").length;
  const tidakNaik = students.filter(s => s.status === "Tidak Naik").length;
  const belum = students.filter(s => s.status === "Belum Ditentukan").length;
  const pct = Math.round(((naik + tidakNaik) / students.length) * 100);

  const filtered = students.filter(s => {
    const tabOk = activeTab === "Semua" || s.status === activeTab;
    const searchOk = s.nama.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search);
    return tabOk && searchOk;
  });

  const handleProses = () => {
    if (processing || processed) return;
    setProcessing(true);
    setStudents(prev => prev.map(s => ({ ...s, status: autoStatus(s) })));
    setProcessing(false);
    setProcessed(true);
  };

  const handleToggleStatus = (nis) => {
    setStudents(prev => prev.map(s => {
      if (s.nis === nis) {
        const nextStatus = s.status === "Naik Kelas" ? "Tidak Naik" : "Naik Kelas";
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const handleSaveDecision = async () => {
    const key = `grade_promotion_students_${classData?.kode || "default"}`;
    localStorage.setItem(key, JSON.stringify(students));
    
    try {
      const { default: api } = await import('../../api/axios');
      const res = await api.get('/system/frontend-state');
      const currentState = res.data?.data || {};
      await api.put('/system/frontend-state', {
        ...currentState,
        [key]: students
      });
    } catch (err) {
      console.error("Gagal menyimpan data siswa ke database", err);
    }
    
    const totalCount = students.length;
    const naikCount = students.filter(s => s.status === "Naik Kelas").length;
    const tidakNaikCount = students.filter(s => s.status === "Tidak Naik").length;
    const belumCount = students.filter(s => s.status === "Belum Ditentukan").length;
    const status = belumCount === 0 ? "Selesai" : "Dalam Proses";
    
    if (onSave) {
      onSave(classData.kode, {
        naik: naikCount,
        tidakNaik: tidakNaikCount,
        belum: belumCount,
        status: status
      });
    }
  };

  return (
    <div className="p-6 md:p-8 animate-fadeIn bg-[#F4F6FA] min-h-full">

      {/* Breadcrumb */}
      <div className="text-[13px] font-medium text-gray-400 mb-4">
        Dashboard &gt; <button onClick={() => setView("list")} className="text-gray-500 hover:text-[#2A4365]">Kenaikan Kelas</button> &gt; <span className="text-[#2A4365] font-semibold">{classData?.kelas || "Kelas VII A"}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
        <div className="flex items-start gap-3">
          <button onClick={() => setView("list")} className="p-2 mt-1 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[24px] font-bold text-[#1e293b]">{classData?.kelas || (isSelesai ? "Kelas VIII A" : "Kelas VII A")}</h1>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">{classData?.kode || (isSelesai ? "VIII-A" : "VII-A")}</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${(isSelesai || processed || classData?.status === "Selesai") ? "bg-green-50 text-green-600 border-green-100" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                {(isSelesai || processed || classData?.status === "Selesai") ? "Selesai" : "Belum Diproses"}
              </span>
            </div>
            <p className="text-[13px] text-gray-500 mt-1">Ganjil 2023/2024 · Wali Kelas: {classData?.wali || (isSelesai ? "Ibu Sari Dewi, S.Pd" : "Ibu Dewi Anggraini, S.Pd")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-gray-700 hover:bg-gray-50 shadow-sm">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Ekspor Data
          </button>

          <button onClick={handleSaveDecision} className="flex items-center gap-2 px-3.5 py-2.5 bg-[#2A4365] hover:bg-[#1A365D] text-white rounded-xl text-[13px] font-bold shadow-sm">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Simpan Keputusan
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left */}
        <div className="flex-1 space-y-4 min-w-0">
          {/* Progress */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[14px] font-bold text-gray-700">Progress Proses</p>
              <span className="text-[14px] font-bold text-blue-600">{pct}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <span className="text-[13px] font-semibold text-green-700">Naik Kelas</span>
                <span className="text-[20px] font-bold text-green-600">{naik}</span>
              </div>
              <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <span className="text-[13px] font-semibold text-red-600">Tidak Naik</span>
                <span className="text-[20px] font-bold text-red-500">{tidakNaik}</span>
              </div>
              <div className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <span className="text-[13px] font-semibold text-amber-600">Belum Ditentukan</span>
                <span className="text-[20px] font-bold text-amber-500">{belum}</span>
              </div>
            </div>
          </div>

          {/* Kriteria */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h3 className="text-[14px] font-bold text-gray-700">Kriteria Kelulusan</h3>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {[["Nilai Rata-rata","≥ 70"],["Kehadiran","≥ 80%"],["Nilai per Mapel","≥ 60"],["Maks. Mapel Tidak Lulus","≤ 2 mapel"]].map(([l,v],i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-[13px] text-gray-500">{l}</span>
                  <span className="text-[13px] font-bold text-gray-700">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                {tabs.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${activeTab===tab?"bg-[#2A4365] text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{tab}</button>
                ))}
              </div>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" placeholder="Cari siswa..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-8 pr-4 py-2 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-100">
                  <tr>{["NO","NIS","NAMA SISWA","NILAI RATA-RATA","KEHADIRAN","MAPEL TDK LULUS","STATUS","AKSI"].map(h=>(
                    <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan="8" className="py-10 text-center text-gray-500 font-medium">Memuat data siswa...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan="8" className="py-10 text-center text-gray-500 font-medium">Tidak ada siswa ditemukan.</td></tr>
                  ) : filtered.map((s,i)=>(
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5 text-[13px] text-gray-400">{s.no}</td>
                      <td className="px-4 py-3.5 text-[13px] text-gray-500">{s.nis}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full ${s.color} text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0`}>{s.init}</div>
                          <span className="text-[13px] font-semibold text-gray-800">{s.nama}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <span className={`text-[13px] font-bold ${s.nilai<70?"text-red-500":"text-gray-700"}`}>{s.nilai}</span>
                          {s.nilai<70&&<svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <span className={`text-[13px] font-bold ${s.kehadiran<80?"text-red-500":"text-gray-700"}`}>{s.kehadiran}%</span>
                          {s.kehadiran<80&&<svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`text-[13px] font-bold ${s.mapel>2?"text-red-500":"text-gray-700"}`}>{s.mapel}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        {s.status==="Naik Kelas"?(
                          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-green-50 text-green-600 border border-green-100"><svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Naik Kelas</span>
                        ):s.status==="Tidak Naik"?(
                          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-red-50 text-red-500 border border-red-100"><svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Tidak Naik</span>
                        ):(
                          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100">Belum Ditentukan</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <button onClick={() => handleToggleStatus(s.nis)} className="flex items-center gap-1 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-[12px] font-bold text-blue-600 hover:bg-blue-100 transition-colors">
                          Ubah Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-[14px] font-bold text-gray-700 mb-4">Informasi Kelas</h3>
            <div className="space-y-3">
              {[["Total Siswa", students.length],["Semester","Ganjil 2023/2024"]].map(([l,v],i)=>(
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-400">{l}</span>
                  <span className="text-[13px] font-semibold text-gray-700">{v}</span>
                </div>
              ))}
            </div>
          </div>



          {belum > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth="2.5" className="flex-shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                <div>
                  <p className="text-[13px] font-bold text-amber-700">{belum} siswa belum ditentukan</p>
                  <p className="text-[12px] text-amber-600 mt-1">Silakan tentukan status kenaikan siswa secara manual.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradePromotionDetail;




