import React, { useState, useMemo, useEffect } from "react";

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

const ScheduleAdd = ({ setView, handleAdd }) => {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [formData, setFormData] = useState({ class: "", subject: "", teacher: "", room: "" });

  // 1. Ambil daftar mata pelajaran secara dinamis dari localStorage (terkoneksi dengan menu Mata Pelajaran)
  const subjectsList = useMemo(() => {
    const saved = localStorage.getItem("subjects_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse subjects_data from localStorage", e);
      }
    }
    // Default fallback jika data di localStorage kosong
    return [
      { code: "MTK", name: "Matematika", group: "Wajib", levels: "VII, VIII, IX", teacher: "Drs. Hendra, M.Pd.", status: "Aktif" },
      { code: "BIN", name: "Bahasa Indonesia", group: "Wajib", levels: "VII, VIII, IX", teacher: "Ibu Nuraini, S.Pd.", status: "Aktif" },
      { code: "BIG", name: "Bahasa Inggris", group: "Wajib", levels: "VII, VIII, IX", teacher: "Mr. Andrian, M.A.", status: "Aktif" },
      { code: "FIS", name: "Fisika", group: "IPA", levels: "VII, VIII, IX", teacher: "Ibu Sari, S.Pd.", status: "Aktif" },
      { code: "KIM", name: "Kimia", group: "IPA", levels: "VII, VIII, IX", teacher: "Bpk. Rudi, M.Si.", status: "Aktif" },
      { code: "BIO", name: "Biologi", group: "IPA", levels: "VII, VIII, IX", teacher: "Ibu Dewi, S.Pd.", status: "Aktif" },
      { code: "EKO", name: "Ekonomi", group: "IPS", levels: "VII, VIII, IX", teacher: "Ibu Kartika, S.E.", status: "Aktif" },
      { code: "SEJ", name: "Sejarah", group: "IPS", levels: "VII, VIII, IX", teacher: "Bpk. Suherman, M.Pd.", status: "Aktif" },
      { code: "SOS", name: "Sosiologi", group: "IPS", levels: "VIII, IX", teacher: "Ibu Ratna, S.Pd.", status: "Aktif" },
      { code: "GEO", name: "Geografi", group: "IPS", levels: "VII, VIII, IX", teacher: "Bpk. Wahyu, M.Pd.", status: "Aktif" },
      { code: "PKN", name: "PKn", group: "Wajib", levels: "VII, VIII, IX", teacher: "Ibu Marlina, S.Pd.", status: "Aktif" },
      { code: "PJK", name: "Penjaskes", group: "Wajib", levels: "VII, VIII, IX", teacher: "Bpk. Eko, S.Pd.", status: "Nonaktif" }
    ];
  }, []);

  // 2. Filter mapel berdasarkan kelas yang dipilih (tingkat jenjang & jurusan)
  const availableSubjects = useMemo(() => {
    if (!formData.class) return [];
    
    // Cari tingkat kelas (misal: "VII", "VIII", "IX")
    const gradeMatch = formData.class.match(/^(VII|VIII|IX)\b/);
    const grade = gradeMatch ? gradeMatch[1] : "";
    
    const isIpa = formData.class.includes("IPA");
    const isIps = formData.class.includes("IPS");

    return subjectsList.filter(subj => {
      // Hanya tampilkan mapel yang berstatus Aktif
      if (subj.status !== "Aktif") return false;

      // Filter berdasarkan Jenjang/Level (misal: subj.levels = "VII, VIII, IX")
      const subjLevels = subj.levels ? subj.levels.toString().toUpperCase() : "";
      const matchesGrade = subjLevels.includes(grade.toUpperCase());
      if (!matchesGrade) return false;

      // Filter berdasarkan Kelompok/Jurusan
      const group = subj.group ? subj.group.toUpperCase() : "";
      if (group === "IPA" && !isIpa) return false;
      if (group === "IPS" && !isIps) return false;

      return true;
    });
  }, [formData.class, subjectsList]);

  // 3. Ambil daftar guru pengampu dari mapel terpilih
  const availableTeachers = useMemo(() => {
    if (!formData.class || !formData.subject) return [];
    
    const subj = availableSubjects.find(s => s.name === formData.subject);
    if (!subj) return [];

    if (Array.isArray(subj.teacher)) {
      return subj.teacher;
    }
    if (typeof subj.teacher === "string") {
      // Jika menggunakan pemisah titik koma ';', langsung split
      if (subj.teacher.includes(";")) {
        return subj.teacher.split(";").map(t => t.trim()).filter(Boolean);
      }

      // Fallback pintar untuk data lama yang menggunakan koma agar gelar (seperti S.Pd., M.Pd.) tidak terpisah
      const parts = subj.teacher.split(",").map(t => t.trim()).filter(Boolean);
      const cleaned = [];
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const lowerPart = part.toLowerCase();
        // Jika bagian ini merupakan gelar akademik, gabungkan dengan nama guru sebelumnya
        if ((lowerPart === "s.pd" || lowerPart === "s.pd." || 
             lowerPart === "m.pd" || lowerPart === "m.pd." || 
             lowerPart === "m.a" || lowerPart === "m.a." || 
             lowerPart === "m.si" || lowerPart === "m.si." || 
             lowerPart === "s.e" || lowerPart === "s.e." || 
             lowerPart === "s.sn" || lowerPart === "s.sn.") && cleaned.length > 0) {
          cleaned[cleaned.length - 1] += ", " + part;
        } else {
          cleaned.push(part);
        }
      }
      return cleaned;
    }
    return [subj.teacher].filter(Boolean);
  }, [formData.class, formData.subject, availableSubjects]);

  // 4. Ambil semester aktif dari localStorage secara dinamis (re-read on mount)
  const [activeSemesterName, setActiveSemesterName] = useState("Ganjil 2023/2024");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("semesters_data");
      if (saved) {
        const list = JSON.parse(saved);
        const active = list.find(s => s.status === "Aktif");
        if (active) { setActiveSemesterName(active.name); return; }
      }
    } catch (e) {
      console.error("Failed to parse semesters_data from localStorage", e);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "class") {
      setFormData({ class: value, subject: "", teacher: "", room: formData.room });
    } else if (name === "subject") {
      setFormData({ ...formData, subject: value, teacher: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onSave = () => {
    if (!formData.class || !formData.subject || !formData.teacher || !selectedDay || !selectedSlot || !formData.room) {
      alert("Harap lengkapi semua data wajib (*).");
      return;
    }
    const timeObj = timeSlots.find(t => t.label === selectedSlot);
    const subj = subjectsList.find(s => s.name === formData.subject);
    const code = subj?.code || getSubjectCode(formData.subject);

    handleAdd({
      class: formData.class,
      day: selectedDay,
      time: timeObj ? timeObj.time.replace(" - ", "-") : "",
      period: selectedSlot.replace("Jam ", "Jam ke-"),
      code,
      subject: formData.subject,
      teacher: formData.teacher,
      room: formData.room,
      status: isActive ? "Aktif" : "Nonaktif",
      color: "bg-gray-50 border-gray-200 text-gray-700",
      semester: activeSemesterName // Simpan semester yang aktif
    });
  };

  const allClasses = [
    "VII IPA 1",
    "VII IPA 2",
    "VII IPS 1",
    "VIII IPA 1",
    "VIII IPS 1",
    "IX IPA 1",
    "IX IPS 1"
  ];

  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full font-sans">
      {/* Breadcrumb */}
      <div className="text-[13px] font-medium text-gray-500 mb-1">
        Dashboard <span className="mx-2">&rsaquo;</span> Jadwal Pelajaran <span className="mx-2">&rsaquo;</span>{" "}
        <span className="text-[#1e293b] font-bold">Tambah Jadwal</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setView("list")}
          className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-sm shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b] leading-tight">Tambah Jadwal Pelajaran</h1>
          <p className="text-[14px] text-gray-500 mt-1">Tambahkan slot jadwal belajar baru untuk kelas yang dipilih.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Main Form */}
        <div className="lg:col-span-2 space-y-6">

          {/* Informasi Kelas & Mata Pelajaran */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-5">Informasi Kelas &amp; Mata Pelajaran</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              {/* Kelas */}
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Kelas<span className="text-red-500">*</span></label>
                <div className="relative">
                  <select name="class" value={formData.class} onChange={handleChange}
                    className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB] bg-white text-gray-700">
                    <option value="">Pilih kelas...</option>
                    {allClasses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-4 top-4 text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>

              {/* Mata Pelajaran — filtered by kelas */}
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Mata Pelajaran<span className="text-red-500">*</span></label>
                <div className="relative">
                  <select name="subject" value={formData.subject} onChange={handleChange} disabled={!formData.class}
                    className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB] bg-white text-gray-700 disabled:bg-gray-50 disabled:text-gray-400">
                    <option value="">{formData.class ? "Pilih mata pelajaran..." : "Pilih kelas dulu"}</option>
                    {availableSubjects.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-4 top-4 text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>

            {/* Guru Pengampu — filtered by kelas + mapel */}
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2">Guru Pengampu<span className="text-red-500">*</span></label>
              <div className="relative">
                <select name="teacher" value={formData.teacher} onChange={handleChange}
                  disabled={!formData.subject}
                  className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB] bg-white text-gray-700 disabled:bg-gray-50 disabled:text-gray-400">
                  <option value="">
                    {!formData.class ? "Pilih kelas dulu" : !formData.subject ? "Pilih mata pelajaran dulu" : "Pilih guru pengampu..."}
                  </option>
                  {availableTeachers.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-4 top-4 text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              {/* Helper text */}
              {formData.class && formData.subject && availableTeachers.length === 0 && (
                <p className="text-[12px] text-amber-600 mt-1.5 flex items-center gap-1">
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126Z"/></svg>
                  Belum ada guru terdaftar untuk mapel ini di kelas tersebut.
                </p>
              )}
              {formData.class && formData.subject && availableTeachers.length > 0 && (
                <p className="text-[12px] text-emerald-600 mt-1.5 flex items-center gap-1">
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
                  {availableTeachers.length} guru tersedia untuk mapel ini.
                </p>
              )}
            </div>
          </div>

          {/* Waktu & Tempat */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-5">Waktu &amp; Tempat Belajar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
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
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2">Ruangan<span className="text-red-500">*</span></label>
              <input type="text" name="room" value={formData.room} onChange={handleChange}
                placeholder="cth. Ruang 101, Lab Fisika, Lapangan..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2563EB]" />
            </div>
          </div>

          {/* Semester */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Semester</h3>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2">Tahun Ajaran &amp; Semester</label>
              <input type="text" value={activeSemesterName} readOnly
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none bg-[#F8FAFC] text-gray-500 font-bold" />
            </div>
          </div>
        </div>

        {/* Right — Preview & Actions */}
        <div className="space-y-6">

          {/* Preview */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Pratinjau Jadwal</h3>
            {formData.class && formData.subject && formData.teacher ? (
              <div className="bg-[#1A3D63]/5 border border-[#1A3D63]/20 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#1A3D63] text-white">{getSubjectCode(formData.subject)}</span>
                  <span className="text-[14px] font-bold text-[#1e293b]">{formData.subject}</span>
                </div>
                <div className="text-[12px] text-gray-500 space-y-1">
                  <p>ðŸ« <strong>{formData.class}</strong></p>
                  <p>ðŸ‘¨â€ðŸ« {formData.teacher}</p>
                  {selectedDay && <p>📅 {selectedDay} · {selectedSlot}</p>}
                  {formData.room && <p>ðŸ“ {formData.room}</p>}
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

          {/* Status */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-4">Status Jadwal</h3>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[14px] font-bold text-[#1e293b]">Aktif</div>
                <div className="text-[11px] text-gray-400">Jadwal aktif dan berlaku</div>
              </div>
              <div onClick={() => setIsActive(!isActive)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isActive ? "bg-[#3B82F6]" : "bg-gray-200"}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isActive ? "translate-VII-6" : ""}`}></div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-[#FEFBF0] border border-[#FDE8A4] rounded-2xl p-4 flex gap-3 text-[#A16207]">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <p className="text-[12px] font-semibold leading-relaxed">Pastikan slot jam belum digunakan oleh guru yang sama di kelas lain pada hari dan jam yang sama.</p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button onClick={onSave}
              className="w-full py-3.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-[14px] font-bold transition-colors flex items-center justify-center gap-2 shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Simpan Jadwal
            </button>
            <button onClick={() => setView("list")}
              className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-[14px] font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
              Batalkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAdd;



