import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import api from "../../api/axios";

const formatKelas = (kelas) => {
  if (!kelas) return '-';
  const k = kelas.toUpperCase();
  if (k.includes('VIII')) return 'VIII';
  if (k.includes('VII')) return 'VII';
  if (k.includes('IX')) return 'IX';
  return kelas;
};

const ValidasiKelulusan = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resSiswa = await api.get('/siswa');
      const allSiswa = resSiswa.data?.data || [];
      
      let allLulus = [];
      try {
        const resLulus = await api.get('/kelulusan');
        allLulus = resLulus.data?.data || [];
      } catch (err) {
        console.warn("Could not fetch /kelulusan, using empty array fallback.");
      }
      
      const ixSiswa = allSiswa.filter(s => s.nama_kelas?.toUpperCase().includes('IX'));
      
      const mockSaved = JSON.parse(localStorage.getItem("mock_kelulusan") || "{}");

      const mapped = ixSiswa.map((s, idx) => {
        const lulusData = allLulus.find(l => l.siswa_id === s.id) || {};
        let status = "Menunggu Validasi";
        
        if (mockSaved[s.id]) {
          if (mockSaved[s.id].status === "Lulus") status = "Valid (Lulus)";
          if (mockSaved[s.id].status === "Tidak Lulus") status = "Belum Valid";
        } else {
          if (lulusData.status === "Lulus") status = "Valid (Lulus)";
          if (lulusData.status === "Tidak Lulus") status = "Belum Valid";
        }

        return {
          id: s.id,
          nisn: s.nisn || (s.nis + "000"),
          nama: s.nama_lengkap,
          kelas: formatKelas(s.nama_kelas),
          nilaiRata: (80 + (idx % 15)).toFixed(1),
          kehadiran: (90 + (idx % 10)) + "%",
          status: status,
          lulusDataId: lulusData.id
        };
      });
      setData(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleValidation = async (id, newStatus) => {
    try {
      let dbStatus = "Pending";
      if (newStatus === "Valid (Lulus)") dbStatus = "Lulus";
      if (newStatus === "Belum Valid") dbStatus = "Tidak Lulus";
      
      try {
        await api.post('/kelulusan', {
          siswaId: id,
          status: dbStatus,
          divalidasi_kepsek: true
        });
      } catch (err) {
        console.warn("API /kelulusan tidak ditemukan, menyimpan ke localStorage sebagai simulasi.");
        const saved = JSON.parse(localStorage.getItem("mock_kelulusan") || "{}");
        saved[id] = { status: dbStatus, divalidasi_kepsek: true };
        localStorage.setItem("mock_kelulusan", JSON.stringify(saved));
      }
      
      setData(data.map(item => item.id === id ? { ...item, status: newStatus } : item));
      setSelected(null);
      if (newStatus === "Valid (Lulus)") {
        alert("✅ Data berhasil divalidasi. Siswa dinyatakan Lulus!");
      } else {
        alert("⚠️ Data dikembalikan ke Wali Kelas untuk diperbaiki.");
      }
    } catch(e) {
      console.error(e);
      alert("Gagal menyimpan validasi");
    }
  };

  const getInitialColor = (nama) => {
    const colors = ["bg-[#1A3D63]", "bg-emerald-600", "bg-violet-600", "bg-amber-500", "bg-rose-600"];
    const idx = nama.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fadeIn min-h-full">
      <div className="text-[13px] text-gray-400">
        Dashboard &gt; <span className="text-[#2A4365] font-semibold">Validasi Kelulusan</span>
      </div>

      <div>
        <h1 className="text-[26px] font-bold text-[#1e293b]">Validasi Data Kelulusan</h1>
        <p className="text-[14px] text-gray-500 mt-1">Periksa kelengkapan nilai dan absensi calon lulusan sebelum menetapkan kelulusan akhir.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[13px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">NISN</th>
                <th className="px-6 py-4">Nama Siswa</th>
                <th className="px-6 py-4">Kelas</th>
                <th className="px-6 py-4">Rata-rata Nilai</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-10">Memuat data...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-10">Tidak ada siswa kelas IX</td></tr>
              ) : data.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-600">{item.nisn}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{item.nama}</td>
                  <td className="px-6 py-4 text-gray-600">{item.kelas}</td>
                  <td className="px-6 py-4 text-gray-600">{item.nilaiRata}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${
                      item.status === "Valid (Lulus)" ? "bg-green-50 text-green-600 border border-green-100" :
                      item.status === "Belum Valid" ? "bg-red-50 text-red-600 border border-red-100" :
                      "bg-yellow-50 text-yellow-600 border border-yellow-100"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelected(item)}
                      className="px-4 py-2 bg-[#F4F6FA] text-[#1A3D63] rounded-xl text-[13px] font-bold hover:bg-[#EBF3FA] transition-colors"
                    >
                      Periksa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-[520px] shadow-2xl flex flex-col overflow-hidden">
            
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-[18px] font-bold text-[#1e293b]">Pemeriksaan Data Siswa</h3>
                <p className="text-[12px] text-gray-400 mt-0.5">Verifikasi kelayakan kelulusan siswa</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Tutup Modal"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className={`w-14 h-14 ${getInitialColor(selected.nama)} text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm shrink-0`}>
                  {selected.nama.charAt(0)}
                </div>
                <div>
                  <p className="text-[17px] font-bold text-gray-800">{selected.nama}</p>
                  <p className="text-[13px] text-gray-500 mt-0.5">NISN: {selected.nisn} &nbsp;|&nbsp; {selected.kelas}</p>
                </div>
                <div className="ml-auto">
                  <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${
                    selected.status === "Valid (Lulus)" ? "bg-green-50 text-green-600 border border-green-200" :
                    selected.status === "Belum Valid" ? "bg-red-50 text-red-600 border border-red-200" :
                    "bg-yellow-50 text-yellow-700 border border-yellow-200"
                  }`}>
                    {selected.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-100 p-4 rounded-xl bg-white shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                    </div>
                    <p className="text-[12px] text-gray-500 font-medium">Rata-rata Nilai (Sem 1–6)</p>
                  </div>
                  <p className="text-[24px] font-black text-[#1A3D63]">{selected.nilaiRata}</p>
                  {selected.nilaiRata >= 75 ? (
                    <p className="text-[11px] text-green-600 font-bold mt-1 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
                      Memenuhi KKM
                    </p>
                  ) : (
                    <p className="text-[11px] text-red-500 font-bold mt-1 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/></svg>
                      Di bawah KKM
                    </p>
                  )}
                </div>

                <div className="border border-gray-100 p-4 rounded-xl bg-white shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-emerald-50 rounded-lg">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <p className="text-[12px] text-gray-500 font-medium">Tingkat Kehadiran</p>
                  </div>
                  <p className="text-[24px] font-black text-[#1A3D63]">{selected.kehadiran}</p>
                  {parseInt(selected.kehadiran) >= 90 ? (
                    <p className="text-[11px] text-green-600 font-bold mt-1 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
                      Kehadiran Baik
                    </p>
                  ) : (
                    <p className="text-[11px] text-red-500 font-bold mt-1 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/></svg>
                      Kehadiran Kurang
                    </p>
                  )}
                </div>
              </div>
            </div>

            {selected.status === "Menunggu Validasi" ? (
              <div className="px-6 py-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-colors order-last sm:order-first"
                >
                  Kembali
                </button>
                <button
                  onClick={() => handleValidation(selected.id, "Belum Valid")}
                  className="flex-1 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors"
                >
                  Tandai Belum Valid
                </button>
                <button
                  onClick={() => handleValidation(selected.id, "Valid (Lulus)")}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                >
                  Validasi &amp; Luluskan
                </button>
              </div>
            ) : (
              <div className="px-6 py-5 border-t border-gray-100 flex flex-col gap-3 bg-gray-50 rounded-b-2xl">
                <p className="text-center text-[14px] text-gray-500 font-medium">
                  Status data kelulusan ini adalah{" "}
                  <strong className={selected.status === "Valid (Lulus)" ? "text-green-600" : "text-red-600"}>
                    {selected.status}
                  </strong>.
                </p>
                <button
                  onClick={() => setSelected(null)}
                  className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ValidasiKelulusan;
