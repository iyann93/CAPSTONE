import React from "react";

const mockJadwal = [
  { hari: "Senin", jam: "07:30 - 09:00", kelas: "VII A", subject: "Bahasa Indonesia" },
  { hari: "Senin", jam: "09:15 - 10:45", kelas: "VII B", subject: "Bahasa Indonesia" },
  { hari: "Senin", jam: "11:00 - 12:30", kelas: "VIII A", subject: "Bahasa Indonesia" },
  { hari: "Selasa", jam: "07:30 - 09:00", kelas: "VIII B", subject: "Bahasa Indonesia" },
  { hari: "Selasa", jam: "09:15 - 10:45", kelas: "IX A", subject: "Bahasa Indonesia" },
  { hari: "Rabu", jam: "07:30 - 09:00", kelas: "IX B", subject: "Bahasa Indonesia" },
  { hari: "Rabu", jam: "09:15 - 10:45", kelas: "VII A", subject: "Bahasa Indonesia" },
  { hari: "Kamis", jam: "07:30 - 09:00", kelas: "VII B", subject: "Bahasa Indonesia" },
  { hari: "Jumat", jam: "07:30 - 09:00", kelas: "VIII A", subject: "Bahasa Indonesia" },
  { hari: "Jumat", jam: "09:15 - 10:45", kelas: "VIII B", subject: "Bahasa Indonesia" },
];

const JadwalGuruMapel = ({ user, onNavigate }) => {
  // Group by hari
  const groupedJadwal = mockJadwal.reduce((acc, curr) => {
    if (!acc[curr.hari]) acc[curr.hari] = [];
    acc[curr.hari].push(curr);
    return acc;
  }, {});

  const hariUrutan = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb */}
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Jadwal Mengajar Seluruhnya</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <button 
            onClick={() => onNavigate && onNavigate("Dashboard")} 
            className="text-[13px] text-blue-600 font-bold mb-3 flex items-center gap-1.5 hover:text-blue-800 transition-colors"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Kembali ke Dashboard
          </button>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Jadwal Mengajar Seluruhnya</h1>
          <p className="text-[14px] text-gray-500 mt-1">Daftar lengkap jadwal mengajar Anda per hari.</p>
        </div>
      </div>

      <div className="space-y-6">
        {hariUrutan.map(hari => {
          if (!groupedJadwal[hari]) return null;
          return (
            <div key={hari} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#1A3D63] px-6 py-3">
                <h2 className="text-white font-bold text-[16px]">{hari}</h2>
              </div>
              <div className="p-0">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      <th className="py-3 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-[150px]">Waktu</th>
                      <th className="py-3 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-[120px]">Kelas</th>
                      <th className="py-3 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Mata Pelajaran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {groupedJadwal[hari].map((jadwal, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 text-[13px] font-bold text-gray-800">
                          <div className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg inline-block">
                            {jadwal.jam}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-[13px] font-bold text-[#1A3D63]">{jadwal.kelas}</td>
                        <td className="py-4 px-6 text-[13px] text-gray-600 font-medium">{jadwal.subject}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JadwalGuruMapel;
