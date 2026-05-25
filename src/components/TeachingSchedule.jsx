const schedules = [
  {
    timeStart: "07:15",
    timeEnd: "08:45",
    subject: "Matematika",
    className: "X IPA 1",
    teacher: "Dra. Sri Wahyuni",
    accentColor: "#1B3B5F",
    accentBg: "#e0effe"
  },
  {
    timeStart: "08:45",
    timeEnd: "10:15",
    subject: "Sejarah",
    className: "XI IPS 2",
    teacher: "Budi Santoso, S.Pd",
    accentColor: "#ec4899",
    accentBg: "#fdf2f8"
  },
  {
    timeStart: "10:30",
    timeEnd: "12:00",
    subject: "Fisika",
    className: "XII IPA 3",
    teacher: "Ahmad Ridwan, M.Si",
    accentColor: "#0ea5e9",
    accentBg: "#e0f2fe"
  }
];
const TeachingSchedule = () => {
  return <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex-1">
      <h2 className="font-semibold text-gray-700 text-sm mb-4">
        Jadwal Mengajar Hari Ini (Guru)
      </h2>
      <div className="flex flex-col gap-3">
        {schedules.map((s, i) => <div
    key={i}
    className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50/50"
    style={{ borderLeft: `4px solid ${s.accentColor}` }}
  >
            <span
    className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap flex-shrink-0"
    style={{ color: s.accentColor, background: s.accentBg }}
  >
              {s.timeStart} – {s.timeEnd}
            </span>
            <div>
              <div className="text-sm font-bold text-gray-700">
                {s.subject}{" "}
                <span className="font-normal text-gray-400 text-xs">({s.className})</span>
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">{s.teacher}</div>
            </div>
          </div>)}
      </div>
    </div>;
};
var TeachingSchedule_default = TeachingSchedule;
export {
  TeachingSchedule_default as default
};
