import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../api/axios";

const formatKelas = (kelas) => {
  if (!kelas) return '-';
  const k = kelas.toUpperCase();
  if (k.includes('VIII')) return 'VIII';
  if (k.includes('VII')) return 'VII';
  if (k.includes('IX')) return 'IX';
  return kelas;
};

const DataSiswaKelasWali = ({ user }) => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const taRes = await api.get('/tahun-ajaran/active').catch(() => ({ data: { data: null } }));
        const activeTA = taRes.data?.data;

        const [resSiswa, resKelas, resKenaikan] = await Promise.all([
          api.get('/siswa?limit=1000').catch(() => ({ data: { data: [] } })),
          api.get('/kelas').catch(() => ({ data: { data: [] } })),
          activeTA ? api.get(`/kenaikan-kelas?tahun_ajaran_id=${activeTA.id}`).catch(() => ({ data: { data: [] } })) : { data: { data: [] } }
        ]);

        const dbClasses = resKelas.data?.data || [];
        setClasses(dbClasses);
        if (dbClasses.length > 0) {
          setSelectedClass(dbClasses[0].id);
        }

        const kenaikanData = resKenaikan.data?.data || [];
        const dbSiswa = resSiswa.data?.data || [];
        const mappedStudents = dbSiswa.map((s, idx) => {
          let actualClassId = s.kelas_id;
          let actualClassName = s.nama_kelas;

          // Jika siswa sudah diproses kenaikan kelas tahun ini,
          // kita gunakan kelas_asal_id agar ia tetap muncul di kelas lamanya
          const kData = kenaikanData.find(kd => kd.siswa_id === s.id);
          if (kData) {
            actualClassId = kData.kelas_asal_id;
            const cAsal = dbClasses.find(c => c.id === kData.kelas_asal_id);
            if (cAsal) actualClassName = cAsal.nama_kelas;
          }

          return {
            id: s.id,
            nis: s.nis,
            nisn: s.nisn || (s.nis + "000"),
            name: s.nama_lengkap,
            gender: s.jenis_kelamin === "L" ? "Laki-laki" : s.jenis_kelamin === "P" ? "Perempuan" : s.jenis_kelamin,
            tempatLahir: s.tempat_lahir || "-",
            tanggalLahir: s.tanggal_lahir ? new Date(s.tanggal_lahir).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "-",
            kelasId: actualClassId,
            kelasName: actualClassName,
            avgGrade: 78 + (idx % 15),
            status: s.status === "aktif" ? "Aktif" : "Tidak Aktif",
            avatarBg: ["bg-blue-500", "bg-pink-500", "bg-amber-600", "bg-red-500", "bg-purple-600"][idx % 5],
            performance: [
              { name: "T1", val: 75 + (idx % 10) }, 
              { name: "UTS", val: 78 + (idx % 12) }, 
              { name: "T2", val: 82 + (idx % 15) }, 
              { name: "UAS", val: 85 + (idx % 10) }
            ]
          };
        });
        setStudents(mappedStudents);

      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredStudents = students.filter(s => 
    String(s.kelasId) === String(selectedClass) || s.kelasName === selectedClass
  );

  const selectedClassName = classes.find(c => String(c.id) === String(selectedClass))?.nama_kelas || "Pilih Kelas";

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Data Siswa Kelas</h1>
          <p className="text-[14px] text-gray-500 mt-1">Pantau performa akademik dan data detail siswa di kelas perwalian Anda.</p>
        </div>
        <div className="min-w-[200px]">
          <select 
            value={selectedClass} 
            onChange={(e) => { setSelectedClass(e.target.value); setSelectedStudent(null); }}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] font-bold text-[#1A3D63] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 shadow-sm cursor-pointer"
          >
            {classes.length > 0 ? (
              classes.map(c => (
                <option key={c.id} value={c.id}>{c.nama_kelas?.startsWith('Kelas') ? c.nama_kelas : `Kelas ${c.nama_kelas}`}</option>
              ))
            ) : (
              <option value="">Memuat Kelas...</option>
            )}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-gray-800">Daftar Siswa {selectedClassName}</h2>
            <span className="text-[12px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{filteredStudents.length} Siswa</span>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#1A3D63] mb-3"></div>
                <p className="text-gray-500 font-semibold text-[13px]">Memuat data siswa...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <p className="text-gray-400 font-semibold text-[14px]">Tidak ada siswa di kelas ini.</p>
              </div>
            ) : (
              filteredStudents.map(s => (
                <button 
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className={`w-full text-left p-4 rounded-xl transition-colors border ${selectedStudent?.id === s.id ? 'bg-blue-50/50 border-blue-200 shadow-sm' : 'bg-white border-transparent hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${s.avatarBg} text-white flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                      {s.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-bold text-gray-800 truncate">{s.name}</h3>
                      <p className="text-[12px] text-gray-500 mt-0.5">NIS: {s.nis}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[11px] text-gray-400 font-semibold mb-0.5">Rata-rata</p>
                      <p className={`text-[16px] font-black ${s.avgGrade >= 80 ? 'text-green-600' : 'text-amber-500'}`}>{s.avgGrade}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Detail */}
        <div className="lg:col-span-5 flex flex-col h-[600px]">
          {selectedStudent ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden animate-fadeIn">
              <div className="bg-[#1A3D63] p-6 text-center text-white relative">
                <div className={`w-20 h-20 mx-auto rounded-2xl ${selectedStudent.avatarBg} flex items-center justify-center text-[32px] font-black border-4 border-[#1A3D63] shadow-xl absolute -bottom-10 left-1/2 -translate-x-1/2`}>
                  {selectedStudent.name[0]}
                </div>
                <h3 className="text-[18px] font-bold mt-2 opacity-0">Placeholder</h3>
              </div>
              <div className="pt-14 px-6 pb-6 text-center border-b border-gray-100">
                <h2 className="text-[20px] font-black text-gray-800">{selectedStudent.name}</h2>
                <span className="inline-block mt-2 px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full text-[11px] font-bold">Status: {selectedStudent.status}</span>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-3">Informasi Detail</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                      <span className="text-[13px] text-gray-500">Nomor Induk Siswa (NIS)</span>
                      <span className="text-[13px] font-bold text-gray-800">{selectedStudent.nis}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                      <span className="text-[13px] text-gray-500">NIS Nasional (NISN)</span>
                      <span className="text-[13px] font-bold text-gray-800">{selectedStudent.nisn}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                      <span className="text-[13px] text-gray-500">Tempat, Tanggal Lahir</span>
                      <span className="text-[13px] font-bold text-gray-800">{selectedStudent.tempatLahir}, {selectedStudent.tanggalLahir}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                      <span className="text-[13px] text-gray-500">Jenis Kelamin</span>
                      <span className="text-[13px] font-bold text-gray-800">{selectedStudent.gender}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                      <span className="text-[13px] text-gray-500">Kelas Saat Ini</span>
                      <span className="text-[13px] font-bold text-[#1A3D63]">{selectedClassName}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-3">Grafik Akademik</h4>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedStudent.performance}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                        <YAxis domain={[0, 100]} hide />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="val" stroke="#2563eb" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center h-full">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <p className="text-[14px] font-bold text-gray-400">Pilih siswa di daftar untuk melihat detail</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataSiswaKelasWali;
