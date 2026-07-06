import React, { useState, useEffect } from "react";
import GraduationDataDetail from "./GraduationDataDetail";

const StatusBadge = ({ s }) => {
  if (s==="Selesai") return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-600 border border-green-100"><svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Selesai</span>;
  if (s==="Dalam Proses") return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100"><svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Dalam Proses</span>;
  return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-500 border border-gray-200">Belum Diproses</span>;
};

const GraduationData = () => {
  const [classes, setClasses] = useState([]);
  const [view, setView] = useState("list");
  const [selectedClass, setSelectedClass] = useState(null);
  const [showCriteria, setShowCriteria] = useState(false);
  const [showPengumuman, setShowPengumuman] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { default: api } = await import('../../api/axios');
      
      const [kelasRes, siswaRes, lulusRes] = await Promise.all([
        api.get('/kelas'),
        api.get('/siswa'),
        api.get('/kelulusan')
      ]);

      const dbClasses = kelasRes.data?.data || [];
      const allSiswa = siswaRes.data?.data || [];
      const allLulus = lulusRes.data?.data || [];

      // Filter hanya kelas IX dan bersihkan nama kelas dari IPA/IPS
      const ixClasses = dbClasses
        .filter(c => c.nama_kelas?.toUpperCase().includes("IX"))
        .map(c => {
          let kName = c.nama_kelas.toUpperCase();
          if (kName.includes('IX')) kName = 'IX';
          return { ...c, displayName: kName };
        });
      
      const mappedClasses = ixClasses.map((c, index) => {
        const classSiswa = allSiswa.filter(s => s.kelas_id === c.id);
        const total = classSiswa.length;
        
        let lulus = 0;
        let tidakLulus = 0;
        let pending = total;

        classSiswa.forEach(s => {
          const lData = allLulus.find(l => l.siswa_id === s.id);
          if (lData) {
            if (lData.status === "Lulus") {
              lulus++;
              pending--;
            } else if (lData.status === "Tidak Lulus") {
              tidakLulus++;
              pending--;
            }
          }
        });

        const pct = total > 0 ? Math.round((lulus / total) * 100) : 0;
        let status = "Belum Diproses";
        if (pending === 0 && total > 0) status = "Selesai";
        else if (pending < total && total > 0) status = "Dalam Proses";

        return {
          no: index + 1,
          kelas: c.displayName,
          kode: c.id,
          wali: c.wali_kelas || "Belum ditentukan",
          total: total,
          lulus: lulus,
          tidakLulus: tidakLulus,
          pending: pending,
          pct: pct,
          tgl: "3 Mei 2024",
          status: status
        };
      });
      
      setClasses(mappedClasses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [view]);

  const handleSaveGraduation = async (classKode, updatedStats) => {
    // Dipanggil dari GraduationDataDetail jika ingin mengupdate state lokal sebelum fetch
    // Tapi karena view pindah ke "list", useEffect fetchData akan terpanggil lagi
    setView("list");
  };

  const totalSiswa = classes.reduce((a,c)=>a+c.total,0);
  const totalLulus = classes.reduce((a,c)=>a+c.lulus,0);
  const totalTidakLulus = classes.reduce((a,c)=>a+c.tidakLulus,0);
  const totalPending = classes.reduce((a,c)=>a+c.pending,0);
  const selesai = classes.filter(c=>c.status==="Selesai").length;
  const pctLulus = totalSiswa > 0 ? Math.round((totalLulus/totalSiswa)*100*10)/10 : 0;

  if (view==="detail") return <GraduationDataDetail cls={selectedClass} setView={setView} onSave={handleSaveGraduation} />;

  return (
    <div className="p-6 md:p-8 animate-fadeIn bg-[#F4F6FA] min-h-full space-y-5">
      <div className="text-[13px] text-gray-400">Dashboard &gt; <span className="text-gray-500">Kelola Akademik</span> &gt; <span className="text-[#2A4365] font-semibold">Data Kelulusan</span></div>

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Data Kelulusan</h1>
          <p className="text-[14px] text-gray-500 mt-1">Kelola data kelulusan siswa Kelas IX berdasarkan nilai sekolah dan ujian.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={() => setShowCriteria(true)} className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-gray-700 hover:bg-gray-50 shadow-sm">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Kriteria Kelulusan
          </button>
          <button onClick={() => setShowPengumuman(true)} className="flex items-center gap-2 px-3.5 py-2.5 bg-[#F5F3FF] border border-[#EDE9FE] rounded-xl text-[13px] font-bold text-[#8B5CF6] hover:bg-[#EDE9FE] shadow-sm">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            Pengumuman Kelulusan
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-[13px] font-bold shadow-sm">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Ekspor Rekap
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#2A4365] to-[#3B82F6] rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <div>
              <p className="text-blue-200 text-[13px]">Tingkat Kelulusan — TA 2023/2024</p>
              <p className="text-[32px] font-bold">{pctLulus}%</p>
              <p className="text-blue-200 text-[13px]">{totalLulus} dari {totalSiswa} siswa dinyatakan lulus</p>
            </div>
          </div>
          <div className="flex gap-8 text-center">
            <div><p className="text-[28px] font-bold">{totalLulus}</p><p className="text-blue-200 text-[13px]">Lulus</p></div>
            <div><p className="text-[28px] font-bold">{totalTidakLulus}</p><p className="text-blue-200 text-[13px]">Tidak Lulus</p></div>
            <div><p className="text-[28px] font-bold">{totalPending}</p><p className="text-blue-200 text-[13px]">Pending</p></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {[
          { label: "Total Siswa IX", val: totalSiswa, sub: "Semua kelas IX" },
          { label: "Dinyatakan Lulus", val: totalLulus, sub: `${pctLulus}% tingkat kelulusan` },
          { label: "Tidak Lulus", val: totalTidakLulus, sub: "Perlu remedial/mengulang" },
          { label: "Belum Diproses", val: totalPending, sub: "Menunggu keputusan" },
        ].map((card, i) => (
          <div key={i} className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
            <div>
              <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">{card.label}</div>
              <div className="text-3xl font-black text-white">{card.val}</div>
              <div className="text-xs font-medium text-blue-300 mt-2">{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[14px] font-bold text-gray-700">Progress Proses Kelulusan</p>
          <span className="text-[14px] font-bold text-blue-600">{classes.length > 0 ? Math.round((selesai/classes.length)*100) : 0}% ({selesai}/{classes.length} kelas)</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{width:`${classes.length > 0 ? (selesai/classes.length)*100 : 0}%`}} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr>{["NO","KELAS","WALI KELAS","TOTAL SISWA","LULUS","TIDAK LULUS","PENDING","TINGKAT KELULUSAN","TGL PENGUMUMAN","STATUS","AKSI"].map(h=>(
                <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="11" className="text-center py-10">Memuat data...</td></tr>
              ) : classes.length === 0 ? (
                <tr><td colSpan="11" className="text-center py-10">Tidak ada kelas IX</td></tr>
              ) : classes.map((row,i)=>(
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-4 py-4 text-[13px] text-gray-400">{row.no}</td>
                  <td className="px-4 py-4">
                    <p className="text-[13px] font-bold text-gray-800">{row.kelas}</p>
                    <p className="text-[11px] text-gray-400">{row.kode}</p>
                  </td>
                  <td className="px-4 py-4 text-[13px] text-gray-600 max-w-[140px] truncate">{row.wali}</td>
                  <td className="px-4 py-4 text-[13px] font-semibold text-gray-700">{row.total}</td>
                  <td className="px-4 py-4 text-[13px] font-bold text-green-600">{row.lulus}</td>
                  <td className="px-4 py-4 text-[13px] font-bold text-red-500">{row.tidakLulus}</td>
                  <td className="px-4 py-4 text-[13px] font-bold text-amber-500">{row.pending}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${row.pct>=90?"bg-green-500":row.pct>=70?"bg-amber-400":"bg-gray-300"}`} style={{width:`${row.pct}%`}} />
                      </div>
                      <span className="text-[12px] font-bold text-gray-600">{row.pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[13px] text-gray-500">{row.tgl}</td>
                  <td className="px-4 py-4"><StatusBadge s={row.status} /></td>
                  <td className="px-4 py-4">
                    {row.status==="Belum Diproses" ? (
                      <button onClick={()=>{setSelectedClass(row);setView("detail");}} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg text-[12px] font-bold">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 16 16 12 12 8"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                        Proses
                      </button>
                    ) : (
                      <button onClick={()=>{setSelectedClass(row);setView("detail");}} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-[12px] font-bold">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        Detail
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[13px] text-gray-400">Menampilkan 1–{classes.length} dari {classes.length} kelas</p>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50"><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2A4365] text-white text-[13px] font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50"><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></button>
          </div>
        </div>
      </div>

      {showCriteria && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-[24px] w-full max-w-[420px] p-8 shadow-2xl scale-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-[52px] h-[52px] rounded-[18px] bg-[#F5F3FF] flex items-center justify-center text-[#8B5CF6] flex-shrink-0">
                <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M22 10L12 5 2 10l10 5 10-5z"/><path strokeLinecap="round" strokeLinejoin="round" d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              </div>
              <div>
                <h3 className="text-[20px] font-bold text-[#1e293b]">Kriteria Kelulusan</h3>
                <p className="text-[14px] text-gray-500 mt-0.5">Tahun Ajaran 2023/2024</p>
              </div>
            </div>

            <div className="space-y-3.5 mb-6">
              <div className="flex items-center justify-between px-4 py-3 border border-gray-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  <span className="text-[14.5px] text-[#475569]">Nilai Sekolah (Rapor) minimum</span>
                </div>
                <span className="px-3 py-1.5 bg-[#DCFCE7] text-[#166534] text-[12px] font-bold rounded-lg">≥ 70</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 border border-gray-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  <span className="text-[14.5px] text-[#475569]">Nilai Ujian Sekolah minimum</span>
                </div>
                <span className="px-3 py-1.5 bg-[#DBEAFE] text-[#1E40AF] text-[12px] font-bold rounded-lg">≥ 55</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 border border-gray-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  <span className="text-[14.5px] text-[#475569]">Nilai Akhir minimum</span>
                </div>
                <span className="px-3 py-1.5 bg-[#F3E8FF] text-[#6B21A8] text-[12px] font-bold rounded-lg">≥ 65</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 border border-gray-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  <span className="text-[14.5px] text-[#475569]">Maks. mapel tidak lulus</span>
                </div>
                <span className="px-3 py-1.5 bg-[#FEF3C7] text-[#92400E] text-[12px] font-bold rounded-lg">0 mapel</span>
              </div>
            </div>

            <div className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-[20px] flex gap-3 items-start mb-8">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#D97706" strokeWidth="2" className="flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <p className="text-[13px] text-[#B45309] leading-relaxed">
                Nilai Akhir dihitung dari rata-rata Nilai Sekolah (60%) dan Nilai Ujian Sekolah (40%). Siswa harus memenuhi semua kriteria untuk dinyatakan lulus.
              </p>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setShowCriteria(false)} className="flex-1 py-3.5 bg-white border border-gray-200 rounded-[16px] text-gray-600 font-bold hover:bg-gray-50 transition-colors">
                Tutup
              </button>
              <button className="flex-1 py-3.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-[16px] font-bold transition-colors">
                Edit Kriteria
              </button>
            </div>
          </div>
        </div>
      )}

      {showPengumuman && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-[24px] w-full max-w-[420px] p-8 shadow-2xl scale-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-[52px] h-[52px] rounded-[18px] bg-[#F5F3FF] flex items-center justify-center text-[#8B5CF6] flex-shrink-0">
                <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
              </div>
              <div>
                <h3 className="text-[20px] font-bold text-[#1e293b]">Pengumuman Kelulusan</h3>
                <p className="text-[14px] text-gray-500 mt-0.5">Atur tanggal dan metode pengumuman</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[13.5px] font-bold text-[#475569] mb-2">Tanggal Pengumuman</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDE9FE] focus:border-[#8B5CF6] transition-all" />
              </div>
              <div>
                <label className="block text-[13.5px] font-bold text-[#475569] mb-2">Jam Pengumuman</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDE9FE] focus:border-[#8B5CF6] transition-all" />
              </div>

              <div className="pt-2">
                <label className="block text-[13.5px] font-bold text-[#475569] mb-3">Distribusi Pengumuman</label>
                <div className="space-y-3.5 pl-2">
                  <div className="text-[14.5px] font-medium text-[#334155]">Tampilkan di Portal Siswa</div>
                  <div className="text-[14.5px] font-medium text-[#334155]">Kirim SMS/WhatsApp ke Orang Tua</div>
                  <div className="text-[14.5px] font-medium text-[#334155]">Tampilkan di Website Sekolah</div>
                  <div className="text-[14.5px] font-medium text-[#334155]">Cetak Surat Kelulusan</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FAF5FF] border border-[#E9D5FF] rounded-[20px] flex gap-3 items-start mb-8">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#A855F7" strokeWidth="2" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <p className="text-[13px] text-[#9333EA] leading-relaxed">
                Pengumuman hanya dapat dilakukan setelah semua kelas selesai diproses. {classes.length - selesai > 0 ? `${classes.length - selesai} kelas belum selesai.` : "Semua kelas selesai."}
              </p>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setShowPengumuman(false)} className="flex-1 py-3.5 bg-white border border-gray-200 rounded-[16px] text-gray-600 font-bold hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button className="flex-[1.3] py-3.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-[16px] font-bold transition-colors">
                Jadwalkan Pengumuman
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GraduationData;
