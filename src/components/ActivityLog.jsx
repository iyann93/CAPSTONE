const logs = [
  {
    time: "10:45 AM",
    userName: "Dra. Sri Wahyuni",
    userRole: "Guru",
    module: "Akademik",
    activity: "Input nilai UTS untuk Kelas X IPA 1"
  },
  {
    time: "10:12 AM",
    userName: "Andi Setiawan",
    userRole: "Siswa",
    module: "Keuangan",
    activity: "Pembayaran SPP Bulan Oktober (Lunas)"
  },
  {
    time: "09:30 AM",
    userName: "Budi Santoso",
    userRole: "Admin",
    module: "Master Data",
    activity: "Menambahkan Tahun Ajaran Baru 2024/2025"
  },
  {
    time: "08:15 AM",
    userName: "Siti Aminah",
    userRole: "Bendahara",
    module: "Keuangan",
    activity: "Generate draft slip gaji periode Oktober"
  }
];
const moduleBadge = {
  Akademik: "bg-green-100 text-green-700",
  Keuangan: "bg-blue-100 text-blue-700",
  "Master Data": "bg-gray-100 text-gray-600"
};
const ActivityLog = () => {
  return <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h2 className="font-semibold text-gray-700 text-sm mb-4">
        Aktivitas Sistem Terbaru (Cross-Module)
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left pb-3 pr-6 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Waktu
              </th>
              <th className="text-left pb-3 pr-6 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="text-left pb-3 pr-6 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Modul
              </th>
              <th className="text-left pb-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Aktivitas
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => <tr
    key={i}
    className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
  >
                <td className="py-3.5 pr-6 text-gray-500 font-medium whitespace-nowrap">
                  {log.time}
                </td>
                <td className="py-3.5 pr-6 whitespace-nowrap">
                  <div className="font-semibold text-gray-700">{log.userName}</div>
                  <div className="text-gray-400 text-[11px]">{log.userRole}</div>
                </td>
                <td className="py-3.5 pr-6">
                  <span
    className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${moduleBadge[log.module]}`}
  >
                    {log.module}
                  </span>
                </td>
                <td className="py-3.5 text-gray-600">{log.activity}</td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
};
var ActivityLog_default = ActivityLog;
export {
  ActivityLog_default as default
};
