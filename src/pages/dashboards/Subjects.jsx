import React, { useState } from "react";
import SubjectForm from "./SubjectForm";
import SubjectDetail from "./SubjectDetail";

const Subjects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [selectedSubject, setSelectedSubject] = useState(null);

  const mockData = [
    { code: "MTK", name: "Matematika", group: "Wajib", groupColor: "bg-gray-100 text-gray-600", levels: "X, XI, XII", hours: 4, teacher: "Drs. Hendra, M.Pd.", status: "Aktif", statusColor: "text-emerald-500", dotColor: "bg-emerald-500" },
    { code: "BIN", name: "Bahasa Indonesia", group: "Wajib", groupColor: "bg-gray-100 text-gray-600", levels: "X, XI, XII", hours: 4, teacher: "Ibu Nuraini, S.Pd.", status: "Aktif", statusColor: "text-emerald-500", dotColor: "bg-emerald-500" },
    { code: "BIG", name: "Bahasa Inggris", group: "Wajib", groupColor: "bg-gray-100 text-gray-600", levels: "X, XI, XII", hours: 3, teacher: "Mr. Andrian, M.A.", status: "Aktif", statusColor: "text-emerald-500", dotColor: "bg-emerald-500" },
    { code: "FIS", name: "Fisika", group: "IPA", groupColor: "bg-emerald-50 text-emerald-600", levels: "X, XI, XII", hours: 4, teacher: "Ibu Sari, S.Pd.", status: "Aktif", statusColor: "text-emerald-500", dotColor: "bg-emerald-500" },
    { code: "KIM", name: "Kimia", group: "IPA", groupColor: "bg-emerald-50 text-emerald-600", levels: "X, XI, XII", hours: 4, teacher: "Bpk. Rudi, M.Si.", status: "Aktif", statusColor: "text-emerald-500", dotColor: "bg-emerald-500" },
    { code: "BIO", name: "Biologi", group: "IPA", groupColor: "bg-emerald-50 text-emerald-600", levels: "X, XI, XII", hours: 4, teacher: "Ibu Dewi, S.Pd.", status: "Aktif", statusColor: "text-emerald-500", dotColor: "bg-emerald-500" },
    { code: "EKO", name: "Ekonomi", group: "IPS", groupColor: "bg-orange-50 text-orange-500", levels: "X, XI, XII", hours: 4, teacher: "Ibu Kartika, S.E.", status: "Aktif", statusColor: "text-emerald-500", dotColor: "bg-emerald-500" },
    { code: "SEJ", name: "Sejarah", group: "IPS", groupColor: "bg-orange-50 text-orange-500", levels: "X, XI, XII", hours: 3, teacher: "Bpk. Suherman, M.Pd.", status: "Aktif", statusColor: "text-emerald-500", dotColor: "bg-emerald-500" },
    { code: "SOS", name: "Sosiologi", group: "IPS", groupColor: "bg-orange-50 text-orange-500", levels: "XI, XII", hours: 3, teacher: "Ibu Ratna, S.Pd.", status: "Aktif", statusColor: "text-emerald-500", dotColor: "bg-emerald-500" },
    { code: "GEO", name: "Geografi", group: "IPS", groupColor: "bg-orange-50 text-orange-500", levels: "X, XI, XII", hours: 3, teacher: "Bpk. Wahyu, M.Pd.", status: "Aktif", statusColor: "text-emerald-500", dotColor: "bg-emerald-500" },
    { code: "PKN", name: "PKn", group: "Wajib", groupColor: "bg-gray-100 text-gray-600", levels: "X, XI, XII", hours: 2, teacher: "Ibu Marlina, S.Pd.", status: "Aktif", statusColor: "text-emerald-500", dotColor: "bg-emerald-500" },
    { code: "PJK", name: "Penjaskes", group: "Wajib", groupColor: "bg-gray-100 text-gray-600", levels: "X, XI, XII", hours: 2, teacher: "Bpk. Eko, S.Pd.", status: "Nonaktif", statusColor: "text-gray-400", dotColor: "bg-gray-300" },
  ];

  if (viewMode === "add" || viewMode === "edit") {
    return (
      <div className="p-6 md:p-8 bg-[#F4F6FA] min-h-full">
        <SubjectForm 
          mode={viewMode} 
          initialData={selectedSubject} 
          onBack={() => {
            setViewMode("list");
            setSelectedSubject(null);
          }} 
        />
      </div>
    );
  }

  if (viewMode === "detail") {
    return (
      <div className="p-6 md:p-8 bg-[#F4F6FA] min-h-full">
        <SubjectDetail 
          data={selectedSubject} 
          onBack={() => {
            setViewMode("list");
            setSelectedSubject(null);
          }}
          onEdit={() => setViewMode("edit")}
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="text-[13px] font-medium text-gray-400 mb-1">
            Dashboard <span className="mx-1">&gt;</span> Kelola Akademik <span className="mx-1">&gt;</span> <span className="text-gray-600 font-bold">Mata Pelajaran</span>
          </div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Mata Pelajaran</h1>
          <p className="text-gray-500 text-[14px] mt-1">
            Kelola daftar mata pelajaran, alokasi jam, dan penugasan guru pengampu.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-gray-50 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Ekspor Daftar
          </button>
          <button 
            onClick={() => {
              setSelectedSubject(null);
              setViewMode("add");
            }}
            className="flex items-center gap-2 bg-[#1e293b] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:bg-[#0f172a] transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Tambah Mata Pelajaran
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <div>
            <div className="text-[12px] font-bold text-gray-400">Total Mata Pelajaran</div>
            <div className="text-[26px] font-bold text-[#1e293b] leading-tight mt-0.5">48</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div>
            <div className="text-[12px] font-bold text-gray-400">Sudah Ada Guru</div>
            <div className="text-[26px] font-bold text-[#1e293b] leading-tight mt-0.5">45</div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div>
            <div className="text-[12px] font-bold text-gray-400">Belum Ada Guru</div>
            <div className="text-[26px] font-bold text-[#1e293b] leading-tight mt-0.5">3</div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-500 flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div>
            <div className="text-[12px] font-bold text-gray-400">Total Jam / Minggu</div>
            <div className="text-[26px] font-bold text-[#1e293b] leading-tight mt-0.5">168</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
        {/* Filters Top */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <input 
                type="text" 
                placeholder="Cari mata pelajaran..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-full sm:w-[240px] focus:outline-none focus:border-gray-300 transition-colors"
              />
            </div>
            
            {/* Dropdown 1 */}
            <div className="relative">
              <select className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 focus:outline-none focus:border-gray-300 w-full sm:w-auto">
                <option>Semua Kelompok</option>
              </select>
              <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>

            {/* Dropdown 2 */}
            <div className="relative">
              <select className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 focus:outline-none focus:border-gray-300 w-full sm:w-auto">
                <option>Semua Jenjang</option>
              </select>
              <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-[12px] font-bold text-gray-500">
            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span> Wajib</div>
            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> IPA</div>
            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> IPS</div>
            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Lintas Minat</div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kode</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nama Mata Pelajaran</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kelompok</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Jenjang</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Jam / Minggu</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Guru Pengampu</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockData.filter((item) => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.teacher.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-bold text-gray-800 tracking-wide font-mono">{item.code}</span>
                  </td>
                  <td className="px-6 py-4 text-[14px] font-bold text-[#1e293b]">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${item.groupColor}`}>
                      {item.group}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-gray-500">{item.levels}</td>
                  <td className="px-6 py-4 text-[13px]">
                    <span className="font-bold text-gray-800">{item.hours}</span> <span className="text-gray-400">jam</span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-gray-500">{item.teacher}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor}`}></span>
                      <span className={`text-[12px] font-bold ${item.statusColor}`}>{item.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button 
                        onClick={() => {
                          setSelectedSubject({
                            kode: item.code,
                            nama: item.name,
                            kelompok: item.group,
                            jenjang: item.levels.split(", ").map(l => "Kelas " + l),
                            jam: item.hours,
                            guru: { id: item.teacher.substring(0, 2).toUpperCase(), name: item.teacher, role: "Guru Mapel", status: "Aktif" },
                            aktif: item.status === "Aktif",
                          });
                          setViewMode("detail");
                        }}
                        className="text-gray-400 hover:text-[#1e293b] transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedSubject({
                            kode: item.code,
                            nama: item.name,
                            kelompok: item.group,
                            jenjang: item.levels.split(", ").map(l => "Kelas " + l),
                            jam: item.hours,
                            guru: { id: item.teacher.substring(0, 2).toUpperCase(), name: item.teacher, role: "Guru Mapel", status: "Aktif" },
                            aktif: item.status === "Aktif",
                          });
                          setViewMode("edit");
                        }}
                        className="text-gray-400 hover:text-[#1A3D63] transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-5 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[13px] font-medium text-gray-500">
            Menampilkan 12 dari 48 mata pelajaran
          </div>
          <div className="flex items-center gap-1.5">
            <button className="px-3.5 py-2 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-400 hover:text-gray-600 transition-colors bg-white">Sebelumnya</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1e293b] text-white text-[13px] font-bold shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-500 text-[13px] font-bold transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-500 text-[13px] font-bold transition-colors">3</button>
            <button className="px-3.5 py-2 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-colors bg-white">Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subjects;
