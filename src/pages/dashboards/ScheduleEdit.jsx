import React, { useState } from "react";

const ScheduleEdit = ({ setView }) => {
  const [selectedDay, setSelectedDay] = useState("Senin");
  const [selectedSlot, setSelectedSlot] = useState("Jam 1-2");
  const [isActive, setIsActive] = useState(true);

  const timeSlots = [
    { label: "Jam 1-2", time: "07:00 - 08:30" },
    { label: "Jam 3-4", time: "08:30 - 10:00" },
    { label: "Jam 5-6", time: "10:15 - 11:45" },
    { label: "Jam 7-8", time: "11:45 - 13:05" },
    { label: "Jam 9-10", time: "13:05 - 14:35" }
  ];

  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full font-sans">
      {/* Breadcrumb */}
      <div className="text-[13px] font-medium text-gray-500 mb-1">
        Dashboard <span className="mx-2">›</span> Jadwal Pelajaran <span className="mx-2">›</span> <span className="text-[#1e293b] font-bold">Edit Jadwal</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView("list")}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-sm shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <div>
            <h1 className="text-[26px] font-bold text-[#1e293b] leading-tight">Edit Jadwal</h1>
            <p className="text-[14px] text-gray-500 mt-1">Perubahan akan berpengaruh pada jadwal aktif semester berjalan.</p>
          </div>
        </div>
        <button className="bg-white border border-red-200 text-red-500 hover:bg-red-50 px-5 py-2.5 rounded-xl font-bold text-[13px] shadow-sm transition-all flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Hapus Jadwal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Form) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Informasi Kelas & Mata Pelajaran */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-5">Informasi Kelas & Mata Pelajaran</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Kelas<span className="text-red-500">*</span></label>
                <div className="relative">
                  <select defaultValue="X IPA 1" className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB] bg-white text-gray-700">
                    <option value="X IPA 1">X IPA 1</option>
                    <option value="X IPA 2">X IPA 2</option>
                  </select>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-4 top-4 text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Mata Pelajaran<span className="text-red-500">*</span></label>
                <div className="relative">
                  <select defaultValue="Matematika" className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB] bg-white text-gray-700">
                    <option value="Matematika">Matematika</option>
                    <option value="Fisika">Fisika</option>
                  </select>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-4 top-4 text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2">Guru Pengampu<span className="text-red-500">*</span></label>
              <div className="relative">
                <select defaultValue="Drs. Hendra, M.Pd" className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB] bg-white text-gray-700">
                  <option value="Drs. Hendra, M.Pd">Drs. Hendra, M.Pd</option>
                  <option value="Ibu Sari Dewi, S.Pd">Ibu Sari Dewi, S.Pd</option>
                </select>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-4 top-4 text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>

          {/* Waktu & Tempat Belajar */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-5">Waktu & Tempat Belajar</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-3">Hari<span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map((day) => (
                    <button
                      type="button"
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-4 py-2 text-[13px] font-bold rounded-xl border transition-all ${
                        selectedDay === day 
                          ? "bg-[#3B82F6] border-[#3B82F6] text-white shadow-sm" 
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-3">Slot Jam Pelajaran<span className="text-red-500">*</span></label>
                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50">
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot.label}
                      onClick={() => setSelectedSlot(slot.label)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                        selectedSlot === slot.label 
                          ? "bg-[#3B82F6] text-white" 
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-[13px] font-bold">{slot.label}</span>
                      <span className={`text-[11px] ${selectedSlot === slot.label ? "text-blue-100" : "text-gray-400"}`}>{slot.time}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2">Ruangan<span className="text-red-500">*</span></label>
              <input type="text" defaultValue="Ruang 101" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB]" />
            </div>
          </div>

          {/* Semester */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Semester</h3>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2">Tahun Ajaran & Semester</label>
              <input type="text" defaultValue="Ganjil 2023/2024" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB] bg-[#F8FAFC] text-gray-500" />
            </div>
          </div>

          {/* Riwayat Perubahan */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-6">Riwayat Perubahan</h3>
            <div className="relative pl-6 space-y-6">
              <div className="absolute top-2 bottom-2 left-[11px] w-px bg-gray-200"></div>
              
              <div className="relative">
                <div className="absolute -left-[28px] top-1 w-6 h-6 rounded-full bg-[#818CF8] text-white flex items-center justify-center text-[9px] font-bold border-2 border-white">SR</div>
                <div>
                  <div className="text-[13px] font-bold text-[#1e293b]">Siti Rahayu</div>
                  <div className="text-[12px] text-gray-500 mt-0.5">Mengubah ruangan dari Ruang 101 ke Lab Fisika</div>
                  <div className="text-[11px] text-gray-400 mt-1">8 Nov 2023 · 10:20</div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[28px] top-1 w-6 h-6 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-[9px] font-bold border-2 border-white">AS</div>
                <div>
                  <div className="text-[13px] font-bold text-[#1e293b]">Admin Sistem</div>
                  <div className="text-[12px] text-gray-500 mt-0.5">Jadwal pertama kali dibuat</div>
                  <div className="text-[11px] text-gray-400 mt-1">12 Jul 2023 · 08:00</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Preview & Action) */}
        <div className="space-y-6">
          {/* Pratinjau Jadwal */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Pratinjau Jadwal</h3>
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-5 text-[#1e3a8a]">
              <div className="text-[13px] font-bold flex items-center justify-between">
                <span>X IPA 1 · Ganjil 2023/2024</span>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-[12px] font-medium text-blue-800">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Senin
                </div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-blue-800">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  07:00 – 08:30 (Jam 1-2)
                </div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-blue-800">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Ruang 101
                </div>
              </div>
              <div className="border-t border-[#BFDBFE] mt-4 pt-4">
                <div className="text-[15px] font-black text-blue-900 leading-tight">Matematika</div>
                <div className="text-[12px] text-blue-800 font-medium mt-1">Drs. Hendra, M.Pd</div>
              </div>
            </div>
          </div>

          {/* Status Jadwal */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Status Jadwal</h3>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[14px] font-bold text-[#1e293b]">Aktif</div>
                <div className="text-[11px] text-gray-400">Jadwal aktif dan berlaku</div>
              </div>
              <div 
                onClick={() => setIsActive(!isActive)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isActive ? "bg-[#3B82F6]" : "bg-gray-200"}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isActive ? "translate-x-6" : ""}`}></div>
              </div>
            </div>
          </div>

          {/* Informasi Data */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Informasi Data</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[13px] text-gray-500">
                <span>ID Jadwal</span>
                <span className="font-bold text-[#1e293b]">#1</span>
              </div>
              <div className="flex justify-between items-center text-[13px] text-gray-500">
                <span>Kelas</span>
                <span className="font-bold text-[#1e293b]">X IPA 1</span>
              </div>
              <div className="flex justify-between items-center text-[13px] text-gray-500">
                <span>Jam ke-</span>
                <span className="font-bold text-[#1e293b]">1-2</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full py-3.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-[14px] font-bold transition-colors flex items-center justify-center gap-2 shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              Simpan Perubahan
            </button>
            <button 
              onClick={() => setView("list")}
              className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-[14px] font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              Batalkan
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ScheduleEdit;
