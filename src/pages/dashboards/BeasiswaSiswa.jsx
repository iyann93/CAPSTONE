import React, { useState, useEffect } from "react";
import { getBeasiswa } from "../../api/finance";

const BeasiswaSiswa = ({ user }) => {
  const [beasiswaList, setBeasiswaList] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  const studentName = user?.anak?.nama || "Siswa";
  const studentClass = user?.anak?.kelas || "-";
  const siswaId = user?.anak?.id;

  useEffect(() => {
    if (siswaId) {
      getBeasiswa({ siswa_id: siswaId })
        .then(data => {
          setBeasiswaList(data);
          if (data.length > 0) setSelectedProgram(data[0]);
        })
        .catch(err => console.error("Failed to fetch beasiswa:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [siswaId]);

  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const getPeriodeBerlaku = (program) => {
    if (!program) return "-";
    try {
      const storedPrograms = JSON.parse(localStorage.getItem('capstone_program_beasiswa')) || [];
      const originalProgram = storedPrograms.find(p => p.title.toLowerCase() === program.nama_beasiswa.toLowerCase());
      if (originalProgram && originalProgram.periodePendaftaran) {
        return originalProgram.periodePendaftaran.replace(/\s+\d{4}\/\d{4}$/, "");
      }
    } catch (e) {}
    return program.periode ? program.periode.replace(/\s+\d{4}\/\d{4}$/, "") : "-";
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb */}
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Beasiswa</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-[26px] font-bold text-[#1e293b]">Program Beasiswa</h1>
        <p className="text-[14px] text-gray-500 mt-1">{studentName} · {studentClass.toLowerCase().includes('kelas') ? studentClass : `Kelas ${studentClass}`} · Rincian program beasiswa yang sedang berjalan</p>
      </div>

      {loading ? (
        <div className="text-center p-8 text-gray-500">Memuat data beasiswa...</div>
      ) : beasiswaList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center p-12 text-center text-gray-400">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="mb-4 opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-[16px] font-medium text-gray-600 mb-2">Tidak Ada Beasiswa Aktif</p>
          <p className="text-[14px]">Siswa ini tidak terdaftar dalam program beasiswa apapun saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Program List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-[15px] font-bold text-gray-800 mb-2">Rincian Program Beasiswa yang diterima</h3>
            {beasiswaList.map((item) => {
              const isSelected = selectedProgram?.id === item.id;
              const statusDisplay = item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "-";
              return (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedProgram(item)}
                  className={`bg-white border rounded-2xl p-4 shadow-sm cursor-pointer transition-all ${
                    isSelected ? "border-[#1A3D63] ring-1 ring-[#1A3D63]" : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-[15px] font-bold ${isSelected ? "text-[#1A3D63]" : "text-gray-800"} truncate pr-2`}>{item.nama_beasiswa}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${
                        item.status === "aktif" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                      }`}>
                        {statusDisplay}
                      </span>
                    </div>
                    <p className="text-[12px] text-gray-500">{formatCurrency(item.nominal)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Program Detail Panel */}
          <div className="lg:col-span-2">
            {selectedProgram ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 animate-fadeIn h-full">
                {/* Header Title */}
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-[26px] font-bold text-gray-800 capitalize leading-tight">{selectedProgram.nama_beasiswa}</h2>
                  <span className={`px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider flex-shrink-0 ${
                    selectedProgram.status === "aktif" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {selectedProgram.status ? selectedProgram.status.charAt(0).toUpperCase() + selectedProgram.status.slice(1) : "-"}
                  </span>
                </div>
                <p className="text-[14px] text-gray-500 mb-8">
                  Tahun Ajaran {selectedProgram.periode ? (selectedProgram.periode.match(/\d{4}\/\d{4}$/) || ["2025/2026"])[0] : "2025/2026"}
                </p>

                {/* Grid Info */}
                <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-8">
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nominal Bantuan</p>
                    <p className="text-[16px] font-bold text-gray-800">{formatCurrency(selectedProgram.nominal)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Periode Berlaku</p>
                    <p className="text-[14px] font-bold text-gray-800">
                      {getPeriodeBerlaku(selectedProgram)}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default BeasiswaSiswa;


