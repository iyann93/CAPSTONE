import React, { useState } from "react";

const ScheduleAdd = ({ setView, handleAdd }) => {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [formData, setFormData] = useState({
    class: "",
    subject: "",
    teacher: "",
    room: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getSubjectCode = (subject) => {
    if (!subject) return "";
    return subject.substring(0, 3).toUpperCase();
  };

  const getSubjectColor = (code) => {
    switch (code) {
      case "MAT": return "bg-blue-50 border-blue-200 text-blue-700";
      case "FIS": return "bg-pink-50 border-pink-200 text-pink-700";
      default: return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const onSave = () => {
    if (!formData.class || !formData.subject || !formData.teacher || !selectedDay || !selectedSlot || !formData.room) {
      alert("Harap lengkapi semua data wajib (*).");
      return;
    }

    const timeObj = timeSlots.find(t => t.label === selectedSlot);
    const code = getSubjectCode(formData.subject);

    const newSchedule = {
      class: formData.class,
      day: selectedDay,
      time: timeObj ? timeObj.time.replace(" - ", "-") : "",
      period: selectedSlot.replace("Jam ", "Jam ke-"),
      code: code,
      subject: formData.subject,
      teacher: formData.teacher,
      room: formData.room,
      status: isActive ? "Aktif" : "Nonaktif",
      color: getSubjectColor(code)
    };

    handleAdd(newSchedule);
  };

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
        Dashboard <span className="mx-2">›</span> Jadwal Pelajaran <span className="mx-2">›</span> <span className="text-[#1e293b] font-bold">Tambah Jadwal</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => setView("list")}
          className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-sm shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b] leading-tight">Tambah Jadwal Pelajaran</h1>
          <p className="text-[14px] text-gray-500 mt-1">Tambahkan slot jadwal belajar baru untuk kelas yang dipilih.</p>
        </div>
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
                  <select name="class" value={formData.class} onChange={handleChange} className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB] bg-white text-gray-500">
                    <option value="">Pilih kelas...</option>
                    <option value="X IPA 1">X IPA 1</option>
                    <option value="X IPA 2">X IPA 2</option>
                  </select>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-4 top-4 text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Mata Pelajaran<span className="text-red-500">*</span></label>
                <div className="relative">
                  <select name="subject" value={formData.subject} onChange={handleChange} className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB] bg-white text-gray-500">
                    <option value="">Pilih mata pelajaran...</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Fisika">Fisika</option>
                    <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    <option value="Kimia">Kimia</option>
                    <option value="Biologi">Biologi</option>
                    <option value="Bahasa Inggris">Bahasa Inggris</option>
                    <option value="PKn">PKn</option>
                    <option value="Seni Budaya">Seni Budaya</option>
                    <option value="PJOK">PJOK</option>
                  </select>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-4 top-4 text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2">Guru Pengampu<span className="text-red-500">*</span></label>
              <div className="relative">
                <select name="teacher" value={formData.teacher} onChange={handleChange} className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB] bg-white text-gray-500">
                  <option value="">Pilih guru pengampu...</option>
                  <option value="Drs. Hendra, M.Pd">Drs. Hendra, M.Pd</option>
                  <option value="Ibu Sari Dewi, S.Pd">Ibu Sari Dewi, S.Pd</option>
                  <option value="Ibu Rani Kusuma, S.Pd">Ibu Rani Kusuma, S.Pd</option>
                  <option value="Bpk. Ahmad Fauzi, M.Pd">Bpk. Ahmad Fauzi, M.Pd</option>
                  <option value="Ibu Dewi Anggraini, S.Pd">Ibu Dewi Anggraini, S.Pd</option>
                  <option value="Bpk. James Hutapea, S.Pd">Bpk. James Hutapea, S.Pd</option>
                  <option value="Ibu Nurdiana, S.Pd">Ibu Nurdiana, S.Pd</option>
                  <option value="Ibu Ani Sulistyo, S.Sn">Ibu Ani Sulistyo, S.Sn</option>
                  <option value="Bpk. Rizal Maulana, S.Pd">Bpk. Rizal Maulana, S.Pd</option>
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
              <input type="text" name="room" value={formData.room} onChange={handleChange} placeholder="cth. Ruang 101, Lab Fisika, Lapangan..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB]" />
            </div>
          </div>

          {/* Semester */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Semester</h3>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2">Tahun Ajaran & Semester</label>
              <input type="text" placeholder="cth. Ganjil 2023/2024" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB] bg-[#F8FAFC] text-gray-500" />
            </div>
          </div>

        </div>

        {/* Right Column (Preview & Action) */}
        <div className="space-y-6">
          {/* Pratinjau Jadwal */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Pratinjau Jadwal</h3>
            <div className="border border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center text-gray-400">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <p className="text-[13px] font-medium leading-relaxed max-w-[200px]">Isi form untuk melihat pratinjau jadwal</p>
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

          {/* Warning Banner */}
          <div className="bg-[#FEFBF0] border border-[#FDE8A4] rounded-2xl p-4 flex gap-3 text-[#A16207]">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
            <p className="text-[12px] font-semibold leading-relaxed">Pastikan slot jam belum digunakan oleh guru yang sama di kelas lain pada hari dan jam yang sama.</p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button onClick={onSave} className="w-full py-3.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-[14px] font-bold transition-colors flex items-center justify-center gap-2 shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              Simpan Jadwal
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

export default ScheduleAdd;
