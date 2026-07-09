import React, { useState, useEffect } from "react";
import { getAnnouncements } from "../../utils/announcementStore";
import api from "../../api/axios";

const GuruHome = ({ user, onNavigate }) => {
  const userName = user?.fullName || user?.nama || user?.nama_lengkap || user?.name || user?.email || "";
  const [guruData, setGuruData] = useState({
    nama: userName || "Memuat...",
    mapel: "-",
    tahunAjaran: "2025/2026",
    jumlahKelas: 0,
    jumlahSiswa: 0,
    id: null
  });
  const [jadwalHariIni, setJadwalHariIni] = useState([]);
  const [loading, setLoading] = useState(true);

  const [liveAnn, setLiveAnn] = useState([]);

  useEffect(() => {
    setLiveAnn(getAnnouncements().slice(0, 3));
  }, []);

  const fmt = (n) => "Rp " + n.toLocaleString("id-ID");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Ambil data guru spesifik
        const resGuru = await api.get(`/guru?search=${encodeURIComponent(userName)}`);
        const dataGuru = resGuru.data?.data?.[0]; // ambil yg pertama cocok
        
        let fetchedMapel = "-";
        let fetchedId = null;
        if (dataGuru) {
          fetchedMapel = dataGuru.mata_pelajaran || "-";
          fetchedId = dataGuru.id;
        }

        // 2. Ambil seluruh jadwal
        const resJadwal = await api.get('/jadwal-pelajaran?limit=1000');
        let rawJadwal = resJadwal.data?.data || [];
        
        // Filter jadwal untuk guru ini
        if (fetchedId) {
          rawJadwal = rawJadwal.filter(j => j.guru_id === fetchedId);
        } else {
          // fallback cari by name jika tidak ada guru_id
          rawJadwal = rawJadwal.filter(j => j.guru_nama?.toLowerCase().includes(userName?.toLowerCase()));
        }

        // Mapping hari 1-7 ke nama hari 
        const hariMap = {
          1: "Senin", 2: "Selasa", 3: "Rabu", 4: "Kamis", 5: "Jumat", 6: "Sabtu", 7: "Minggu"
        };
        const currentDayIndex = new Date().getDay() || 7; // 1 = Senin, 7 = Minggu
        const todayName = hariMap[currentDayIndex];

        // Format rawJadwal
        const mappedJadwal = rawJadwal.map(j => ({
          time: `${(j.jam_mulai || "").substring(0, 5)} - ${(j.jam_selesai || "").substring(0, 5)}`,
          jamMulai: j.jam_mulai,
          kelas: j.nama_kelas,
          subject: j.nama_mapel,
          hari: hariMap[j.hari] || j.hari,
          active: false
        }));

        // Filter jadwal hari ini
        let jadwalToday = mappedJadwal.filter(j => j.hari === todayName);
        
        // Cek jam aktif
        const now = new Date();
        const currentTime = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        jadwalToday = jadwalToday.map(j => {
           if (j.jamMulai <= currentTime) {
              // rough estimate
              return { ...j, active: true };
           }
           return j;
        }).sort((a,b) => a.jamMulai?.localeCompare(b.jamMulai));

        // Hitung unik kelas & estimasi siswa (dummy 32 per kelas jika API tak sedia total siswa spesifik)
        const uniqueKelas = new Set(mappedJadwal.map(j => j.kelas)).size;

        setGuruData(prev => ({
          ...prev,
          nama: dataGuru?.nama_lengkap || dataGuru?.nama || userName || "-",
          mapel: fetchedMapel,
          jumlahKelas: uniqueKelas,
          jumlahSiswa: uniqueKelas * 32, // Estimasi 32 siswa per kelas
          id: fetchedId
        }));
        
        setJadwalHariIni(jadwalToday);

      } catch (err) {
        console.error("Error fetching guru data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userName) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return <div className="p-6 md:p-8 flex justify-center items-center h-full">Memuat data akademik...</div>;
  }

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fadeIn">

      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b]">Selamat Datang! 👋</h1>
          <p className="text-[14px] text-gray-500 mt-1">
            {guruData.nama} · Guru Mata Pelajaran {guruData.mapel}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-gray-400">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>

      {/* Banner Panjang — Informasi Guru */}
      <div className="bg-gradient-to-r from-[#1A3D63] to-[#2A5F8F] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center border-2 border-white/30">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div>
              <p className="text-blue-200 text-[12px] font-semibold uppercase tracking-wider mb-0.5">Informasi Pengajar</p>
              <h2 className="text-[20px] font-bold">{guruData.nama}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[12px] font-semibold">{guruData.tahunAjaran}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right">
            <div>
              <p className="text-blue-200 text-[11px]">Mata Pelajaran</p>
              <p className="text-[14px] font-bold">{guruData.mapel}</p>
            </div>
            <div>
              <p className="text-blue-200 text-[11px]">Kelas Diajar</p>
              <p className="text-[14px] font-bold">{guruData.jumlahKelas} Kelas</p>
            </div>
            <div>
              <p className="text-blue-200 text-[11px]">Total Siswa</p>
              <p className="text-[14px] font-bold">{guruData.jumlahSiswa} Orang</p>
            </div>
            <div>
              <p className="text-blue-200 text-[11px]">Status</p>
              <p className="text-[14px] font-bold">Aktif</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards — Putih */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Gaji Bulan Ini",
            val: "Rp 4.105.000",
            unit: "",
            sub: "Ditransfer: 01 Jul 2026",
            color: "text-blue-600",
            bg: "bg-blue-50",
            icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          },
          {
            label: "Status Pembayaran",
            val: "Terbayar",
            unit: "",
            sub: "Gaji Bulan Juli 2026",
            color: "text-green-600",
            bg: "bg-green-50",
            icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
          },
          {
            label: "Jadwal Hari Ini",
            val: jadwalHariIni.length.toString(),
            unit: "Kelas",
            sub: jadwalHariIni.length > 0 ? `Mulai pukul ${jadwalHariIni[0]?.time.split('-')[0]}` : "Tidak ada jadwal",
            color: "text-amber-600",
            bg: "bg-amber-50",
            icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
          },
          {
            label: "Siswa Diajar",
            val: guruData.jumlahSiswa,
            unit: "Siswa",
            sub: `Dari ${guruData.jumlahKelas} kelas aktif`,
            color: "text-purple-600",
            bg: "bg-purple-50",
            icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
          },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={card.color}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.icon}/>
                </svg>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-[26px] font-black text-[#1e293b]">{card.val}</p>
              {card.unit && <p className="text-[13px] font-bold text-gray-500">{card.unit}</p>}
            </div>
            <p className="text-[12px] text-gray-500 font-medium mt-0.5">{card.label}</p>
            <p className="text-[11px] text-gray-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Informasi Akademik: Jadwal & Pengumuman */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Jadwal Mengajar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Jadwal Mengajar Hari Ini</h2>
            <button 
              onClick={() => onNavigate && onNavigate("Jadwal Seluruhnya")} 
              className="group flex items-center gap-1.5 text-[#1A3D63] text-sm font-semibold hover:text-[#2A5F8F] transition-colors"
            >
              Lihat Semua Jadwal
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="transform group-hover:translate-VII-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            {jadwalHariIni.length > 0 ? jadwalHariIni.map((jadwal, idx) => (
              <div key={idx} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${jadwal.active ? "bg-blue-50/50 border-blue-100 shadow-sm" : "bg-gray-50/50 border-gray-100 hover:bg-gray-50"}`}>
                <div className={`font-bold px-3 py-2 rounded-lg text-sm whitespace-nowrap ${jadwal.active ? "bg-[#1A3D63] text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
                  {jadwal.time}
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-sm flex items-center gap-2">
                    Kelas {jadwal.kelas}
                    {jadwal.active && <span className="bg-green-100 text-green-600 text-[10px] uppercase px-2 py-0.5 rounded-full tracking-wider">Sedang Berlangsung</span>}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 font-medium">{jadwal.subject}</div>
                </div>
              </div>
            )) : (
              <div className="text-center p-6 text-gray-400 font-medium border border-dashed rounded-xl">
                Tidak ada jadwal mengajar hari ini.
              </div>
            )}
          </div>
        </div>

        {/* Pengumuman Sekolah */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-gray-800">Pengumuman Sekolah</h2>
            <button onClick={() => onNavigate && onNavigate("Pengumuman Sekolah")} className="text-[12px] font-bold text-[#1A3D63] hover:underline">Lihat Semua →</button>
          </div>
          <div className="space-y-3">
            {liveAnn.length > 0 ? liveAnn.map(ann => (
              <div key={ann.id} className={`p-4 rounded-xl border relative overflow-hidden hover:opacity-90 transition-colors ${
                ann.importance === "Penting" ? "bg-red-50/50 border-red-100" : "bg-blue-50/50 border-blue-100"
              }`}>
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  ann.importance === "Penting" ? "bg-red-400" : "bg-blue-400"
                }`}></div>
                <div className={`text-[10px] font-black px-2.5 py-1 rounded-md tracking-wide uppercase mb-2 inline-flex items-center gap-1.5 ${
                  ann.importance === "Penting" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                }`}>
                  {ann.category.toUpperCase()}
                  {ann.importance === "Penting" && <span className="ml-1 px-1 bg-red-500 text-white rounded text-[8px]">PENTING</span>}
                </div>
                <div className="font-bold text-gray-800 text-[14px] mb-1 leading-snug">{ann.title}</div>
                <div className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed">{ann.desc}</div>
                <div className="text-[11px] text-gray-400 mt-1.5">Oleh: {ann.author} · {ann.date}</div>
              </div>
            )) : (
              <div className="text-[13px] text-gray-400 text-center py-6">Belum ada pengumuman.</div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action - Riwayat Terima Gaji */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
          </svg>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-[18px] font-bold text-gray-800 mb-1">Riwayat Terima Gaji</h3>
          <p className="text-[13px] text-gray-500">
            Lihat seluruh riwayat penerimaan gaji dan honor tambahan setiap bulan secara lengkap.
          </p>
        </div>
        <button
          onClick={() => onNavigate && onNavigate("Riwayat Terima Gaji")}
          className="px-6 py-2.5 bg-[#1A3D63] hover:bg-[#122A44] text-white text-[13px] font-bold rounded-xl transition-colors flex-shrink-0"
        >
          Lihat Riwayat
        </button>
      </div>

    </div>
  );
};

export default GuruHome;
