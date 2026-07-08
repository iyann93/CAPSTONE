import React, { useState, useEffect } from "react";
import api from "../../api/axios";

const getAvg = (arr) => {
  if (!arr || arr.length === 0) return 0;
  return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
};

const AkademikSiswa = ({ user }) => {
  const [semesterData, setSemesterData] = useState([]);
  const [activeSemester, setActiveSemester] = useState("");
  const [search, setSearch] = useState("");
  const [selectedMapel, setSelectedMapel] = useState(null);
  
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catatan, setCatatan] = useState("");

  const studentName = user?.anak?.nama || user?.nama || "Siswa";
  const studentClass = user?.anak?.kelas || "-";
  const studentId = user?.anak?.id || user?.userId;

  // Ambil data semester untuk dropdown
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const res = await api.get('/semester');
        const sems = res.data?.data || [];
        setSemesterData(sems);
        const active = sems.find(s => s.is_aktif) || sems[0];
        if (active) setActiveSemester(active.id);
      } catch (err) {
        console.error("Gagal mengambil semester", err);
      }
    };
    fetchSemesters();
  }, []);

  // Ambil nilai dan catatan
  useEffect(() => {
    const fetchData = async () => {
      if (!studentId || !activeSemester) return;
      try {
        setLoading(true);
        const [nilaiRes, catRes] = await Promise.all([
          api.get(`/nilai/siswa/${studentId}?semester_id=${activeSemester}`).catch(() => ({ data: { data: [] } })),
          api.get(`/catatan-siswa?siswa_id=${studentId}&semester_id=${activeSemester}`).catch(() => ({ data: { data: [] } }))
        ]);
        
        const nData = nilaiRes.data?.data || [];
        const mappedSubjects = nData.map(n => {
          const harian = parseFloat(n.nilai_harian) || 0;
          const uts = parseFloat(n.nilai_uts) || 0;
          const uas = parseFloat(n.nilai_uas) || 0;
          // Asumsikan struktur data n berisi nama_mapel, dll
          return {
            mapel: n.nama_mapel || "Mata Pelajaran",
            guru: n.nama_guru || "Guru",
            nilai: [harian, uts, uas], // Hanya 3 nilai sesuai database
            kkmPassed: (n.nilai_akhir || ((harian+uts+uas)/3)) >= 75
          };
        });
        
        setSubjects(mappedSubjects);

        const cData = catRes.data?.data || [];
        // Asumsi data array
        if (cData.length > 0) setCatatan(cData[0].isi_catatan);
        else setCatatan("");

      } catch (err) {
        console.error("Gagal mengambil data akademik", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId, activeSemester]);

  const filtered = subjects.filter(s =>
    s.mapel.toLowerCase().includes(search.toLowerCase())
  );

  const allAvg = subjects.length > 0 ? parseFloat(getAvg(subjects.map(s => parseFloat(getAvg(s.nilai))))) : 0;
  const best = subjects.length > 0 ? [...subjects].sort((a, b) => parseFloat(getAvg(b.nilai)) - parseFloat(getAvg(a.nilai)))[0] : null;
  const lowest = subjects.length > 0 ? [...subjects].sort((a, b) => parseFloat(getAvg(a.nilai)) - parseFloat(getAvg(b.nilai)))[0] : null;

  const barLabels = ["Harian", "UTS", "UAS"];

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb */}
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Perkembangan Akademik</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Perkembangan Akademik</h1>
          <p className="text-[14px] text-gray-500 mt-1">{studentName} · Kelas {studentClass}</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[13px] text-gray-500 font-medium">Semester:</label>
          <select
            value={activeSemester}
            onChange={e => setActiveSemester(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-[13px] font-semibold text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            {semesterData.map(s => <option key={s.id} value={s.id}>{s.nama_semester}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-8 flex items-center justify-center bg-white rounded-2xl border border-gray-100 min-h-[300px]">
           <div className="flex flex-col items-center gap-3 text-gray-500">
             <svg className="animate-spin h-8 w-8 text-[#1A3D63]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             <span className="text-sm font-bold animate-pulse">Memuat data akademik...</span>
           </div>
        </div>
      ) : subjects.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 min-h-[300px] flex flex-col items-center justify-center">
           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
             <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
           </div>
           <p className="text-[14px] font-bold text-gray-500">Belum ada nilai yang diinput di semester ini</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Rata-rata Keseluruhan", val: allAvg.toFixed(1), sub: "Semua mata pelajaran", color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Mapel Terbaik", val: best?.mapel || "-", sub: `Avg: ${best ? getAvg(best.nilai) : 0}`, color: "text-green-600", bg: "bg-green-50" },
              { label: "Perlu Perhatian", val: lowest?.mapel || "-", sub: `Avg: ${lowest ? getAvg(lowest.nilai) : 0}`, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Total Mata Pelajaran", val: subjects.length, sub: "Tercatat", color: "text-purple-600", bg: "bg-purple-50" },
            ].map((card, i) => (
              <div key={i} className="bg-[#1A3D63] rounded-2xl p-5 shadow-sm">
                <p className="text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-2">{card.label}</p>
                <p className="text-[24px] font-black text-white leading-tight truncate" title={String(card.val)}>{card.val}</p>
                <p className="text-[12px] text-blue-300 mt-1">{card.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Nilai per Mapel Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-[15px] font-bold text-gray-800">Nilai Per Mata Pelajaran</h3>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input
                    type="text"
                    placeholder="Cari mata pelajaran..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-8 pr-4 py-2 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 w-52"
                  />
                </div>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full">
                  <thead className="border-b border-gray-100">
                    <tr>
                      {["MATA PELAJARAN", "GURU", "HARIAN", "UTS", "UAS", "RATA-RATA", "STATUS"].map(h => (
                        <th key={h} className="px-4 py-3.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-4 py-8 text-center text-[13px] text-gray-500">Tidak ada mata pelajaran ditemukan</td>
                      </tr>
                    ) : filtered.map((s, i) => {
                      const avg = parseFloat(getAvg(s.nilai));
                      return (
                        <tr
                          key={i}
                          className="hover:bg-blue-50/30 cursor-pointer transition-colors"
                          onClick={() => setSelectedMapel(selectedMapel?.mapel === s.mapel ? null : s)}
                        >
                          <td className="px-4 py-3.5">
                            <span className="text-[13px] font-bold text-gray-800">{s.mapel}</span>
                          </td>
                          <td className="px-4 py-3.5 text-[13px] text-gray-500">{s.guru}</td>
                          {s.nilai.map((n, ni) => (
                            <td key={ni} className={`px-4 py-3.5 text-[13px] font-semibold ${n < 75 ? "text-red-500" : "text-gray-700"}`}>{n}</td>
                          ))}
                          <td className="px-4 py-3.5">
                            <span className={`text-[14px] font-black ${avg >= 80 ? "text-green-600" : avg >= 75 ? "text-blue-600" : "text-amber-600"}`}>{avg}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${avg >= 75 ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-500 border border-red-100"}`}>
                              {avg >= 75 ? "Lulus KKM" : "Tidak Lulus"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar: Chart & Detail */}
            <div className="space-y-4">
              {/* Bar Chart */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-[14px] font-bold text-gray-700 mb-4">
                  {selectedMapel ? `Grafik: ${selectedMapel.mapel}` : "Grafik Rata-rata"}
                </h3>
                <div className="flex items-end gap-2 h-28 mt-2">
                  {(selectedMapel ? selectedMapel.nilai : subjects.map(s => parseFloat(getAvg(s.nilai)))).slice(0, 8).map((v, i) => {
                    const h = Math.round((v / 100) * 100);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[9px] font-bold text-gray-500">{typeof v === 'number' ? v.toFixed(0) : v}</span>
                        <div className="w-full relative rounded-t-lg overflow-hidden" style={{ height: `${h}%` }}>
                          <div
                            className={`w-full h-full rounded-t-lg ${v >= 80 ? "bg-green-400" : v >= 75 ? "bg-blue-400" : "bg-amber-400"}`}
                          />
                        </div>
                        <span className="text-[9px] text-gray-400 truncate w-full text-center">
                          {selectedMapel ? barLabels[i] : (subjects[i]?.mapel?.slice(0, 4) || "")}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-3 mt-4 justify-center">
                  {[["≥ 80", "bg-green-400"], ["75-79", "bg-blue-400"], ["< 75", "bg-amber-400"]].map(([l, c]) => (
                    <div key={l} className="flex items-center gap-1.5">
                      <div className={`w-2.5 h-2.5 rounded-sm ${c}`}/>
                      <span className="text-[10px] text-gray-500">{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detail Mapel */}
              {selectedMapel && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fadeIn">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[14px] font-bold text-gray-700 truncate w-4/5">{selectedMapel.mapel}</h3>
                    <button onClick={() => setSelectedMapel(null)} className="text-gray-400 hover:text-gray-600 shrink-0">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                  <p className="text-[12px] text-gray-400 mb-3 truncate">Guru: {selectedMapel.guru}</p>
                  <div className="space-y-2">
                    {selectedMapel.nilai.map((n, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-[12px] text-gray-500">{barLabels[i]}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${n >= 80 ? "bg-green-400" : n >= 75 ? "bg-blue-400" : "bg-amber-400"}`} style={{ width: `${n}%` }}/>
                          </div>
                          <span className={`text-[12px] font-bold w-8 text-right ${n < 75 ? "text-red-500" : "text-gray-700"}`}>{n}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between">
                    <span className="text-[12px] text-gray-500">Rata-rata</span>
                    <span className="text-[14px] font-black text-[#2A4365]">{getAvg(selectedMapel.nilai)}</span>
                  </div>
                </div>
              )}

              {/* Catatan Perkembangan */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <div className="flex items-start gap-2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="2.5" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
                  <div>
                    <p className="text-[13px] font-bold text-blue-800">Catatan Wali Kelas</p>
                    <p className="text-[12px] text-blue-600 mt-1 leading-relaxed">
                      {catatan || "Belum ada catatan wali kelas di semester ini."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AkademikSiswa;


