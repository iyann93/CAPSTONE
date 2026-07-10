import React, { useState } from "react";
import api from '../../api/axios';

const criteriaData = [
  {
    id: 1,
    category: "Nilai Akademik",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
    items: [
      { label: "Nilai Minimum Per Mata Pelajaran", value: "75", unit: "(KKM)", editable: true },
      { label: "Nilai Rata-rata Minimal", value: "70", unit: "", editable: true },
      { label: "Mata Pelajaran Tidak Boleh Remedial", value: "3", unit: "mapel", editable: true },
    ],
  },
  {
    id: 2,
    category: "Kehadiran",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-100",
    items: [
      { label: "Persentase Kehadiran Minimal", value: "85", unit: "%", editable: true },
      { label: "Maksimal Alpa (Tanpa Keterangan)", value: "10", unit: "hari", editable: true },
      { label: "Maksimal Total Ketidakhadiran", value: "20", unit: "hari", editable: true },
    ],
  },
  {
    id: 3,
    category: "Perilaku & Sikap",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-100",
    items: [
      { label: "Nilai Sikap Minimal", value: "B", unit: "(Baik)", editable: false },
      { label: "Tidak Terlibat Kasus Berat", value: "Wajib", unit: "", editable: false },
    ],
  },
];

const GradePromotionCriteria = ({ setView }) => {
  const [editMode, setEditMode] = useState(false);
  const [values, setValues] = useState({
    "Nilai Minimum Per Mata Pelajaran": "75",
    "Nilai Rata-rata Minimal": "70",
    "Mata Pelajaran Tidak Boleh Remedial": "3",
    "Persentase Kehadiran Minimal": "85",
    "Maksimal Alpa (Tanpa Keterangan)": "10",
    "Maksimal Total Ketidakhadiran": "20",
  });

  React.useEffect(() => {
    const fetchState = async () => {
      try {
        
        const res = await api.get('/system/frontend-state');
        if (res.data?.data?.grade_promotion_criteria) {
          setValues(res.data.data.grade_promotion_criteria);
          localStorage.setItem("grade_promotion_criteria", JSON.stringify(res.data.data.grade_promotion_criteria));
        } else {
          const saved = localStorage.getItem("grade_promotion_criteria");
          if (saved) setValues(JSON.parse(saved));
        }
      } catch (err) {
        const saved = localStorage.getItem("grade_promotion_criteria");
        if (saved) setValues(JSON.parse(saved));
      }
    };
    fetchState();
  }, []);

  const handleChange = (label, val) => {
    setValues(prev => ({ ...prev, [label]: val }));
  };

  const handleSave = async () => {
    localStorage.setItem("grade_promotion_criteria", JSON.stringify(values));
    setEditMode(false);
    
    try {
      
      const res = await api.get('/system/frontend-state');
      const currentState = res.data?.data || {};
      await api.put('/system/frontend-state', {
        ...currentState,
        grade_promotion_criteria: values
      });
    } catch (err) {
      console.error("Gagal menyimpan kriteria ke database", err);
    }
  };

  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb */}
      <div className="text-[13px] font-medium text-gray-400">
        Dashboard &gt; <span className="text-gray-500">Kelola Akademik</span> &gt;{" "}
        <button onClick={() => { setView("list"); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50); }} className="text-gray-500 hover:text-[#2A4365] transition-colors">Kenaikan Kelas</button>{" "}
        &gt; <span className="text-[#2A4365] font-semibold">Kriteria Kenaikan</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setView("list"); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50); }}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div>
            <h1 className="text-[24px] font-bold text-[#1e293b]">Kriteria Kenaikan Kelas</h1>
            <p className="text-gray-500 text-[14px] mt-0.5">Atur kriteria dan syarat kenaikan kelas semester ini.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {editMode ? (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Batalkan
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#2A4365] hover:bg-[#1A365D] text-white rounded-xl text-[13px] font-bold transition-colors shadow-sm"
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Simpan Perubahan
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#2A4365] hover:bg-[#1A365D] text-white rounded-xl text-[13px] font-bold transition-colors shadow-sm"
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Kriteria
            </button>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div>
          <p className="text-[13px] font-bold text-blue-700">Informasi Kriteria</p>
          <p className="text-[13px] text-blue-600 mt-0.5">Kriteria ini berlaku untuk semester <strong>Ganjil 2023/2024</strong>. Perubahan kriteria akan memengaruhi proses kenaikan kelas yang belum diproses.</p>
        </div>
      </div>

      {/* Criteria Cards */}
      <div className="space-y-4">
        {criteriaData.map((group) => (
          <div key={group.id} className={`bg-white rounded-2xl border ${group.borderColor} shadow-sm overflow-hidden`}>
            {/* Card Header */}
            <div className={`${group.bgColor} px-6 py-4 flex items-center gap-3 border-b ${group.borderColor}`}>
              <div className={`w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm border ${group.borderColor}`}>
                {group.icon}
              </div>
              <h2 className={`text-[15px] font-bold ${group.color}`}>{group.category}</h2>
            </div>

            {/* Criteria Rows */}
            <div className="divide-y divide-gray-50">
              {group.items.map((item, i) => (
                <div key={i} className="flex flex-wrap items-center justify-between px-6 py-4 gap-4">
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-gray-700">{item.label}</p>
                    {item.unit && !item.editable && (
                      <p className="text-[12px] text-gray-400 mt-0.5">{item.unit}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.editable && editMode ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={values[item.label] !== undefined ? values[item.label] : item.value}
                          onChange={e => handleChange(item.label, e.target.value)}
                          className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-[14px] font-bold text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                        />
                        {item.unit && (
                          <span className="text-[13px] text-gray-500">{item.unit}</span>
                        )}
                      </div>
                    ) : (
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-bold ${group.bgColor} ${group.color}`}>
                        {values[item.label] !== undefined ? values[item.label] : item.value}
                        {item.unit && <span className="text-[12px] font-normal opacity-70">{item.unit}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-[15px] font-bold text-gray-700 mb-4">Riwayat Perubahan Kriteria</h3>
        <div className="space-y-4">
          {[
            { name: "Siti Rahayu", avatar: "SR", action: "Mengubah nilai minimum KKM dari 70 menjadi 75", time: "12 Jul 2023 · 09:30", color: "bg-[#2A4365]" },
            { name: "Admin Sistem", avatar: "AS", action: "Kriteria kenaikan pertama kali dibuat untuk TA 2023/2024", time: "1 Jul 2023 · 08:00", color: "bg-gray-400" },
          ].map((log, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full ${log.color} text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0`}>{log.avatar}</div>
              <div>
                <p className="text-[13px] font-semibold text-gray-700">{log.name}</p>
                <p className="text-[13px] text-gray-500">{log.action}</p>
                <p className="text-[11px] text-gray-400 mt-1">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradePromotionCriteria;

