$file = "c:\capstone SIA\CAPSTONE\src\pages\dashboards\BendaharaDashboard.jsx"
$content = Get-Content $file -Raw -Encoding UTF8

$startMarker = '      case "Status Bayar Gaji":'
$endMarker = '      case "Transfer Gaji":'

$startIdx = $content.IndexOf($startMarker)
$endIdx = $content.IndexOf($endMarker)

if ($startIdx -ge 0 -and $endIdx -gt $startIdx) {
    $before = $content.Substring(0, $startIdx)
    $after = $content.Substring($endIdx)

    $newBlock = @'
      case "Status Bayar Gaji":
        const statusBayarData = [
          { name: "Andi Susanto, S.Pd", role: "Guru Matematika", salary: "Rp 4.250.000", status: "Sudah Dibayar", date: "25 Mei 2026", bank: "BCA" },
          { name: "Maya Putri, M.Pd", role: "Guru Bahasa Indo", salary: "Rp 3.800.000", status: "Sudah Dibayar", date: "25 Mei 2026", bank: "Mandiri" },
          { name: "Hendro Wibowo", role: "Staff TU", salary: "Rp 2.500.000", status: "Proses Transfer", date: "—", bank: "BCA" },
          { name: "Lina Sari, S.Kom", role: "Guru TIK", salary: "Rp 3.200.000", status: "Belum Diproses", date: "—", bank: "BRI" },
          { name: "Dr. Hendra Wijaya", role: "Kepala Sekolah", salary: "Rp 7.500.000", status: "Sudah Dibayar", date: "24 Mei 2026", bank: "BCA" }
        ];

        return (
          <div className="flex flex-col gap-6 animate-fadeIn font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-[26px] font-bold text-gray-800 tracking-tight">Status Pembayaran Gaji</h1>
                <p className="text-sm text-gray-500 mt-1">Monitoring status real-time pembayaran gaji guru dan karyawan.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative">
                  <select className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl pl-10 pr-8 py-2.5 text-xs sm:text-[13px] font-bold text-gray-600 cursor-pointer appearance-none focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20 shadow-sm transition-all">
                    <option>Tahun Ajaran: 2023/2024</option>
                  </select>
                  <span className="absolute left-3.5 top-2.5 text-gray-400 pointer-events-none">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  </span>
                  <span className="absolute right-3.5 top-3 text-gray-400 pointer-events-none">
                    <IconChevronDown />
                  </span>
                </div>
                <button
                  onClick={() => triggerToast("Review semua pembayaran...")}
                  className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 rounded-xl px-4 py-2.5 text-xs sm:text-[13px] font-bold cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <IconPlus /> Review Semua
                </button>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "TOTAL PEGAWAI", value: "87", accent: "border-t-[#1A3D63]", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>, iconColor: "text-gray-400" },
                { label: "SUDAH TERBAYAR", value: "62", accent: "border-t-[#10B981]", icon: <IconCheckCircle />, iconColor: "text-[#10B981]" },
                { label: "PROSES TRANSFER", value: "15", accent: "border-t-[#3B82F6]", icon: <IconClock />, iconColor: "text-[#3B82F6]" },
                { label: "BELUM DIPROSES", value: "10", accent: "border-t-[#EF4444]", icon: <IconAlertCircle />, iconColor: "text-[#EF4444]" }
              ].map((card, idx) => (
                <div key={idx} className={`bg-white rounded-[20px] border border-gray-100 p-5 shadow-sm border-t-[3px] ${card.accent} flex flex-col justify-between h-[104px]`}>
                  <div className="flex justify-between items-start">
                    <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{card.label}</div>
                    <div className={`${card.iconColor}`}>{card.icon}</div>
                  </div>
                  <div className="text-3xl font-black text-gray-800 leading-none">{card.value}</div>
                </div>
              ))}
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="relative w-full sm:w-[320px]">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <IconSearch />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Cari nama pegawai..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-xs sm:text-[13px] focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20 transition-all font-medium"
                  />
                </div>
                <button
                  onClick={() => triggerToast("Mencetak daftar pembayaran...")}
                  className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <IconPrinter /> Cetak Daftar
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="py-4 px-4 font-semibold bg-gray-50/50 rounded-tl-xl">NAMA PEGAWAI</th>
                      <th className="py-4 px-4 font-semibold bg-gray-50/50">JABATAN</th>
                      <th className="py-4 px-4 font-semibold bg-gray-50/50">TOTAL GAJI</th>
                      <th className="py-4 px-4 font-semibold bg-gray-50/50">STATUS</th>
                      <th className="py-4 px-4 font-semibold bg-gray-50/50">TGL BAYAR</th>
                      <th className="py-4 px-4 font-semibold bg-gray-50/50">BANK</th>
                      <th className="py-4 px-4 font-semibold bg-gray-50/50 rounded-tr-xl text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {statusBayarData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-gray-800">{row.name}</td>
                        <td className="py-4 px-4 text-gray-500 font-medium">{row.role}</td>
                        <td className="py-4 px-4 font-bold text-gray-800">{row.salary}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                            row.status === 'Sudah Dibayar' ? 'bg-[#E6F4EA] text-[#059669]' : 
                            row.status === 'Proses Transfer' ? 'bg-blue-50 text-blue-600' :
                            'bg-[#FEE2E2] text-[#EF4444]'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-500 font-medium">{row.date}</td>
                        <td className="py-4 px-4 text-gray-500 font-medium">{row.bank}</td>
                        <td className="py-4 px-4 text-right">
                          <button className="inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-700 font-bold bg-transparent border-none cursor-pointer text-[11px] sm:text-xs transition-colors">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

'@

    $newContent = $before + $newBlock + $after
    [System.IO.File]::WriteAllText($file, $newContent, [System.Text.Encoding]::UTF8)
    Write-Host "Replaced successfully"
} else {
    Write-Host "Markers not found"
}
