import React, { useState, useEffect } from "react";
import api from "../../api/axios";

const timeSlots = [
  { label: "Jam 1-2",  time: "07:00 - 08:30" },
  { label: "Jam 3-4",  time: "08:30 - 10:00" },
  { label: "Jam 5-6",  time: "10:15 - 11:45" },
  { label: "Jam 7-8",  time: "11:45 - 13:05" },
  { label: "Jam 9-10", time: "13:05 - 14:35" },
];

const getSubjectCode = (subject) => {
  const map = {
    "Matematika": "MTK", "Fisika": "FIS", "Kimia": "KIM",
    "Biologi": "BIO", "Bahasa Indonesia": "IND", "Bahasa Inggris": "ENG",
    "PKn": "PKN", "Seni Budaya": "SBD", "PJOK": "PJK",
    "Ekonomi": "EKO", "Geografi": "GEO", "Sejarah": "SEJ",
  };
  return map[subject] || subject.substring(0, 3).toUpperCase();
};

const ScheduleEdit = ({ setView, handleEdit, handleDelete, currentSchedule }) => {
  const [selectedDay, setSelectedDay] = useState(currentSchedule?.hari || "Senin");
  const defaultSlot = timeSlots.find(t => t.time.includes(currentSchedule?.jam_mulai?.substring(0,5)))?.label || "Jam 1-2";
  const [selectedSlot, setSelectedSlot] = useState(defaultSlot);
  const [isActive, setIsActive] = useState(true);
  const [formData, setFormData] = useState({ 
    class: currentSchedule?.kelas_id || "", 
    subject: currentSchedule?.mata_pelajaran_id || "", 
    teacher: currentSchedule?.guru_id || "", 
  });

  const [classesList, setClassesList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [activeSemester, setActiveSemester] = useState(null);

  useEffect(() => {
    api.get('/kelas?limit=100').then(res => setClassesList(res.data.data || [])).catch(console.error);
    api.get('/mapel?limit=100').then(res => setSubjectsList(res.data.data || [])).catch(console.error);
    api.get('/guru?limit=100').then(res => setTeachersList(res.data.data || [])).catch(console.error);
    api.get('/semester').then(res => {
      const data = res.data.data || [];
      const active = data.find(s => s.id === currentSchedule?.semester_id) || data.find(s => s.status === 'Aktif') || data[0];
      if (active) setActiveSemester(active);
    }).catch(console.error);
  }, [currentSchedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "class") {
      setFormData({ class: value, subject: "", teacher: "" });
    } else if (name === "subject") {
      setFormData({ ...formData, subject: value, teacher: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onSave = async () => {
    if (!formData.class || !formData.subject || !formData.teacher || !selectedDay || !selectedSlot) {
      alert("Harap lengkapi semua data wajib (*).");
      return;
    }
    const timeObj = timeSlots.find(t => t.label === selectedSlot);
    const [jamMulai, jamSelesai] = timeObj ? timeObj.time.split(" - ") : ["", ""];

    const hariMap = { "Senin": 1, "Selasa": 2, "Rabu": 3, "Kamis": 4, "Jumat": 5, "Sabtu": 6, "Minggu": 7 };

    try {
      await api.put(`/jadwal-pelajaran/` + currentSchedule.id, {
        kelasId: formData.class,
        mapelId: formData.subject,
        guruId: formData.teacher,
        semesterId: activeSemester?.id,
        hari: hariMap[selectedDay],
        jamMulai: jamMulai,
        jamSelesai: jamSelesai
      });
      handleEdit();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal menyimpan jadwal");
    }
  };

  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full font-sans">
      <div className="text-[13px] font-medium text-gray-500 mb-1">
        Dashboard <span className="mx-2">&rsaquo;</span> Jadwal Pelajaran <span className="mx-2">&rsaquo;</span>{" "}
        <span className="text-[#1e293b] font-bold">Edit Jadwal</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => { setView("list"); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50); }}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-sm shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div>
            <h1 className="text-[26px] font-bold text-[#1e293b] leading-tight">Edit Jadwal Pelajaran</h1>
            <p className="text-[14px] text-gray-500 mt-1">Perbarui slot jadwal belajar.</p>
          </div>
        </div>
        <button onClick={() => handleDelete(currentSchedule?.id)} className="bg-white border border-red-200 text-red-500 hover:bg-red-50 px-5 py-2.5 rounded-xl font-bold text-[13px] shadow-sm transition-all flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Hapus Jadwal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-5">Informasi Kelas &amp; Mata Pelajaran</h3>
            <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Kelas<span className="text-red-500">*</span></label>
                <div className="relative">
                  <select name="class" value={formData.class} onChange={handleChange}
                    className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB] bg-white text-gray-700">
                    <option value="">Pilih kelas...</option>
                    {classesList.map(c => <option key={c.id} value={c.id}>{c.nama_kelas}</option>)}
                  </select>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-4 top-4 text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Mata Pelajaran<span className="text-red-500">*</span></label>
                <div className="relative">
                  <select name="subject" value={formData.subject} onChange={handleChange} disabled={!formData.class}
                    className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB] bg-white text-gray-700 disabled:bg-gray-50 disabled:text-gray-400">
                    <option value="">{formData.class ? "Pilih mata pelajaran..." : "Pilih kelas dulu"}</option>
                    {subjectsList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
                  </select>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-4 top-4 text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2">Guru Pengampu<span className="text-red-500">*</span></label>
              <div className="relative">
                <select name="teacher" value={formData.teacher} onChange={handleChange}
                  disabled={!formData.subject}
                  className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB] bg-white text-gray-700 disabled:bg-gray-50 disabled:text-gray-400">
                  <option value="">
                    {!formData.class ? "Pilih kelas dulu" : !formData.subject ? "Pilih mata pelajaran dulu" : "Pilih guru pengampu..."}
                  </option>
                  {teachersList.map(t => <option key={t.id} value={t.id}>{t.nama_lengkap || t.nama || t.name || t.email}</option>)}
                </select>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-4 top-4 text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-5">Waktu &amp; Tempat Belajar</h3>
            <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-6 mb-5">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-3">Hari<span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map(day => (
                    <button type="button" key={day} onClick={() => setSelectedDay(day)}
                      className={`px-4 py-2 text-[13px] font-bold rounded-xl border transition-all ${selectedDay === day ? "bg-[#3B82F6] border-[#3B82F6] text-white shadow-sm" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-3">Slot Jam Pelajaran<span className="text-red-500">*</span></label>
                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50">
                  {timeSlots.map(slot => (
                    <button type="button" key={slot.label} onClick={() => setSelectedSlot(slot.label)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${selectedSlot === slot.label ? "bg-[#3B82F6] text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}>
                      <span className="text-[13px] font-bold">{slot.label}</span>
                      <span className={`text-[11px] ${selectedSlot === slot.label ? "text-blue-100" : "text-gray-400"}`}>{slot.time}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Semester</h3>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2">Tahun Ajaran &amp; Semester</label>
              <input type="text" value={activeSemester?.nama || "Sedang memuat..."} readOnly
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none bg-[#F8FAFC] text-gray-500 font-bold" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Pratinjau Jadwal</h3>
            {formData.class && formData.subject && formData.teacher ? (
              <div className="bg-[#1A3D63]/5 border border-[#1A3D63]/20 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#1A3D63] text-white">{getSubjectCode(subjectsList.find(s => s.id == formData.subject)?.nama || "")}</span>
                  <span className="text-[14px] font-bold text-[#1e293b]">{subjectsList.find(s => s.id == formData.subject)?.nama_lengkap}</span>
                </div>
                <div className="text-[12px] text-gray-500 space-y-1">
                  <p>🏫 <strong>{classesList.find(c => c.id == formData.class)?.nama_kelas}</strong></p>
                  <p>👨‍🏫 {teachersList.find(t => t.id == formData.teacher)?.nama_lengkap || teachersList.find(t => t.id == formData.teacher)?.nama || teachersList.find(t => t.id == formData.teacher)?.name}</p>
                  {selectedDay && <p>📅 {selectedDay} · {selectedSlot}</p>}
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center text-gray-400">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <p className="text-[13px] font-medium leading-relaxed max-w-[200px]">Isi form untuk melihat pratinjau jadwal</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Status Jadwal</h3>
            <div className="flex flex-wrap justify-between items-center">
              <div>
                <div className="text-[14px] font-bold text-[#1e293b]">Aktif</div>
                <div className="text-[11px] text-gray-400">Jadwal aktif dan berlaku</div>
              </div>
              <div onClick={() => setIsActive(!isActive)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isActive ? "bg-[#3B82F6]" : "bg-gray-200"}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isActive ? "translate-x-6" : ""}`}></div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button onClick={onSave}
              className="w-full py-3.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-[14px] font-bold transition-colors flex items-center justify-center gap-2 shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Simpan Perubahan
            </button>
            <button onClick={() => { setView("list"); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50); }}
              className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-[14px] font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
              Batalkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleEdit;
