import React, { useState, useEffect } from "react";
import api from "../../api/axios";

const JadwalGuruMapel = ({ user, onNavigate }) => {
  const [groupedJadwal, setGroupedJadwal] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ambil ID Guru
        const resGuru = await api.get(`/guru?search=${encodeURIComponent(user?.email || "")}`);
        const dataGuru = resGuru.data?.data?.[0];
        const fetchedId = dataGuru?.id;

        // Ambil jadwal
        const resJadwal = await api.get('/jadwal-pelajaran?limit=1000');
        let rawJadwal = resJadwal.data?.data || [];
        
        if (fetchedId) {
          rawJadwal = rawJadwal.filter(j => j.guru_id === fetchedId);
        } else {
          rawJadwal = rawJadwal.filter(j => j.guru_nama?.toLowerCase().includes(user?.fullName?.toLowerCase()));
        }

        const hariMap = {
          1: "Senin", 2: "Selasa", 3: "Rabu", 4: "Kamis", 5: "Jumat", 6: "Sabtu", 7: "Minggu"
        };

        const mappedJadwal = rawJadwal.map(j => ({
          jam: `${(j.jam_mulai || "").substring(0, 5)} - ${(j.jam_selesai || "").substring(0, 5)}`,
          jamMulai: j.jam_mulai,
          kelas: j.nama_kelas,
          subject: j.nama_mapel,
          hari: hariMap[j.hari] || j.hari
        }));

        // Grouping
        const grouped = mappedJadwal.reduce((acc, curr) => {
          if (!acc[curr.hari]) acc[curr.hari] = [];
          acc[curr.hari].push(curr);
          return acc;
        }, {});

        // Sort jam per hari
        Object.keys(grouped).forEach(hari => {
          grouped[hari].sort((a,b) => a.jamMulai?.localeCompare(b.jamMulai));
        });

        setGroupedJadwal(grouped);

      } catch (err) {
        console.error("Error fetching jadwal guru:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.email || user?.fullName) {
      fetchData();
    }
  }, [user]);

  const hariUrutan = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  if (loading) {
    return <div className="p-6 md:p-8 flex justify-center items-center h-full">Memuat jadwal akademik...</div>;
  }

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
        {Object.keys(groupedJadwal).length === 0 ? (
          <div className="text-center p-12 text-gray-400 font-medium bg-white rounded-2xl border border-gray-100 shadow-sm">
            Tidak ada jadwal mengajar yang ditemukan untuk akun Anda.
          </div>
        ) : (
          hariUrutan.map(hari => {
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
          })
        )}
      </div>
    </div>
  );
};

export default JadwalGuruMapel;
