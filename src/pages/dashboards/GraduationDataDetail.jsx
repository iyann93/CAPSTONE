import React, { useState, useEffect } from "react";
import api from "../../api/axios";

const autoStatusGrad = (s) => {
  if (s.nilaiSek >= 70 && s.nilaiUS >= 55 && s.nilaiAkhir >= 65) return "Lulus";
  return "Tidak Lulus";
};

const GraduationDataDetail = ({ cls, setView, onSave }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Semua");
  const [search, setSearch] = useState("");
  const [printStudent, setPrintStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        let allSiswa = [];
        try {
          const res = await api.get('/siswa?kelas_id=' + cls?.kode + '&limit=1000');
          allSiswa = res.data?.data || [];
        } catch(e) { console.error("Siswa err", e); }

        let allLulus = [];
        try {
          const res = await api.get('/kelulusan?limit=10000');
          allLulus = res.data?.data || [];
        } catch(e) { console.error("Kelulusan err", e); }
        
        // Filter siswa by class
        const classSiswa = allSiswa.filter(s => s.kelas_id === cls?.kode);
        
        const colors = ["bg-[#3B82F6]", "bg-[#EC4899]", "bg-[#10B981]", "bg-[#F59E0B]", "bg-[#8B5CF6]"];
        
        const mapped = classSiswa.map((s, i) => {
          const lulusData = allLulus.find(l => l.siswa_id === s.id) || {};
          let status = "Pending";
          if (lulusData.status === "Lulus") status = "Lulus";
          if (lulusData.status === "Tidak Lulus") status = "Tidak Lulus";

          return {
            id: s.id,
            no: i + 1,
            nis: s.nis,
            nama: s.nama_lengkap,
            init: s.nama_lengkap.charAt(0).toUpperCase(),
            color: colors[i % colors.length],
            nilaiSek: parseFloat((80 + (i % 15)).toFixed(1)),
            nilaiUS: parseFloat((75 + (i % 20)).toFixed(1)),
            nilaiAkhir: parseFloat((77.5 + (i % 17)).toFixed(1)),
            kehadiran: 90 + (i % 10),
            star: i === 0 || i === 1,
            status: status,
            catatan: ""
          };
        });
        setStudents(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (cls?.kode) fetchStudents();
  }, [cls?.kode]);

  const lulus = students.filter(s=>s.status==="Lulus").length;
  const tidakLulus = students.filter(s=>s.status==="Tidak Lulus").length;
  const pending = students.filter(s=>s.status==="Pending").length;
  const pct = students.length > 0 ? Math.round((lulus/students.length)*100) : 0;

  const handleProcessAuto = () => {
    setStudents(prev => prev.map(s => ({ ...s, status: autoStatusGrad(s) })));
  };

  const handleToggleStatus = (id) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== id) return s;
      const next = s.status === "Lulus" ? "Tidak Lulus" : "Lulus";
      return { ...s, status: next };
    }));
  };

  const handleSaveDecision = async () => {
    try {
      // Save all student statuses to DB
      for (const s of students) {
        if (s.status !== "Pending") {
          await api.post('/kelulusan', {
            siswaId: s.id,
            status: s.status,
            divalidasi_kepsek: false
          });
        }
      }

      const lulusC = students.filter(s => s.status === "Lulus").length;
      const tidakLulusC = students.filter(s => s.status === "Tidak Lulus").length;
      const pendingC = students.filter(s => s.status === "Pending").length;
      const pctC = students.length > 0 ? Math.round((lulusC / students.length) * 100) : 0;
      const statusC = pendingC === 0 ? "Selesai" : "Dalam Proses";
      
      alert("Keputusan berhasil disimpan ke database!");
      
      if (onSave) {
        onSave(cls?.kode, { lulus: lulusC, tidakLulus: tidakLulusC, pending: pendingC, pct: pctC, status: statusC });
      }
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan keputusan");
    }
  };

  const filtered = students.filter(s=>{
    const tabOk = tab==="Semua"||s.status===tab;
    const searchOk = s.nama.toLowerCase().includes(search.toLowerCase())||s.nis.includes(search);
    return tabOk&&searchOk;
  });

  const nilaiMax = students.length ? Math.max(...students.map(s=>s.nilaiAkhir)) : 0;
  const nilaiAvg = students.length ? (students.reduce((a,s)=>a+s.nilaiAkhir,0)/students.length).toFixed(1) : 0;
  const berprestasi = students.filter(s=>s.star).sort((a,b)=>b.nilaiAkhir-a.nilaiAkhir);
  const top3 = [...students].sort((a,b)=>b.nilaiAkhir-a.nilaiAkhir).slice(0,3);

  const clsName = cls?.kelas || "Kelas IX A";
  const clsKode = cls?.kode || "IX-A";
  const clsWali = cls?.wali || "Belum ditentukan";

  return (
    <div className="p-6 md:p-8 animate-fadeIn bg-[#F4F6FA] min-h-full">
      <div className="text-[13px] text-gray-400 mb-4">
        Dashboard &gt; <button onClick={()=>setView("list")} className="text-gray-500 hover:text-[#2A4365]">Data Kelulusan</button> &gt; <span className="text-[#2A4365] font-semibold">{clsName}</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
        <div className="flex items-start gap-3">
          <button onClick={()=>setView("list")} className="w-10 h-10 mt-0.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm flex items-center justify-center">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[24px] font-bold text-[#1e293b]">{clsName}</h1>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">{clsKode}</span>
              {pending === 0 && students.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-600 border border-green-100">
                  <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  Selesai
                </span>
              )}
            </div>
            <p className="text-[13px] text-gray-500 mt-1">2023/2024 · Wali Kelas: {clsWali}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-gray-700 hover:bg-gray-50 shadow-sm">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Ekspor Data
          </button>
          <button onClick={handleProcessAuto} className="flex items-center gap-2 px-3.5 py-2.5 bg-[#F5F3FF] border border-[#EDE9FE] rounded-xl text-[13px] font-bold text-[#8B5CF6] hover:bg-[#EDE9FE] shadow-sm">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0"/></svg>
            Proses Otomatis
          </button>
          <button onClick={handleSaveDecision} className="flex items-center gap-2 px-3.5 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-[13px] font-bold shadow-sm">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
            Simpan Keputusan
          </button>
        </div>
      </div>

      <div className="flex gap-5">
        <div className="flex-1 min-w-0 space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {[
              {label:"Total Siswa",val:students.length,icon:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",color:"text-blue-500 bg-blue-50"},
              {label:"Lulus",val:lulus,icon:"M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0",color:"text-green-500 bg-green-50"},
              {label:"Tidak Lulus",val:tidakLulus,icon:"M10 14l2-2m0 0 2-2m-2 2-2-2m2 2 2 2m7-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0",color:"text-red-500 bg-red-50"},
              {label:"Pending",val:pending,icon:"M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0",color:"text-amber-500 bg-amber-50"},
            ].map((s,i)=>(
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color.split(" ")[1]}`}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className={s.color.split(" ")[0]} strokeLinecap="round" strokeLinejoin="round"><path d={s.icon}/></svg>
                </div>
                <div>
                  <p className="text-[22px] font-bold text-gray-800">{s.val}</p>
                  <p className="text-[12px] text-gray-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
              </div>
              <p className="text-[14px] font-bold text-gray-700">Kriteria Kelulusan</p>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {[
                ["Nilai Sekolah (Rapor)","≥ 70"],["Nilai Ujian Sekolah","≥ 55"],
                ["Nilai Akhir","≥ 65"],["Maks. Mapel Tidak Lulus","0 mapel"],
              ].map(([k,v],i)=>(
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-500">{k}</span>
                  <span className="text-[13px] font-bold text-gray-700">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between gap-3">
              <div className="flex gap-1.5">
                {["Semua","Lulus","Tidak Lulus","Pending"].map(t=>(
                  <button key={t} onClick={()=>setTab(t)} className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors ${tab===t?"bg-[#3B82F6] text-white":"bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>{t}</button>
                ))}
              </div>
              <div className="relative">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari siswa atau NIS..." className="pl-9 pr-3 py-2 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 w-48"/>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-100">
                  <tr>{["NO","NIS","NAMA SISWA","NILAI SEKOLAH","NILAI US","NILAI AKHIR","KEHADIRAN","STATUS","NO. SERTIFIKAT","AKSI"].map(h=>(
                    <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan="10" className="py-10 text-center">Memuat...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan="10" className="py-10 text-center">Tidak ada siswa</td></tr>
                  ) : filtered.map((s,i)=>(
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="px-4 py-4 text-[13px] font-bold text-gray-500">{s.no}</td>
                      <td className="px-4 py-4 text-[13px] font-bold text-gray-500">{s.nis}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${s.color} flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0`}>{s.init}</div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13.5px] font-bold text-gray-700">{s.nama}</span>
                              {s.star && <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
                            </div>
                            {s.catatan && <p className="text-[11px] text-gray-400 mt-0.5">{s.catatan}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`flex items-center gap-1 text-[14px] font-bold ${s.nilaiSek >= 70 ? 'text-[#16A34A]' : 'text-red-500'}`}>
                          {s.nilaiSek}
                          {s.nilaiSek < 70 && <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`flex items-center gap-1 text-[14px] font-bold ${s.nilaiUS >= 55 ? 'text-[#16A34A]' : 'text-red-500'}`}>
                          {s.nilaiUS}
                          {s.nilaiUS < 55 && <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>}
                        </div>
                      </td>
                      <td className={`px-4 py-4 text-[14px] font-bold ${s.nilaiAkhir >= 65 ? 'text-[#3B82F6]' : 'text-red-500'}`}>{s.nilaiAkhir}</td>
                      <td className="px-4 py-4 text-[13px] font-medium text-gray-500">{s.kehadiran}%</td>
                      <td className="px-4 py-4">
                        {s.status==="Lulus"
                          ? <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]"><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4"/></svg>Lulus</span>
                          : s.status==="Tidak Lulus" 
                          ? <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF2F2] text-red-500 border border-red-100"><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6"/></svg><div className="leading-tight text-[11px] font-bold text-left">Tidak<br/>Lulus</div></div>
                          : <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold bg-gray-100 text-gray-500 border border-gray-200">Pending</span>
                        }
                      </td>
                      <td className="px-4 py-4">
                        {s.status==="Lulus" ? (
                          <span className="px-2.5 py-1.5 bg-gray-50 text-gray-400 font-bold rounded-lg text-[10px]">00{s.no}/SKL/2024</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => setPrintStudent(s)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                          </button>
                          <button onClick={() => handleToggleStatus(s.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-[12px] font-bold hover:bg-gray-50 shadow-sm transition-colors">
                            Ubah
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="w-72 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth="2"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              <p className="text-[14px] font-bold text-gray-700">Ringkasan Kelulusan</p>
            </div>
            <div className="flex items-center justify-center my-3">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3.5"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3.5"
                    strokeDasharray={`${pct} ${100-pct}`} strokeDashoffset="0" strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[20px] font-bold text-gray-800">{pct}%</span>
                  <span className="text-[10px] text-gray-400">Lulus</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 mt-2">
              <div className="flex justify-between text-[13px]"><span className="text-gray-500">Nilai Tertinggi</span><span className="font-bold text-gray-800">{nilaiMax}</span></div>
              <div className="flex justify-between text-[13px]"><span className="text-gray-500">Nilai Rata-rata</span><span className="font-bold text-gray-800">{nilaiAvg}</span></div>
              <div className="flex justify-between text-[13px]"><span className="text-gray-500">Siswa Berprestasi</span><span className="font-bold text-gray-800">{berprestasi.length} siswa</span></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              <p className="text-[14px] font-bold text-gray-700">Distribusi Nilai Akhir</p>
            </div>
            {[
              {label:"≥ 85 (Sangat Baik)",count:students.filter(s=>s.nilaiAkhir>=85).length,color:"bg-green-500"},
              {label:"75-84 (Baik)",count:students.filter(s=>s.nilaiAkhir>=75&&s.nilaiAkhir<85).length,color:"bg-blue-500"},
              {label:"65-74 (Cukup)",count:students.filter(s=>s.nilaiAkhir>=65&&s.nilaiAkhir<75).length,color:"bg-amber-400"},
              {label:"< 65 (Tidak Lulus)",count:students.filter(s=>s.nilaiAkhir<65).length,color:"bg-red-500"},
            ].map((d,i)=>(
              <div key={i} className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${d.color}`}/>
                  <span className="text-[12px] text-gray-500">{d.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${d.color} rounded-full`} style={{width:`${students.length? (d.count/students.length)*100 : 0}%`}}/>
                  </div>
                  <span className="text-[12px] font-bold text-gray-700 w-4 text-right">{d.count}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <p className="text-[14px] font-bold text-gray-700">Siswa Berprestasi</p>
            </div>
            {top3.map((s,i)=>(
              <div key={i} className="flex items-center gap-2.5 mb-3 last:mb-0">
                <div className={`w-8 h-8 rounded-full ${s.color} flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0`}>{s.init}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-800 truncate">{s.nama}</p>
                  <p className="text-[11px] text-gray-400">{i===0?"Peringkat 1 Paralel":i===1?"Nilai Tertinggi":"Siswa Teladan"}</p>
                </div>
                <span className="text-[13px] font-bold text-gray-700">{s.nilaiAkhir}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-[14px] font-bold text-gray-700 mb-3">Informasi Data</p>
            {[
              ["Kelas", clsName],["Tahun Ajaran","2023/2024"],["Tgl Pengumuman","3 Mei 2024"],
            ].map(([k,v],i)=>(
              <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-[12px] text-gray-500">{k}</span>
                <span className="text-[12px] font-semibold text-gray-700">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {printStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-[600px] shadow-2xl scale-in flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#1e293b]">Pratinjau Surat Keterangan Lulus</h3>
              <button onClick={() => setPrintStudent(null)} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[80vh] bg-white">
              <div className="border border-gray-200 rounded-[8px] bg-white p-8 pb-10 shadow-sm antialiased text-[#334155]" style={{ fontFamily: "'Tinos', Georgia, serif" }}>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-[46px] h-[46px] rounded-full bg-[#1A365D] flex items-center justify-center text-white flex-shrink-0">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  </div>
                  <div className="text-center mt-1">
                    <h2 className="text-[17px] font-bold text-[#1e293b] tracking-[0.05em] m-0 leading-tight">MBS PRAMBANAN</h2>
                    <p className="text-[11px] text-[#64748B] mt-0.5">Jl. Pendidikan No. 1, Kota Contoh</p>
                  </div>
                </div>

                <div className="w-full border-b-[3px] border-[#475569] mb-[2px]"></div>
                <div className="w-full border-b border-[#475569] mb-8"></div>

                <div className="text-center mb-8">
                  <h1 className="text-[17px] font-bold text-[#1e293b] tracking-[0.25em] mb-1.5">SURAT KETERANGAN LULUS</h1>
                  <p className="text-[13.5px] text-[#64748B]">No: 00{printStudent.no}/SKL/2024</p>
                </div>

                <div className="text-[14px] leading-relaxed px-4">
                  <p className="mb-6">Yang bertanda tangan di bawah ini, Kepala MBS Prambanan, menerangkan bahwa:</p>
                  
                  <div className="grid grid-cols-[120px_30px_1fr] gap-y-3.5 mb-10 ml-4">
                    <div className="text-[#64748B]">Nama</div><div className="text-[#64748B] text-center">:</div><div className="text-[#1e293b]">{printStudent.nama}</div>
                    <div className="text-[#64748B]">NIS</div><div className="text-[#64748B] text-center">:</div><div className="text-[#1e293b]">{printStudent.nis}</div>
                    <div className="text-[#64748B]">Kelas</div><div className="text-[#64748B] text-center">:</div><div className="text-[#1e293b]">{clsName}</div>

                    <div className="text-[#64748B]">Nilai Akhir</div><div className="text-[#64748B] text-center">:</div><div className="text-[#1e293b]">{printStudent.nilaiAkhir.toFixed(2)}</div>
                    <div className="text-[#64748B]">Tahun Ajaran</div><div className="text-[#64748B] text-center">:</div><div className="text-[#1e293b]">2023/2024</div>
                  </div>

                  <p className="mb-14 leading-relaxed">
                    <strong className="text-[#1e293b] font-bold">DINYATAKAN LULUS</strong> dari Satuan Pendidikan MBS Prambanan Tahun Pelajaran 2023/2024.
                  </p>

                  <div className="flex justify-end pr-4">
                    <div className="text-center">
                      <p className="mb-14 text-[#64748B]">Kepala Sekolah,</p>
                      <div className="w-[180px] border-b border-[#1e293b] mb-2 mx-auto"></div>
                      <p className="font-bold text-[#1e293b] text-[14px]">Drs. Ahmad Wijaya, M.Pd</p>
                      <p className="text-[11.5px] text-[#64748B] mt-1">NIP. 196805121994031007</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-4 bg-white rounded-b-2xl">
              <button onClick={() => setPrintStudent(null)} className="flex-1 py-3.5 bg-white border border-gray-200 rounded-[14px] text-gray-700 font-bold hover:bg-gray-50 transition-colors">
                Tutup
              </button>
              <button className="flex-1 py-3.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-[14px] font-bold flex items-center justify-center gap-2 transition-colors">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                Cetak SKL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraduationDataDetail;
