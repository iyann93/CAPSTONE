const SiswaSchedule = () => {
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const timeSlots = [
    { range: "1-2", time: "07:00 - 08:30" },
    { range: "3-4", time: "08:45 - 10:15" },
    { range: "Istirahat", time: "10:15 - 10:30", isBreak: true },
    { range: "5-6", time: "10:30 - 12:00" },
    { range: "Istirahat 2", time: "12:00 - 12:45", isBreak: true },
    { range: "7-8", time: "12:45 - 14:15" }
  ];
  const scheduleData = {
    "Senin": {
      "1-2": { subject: "Matematika", teacher: "Eko Prasetyo", room: "R-104", color: "bg-amber-100 text-amber-700 border-amber-200" },
      "3-4": { subject: "Fisika", teacher: "Agus Wibowo", room: "R-104", color: "bg-primary-500 text-white border-primary-900" },
      "5-6": { subject: "Biologi", teacher: "Hendra S.", room: "R-104", color: "bg-primary-50 text-primary-500 border-primary-100" }
    },
    "Selasa": {
      "1-2": { subject: "Bhs. Indonesia", teacher: "Siti Rahayu", room: "R-104", color: "bg-primary-50 text-primary-500 border-primary-100" },
      "3-4": { subject: "Bhs. Inggris", teacher: "Dewi Anggraini", room: "R-104", color: "bg-pink-100 text-pink-700 border-pink-200" },
      "7-8": { subject: "Kimia", teacher: "Rini Susanti", room: "Lab Kim", color: "bg-primary-500 text-white border-primary-900" }
    },
    "Rabu": {
      "1-2": { subject: "Matematika", teacher: "Eko Prasetyo", room: "R-104", color: "bg-amber-100 text-amber-700 border-amber-200" },
      "5-6": { subject: "PKn", teacher: "Wati Kusuma", room: "R-104", color: "bg-pink-100 text-pink-700 border-pink-200" }
    },
    "Kamis": {
      "1-2": { subject: "Sejarah", teacher: "Fajar Nugroho", room: "R-104", color: "bg-pink-100 text-pink-700 border-pink-200" },
      "3-4": { subject: "Fisika", teacher: "Agus Wibowo", room: "Lab Fis", color: "bg-primary-500 text-white border-primary-900" },
      "7-8": { subject: "Kimia", teacher: "Rini Susanti", room: "R-104", color: "bg-primary-500 text-white border-primary-900" }
    },
    "Jumat": {
      "1-2": { subject: "Penjaskes", teacher: "Rudi Hartono", room: "Lapangan", color: "bg-primary-500 text-white border-primary-900" },
      "5-6": { subject: "Seni Budaya", teacher: "Anita Sari", room: "R-104", color: "bg-amber-100 text-amber-700 border-amber-200" }
    }
  };
  return <div className="p-4 md:p-8 animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Jadwal Mapel</h2>
        <p className="text-sm text-gray-400 mt-1">Senin, 02 Oktober 2025</p>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 min-w-[150px]">Jam / Waktu</th>
                {days.map((day) => <th key={day} className="p-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 min-w-[180px]">
                    <div className="flex flex-col items-center gap-1">
                      {day}
                      {day === "Rabu" && <span className="bg-primary-500 text-white text-[9px] px-2 py-0.5 rounded-full">Hari Ini</span>}
                    </div>
                  </th>)}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, i) => <tr key={i} className={slot.isBreak ? "bg-primary-50/30" : ""}>
                  <td className="p-6 border-b border-gray-50">
                    <div className="font-bold text-gray-800 text-sm">{slot.range}</div>
                    <div className="text-[11px] text-gray-400 font-medium mt-1">{slot.time}</div>
                  </td>
                  
                  {slot.isBreak ? <td colSpan={5} className="p-6 text-center border-b border-gray-50">
                      <span className="text-xs font-black text-primary-500/30 tracking-[0.5em] uppercase">ISTIRAHAT</span>
                    </td> : days.map((day) => {
    const item = scheduleData[day]?.[slot.range];
    return <td key={day} className="p-3 border-b border-gray-50 border-r border-gray-50/50 last:border-r-0">
                          {item ? <div className={`p-4 rounded-2xl border ${item.color} shadow-sm transition-transform hover:scale-[1.03] cursor-pointer`}>
                              <div className="font-bold text-[13px] mb-1">{item.subject}</div>
                              <div className="text-[10px] opacity-80 font-medium mb-2">{item.teacher}</div>
                              <div className="text-[9px] font-black uppercase tracking-wider opacity-60">{item.room}</div>
                            </div> : <div className="h-20" />}
                        </td>;
  })}
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
var SiswaSchedule_default = SiswaSchedule;
export {
  SiswaSchedule_default as default
};
