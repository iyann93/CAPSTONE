$file = "c:\capstone SIA\CAPSTONE\src\pages\dashboards\BendaharaDashboard.jsx"
$content = Get-Content $file -Raw -Encoding UTF8

$startMarker = '      case "Generate Slip Gaji":'
$endMarker = '      case "Status Bayar Gaji":'

$startIdx = $content.IndexOf($startMarker)
$endIdx = $content.IndexOf($endMarker)

$before = $content.Substring(0, $startIdx)
$after = $content.Substring($endIdx)

$newBlock = @'
      case "Generate Slip Gaji":
        return (
          <div className="flex flex-col gap-6 animate-fadeIn font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-[26px] font-bold text-gray-800 tracking-tight">Generate Slip Gaji</h1>
                <p className="text-sm text-gray-500 mt-1">Generate dan kelola slip gaji bulanan guru &amp; karyawan.</p>
              </div>
              <button
                onClick={() => triggerToast("Generate masal seluruh slip gaji Guru & Karyawan...")}
                className="flex items-center gap-1.5 bg-[#1A3D63] hover:bg-[#122A44] text-white border-none rounded-xl px-4 sm:px-5 py-2.5 text-xs sm:text-[13px] font-bold cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                <IconPlus /> Generate Semua Slip
              </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Pegawai", value: "6", accent: "border-l-4 border-l-[#6366F1]", iconBg: "bg-indigo-50 text-indigo-500" },
                { label: "Slip Sudah Generate", value: "4", accent: "border-l-4 border-l-[#10B981]", iconBg: "bg-green-50 text-green-500" },
                { label: "Belum Generate", value: "2", accent: "border-l-4 border-l-[#EF4444]", iconBg: "bg-red-50 text-red-500" },
                { label: "Total Payroll", value: "Rp 20.335.000", accent: "border-l-4 border-l-[#3B82F6]", iconBg: "bg-blue-50 text-blue-500" }
              ].map((card, idx) => (
                <div key={idx} className={`bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm ${card.accent} flex items-center gap-3`}>
                  <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0 text-lg font-bold`}>
                    {idx === 0 && <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
                    {idx === 1 && <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
                    {idx === 2 && <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>}
                    {idx === 3 && <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>}
                  </div>
                  <div>
                    <div className="text-[20px] sm:text-2xl font-black text-gray-800 leading-none">{card.value}</div>
                    <div className="text-[11px] text-gray-400 font-medium mt-0.5">{card.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">Periode Gaji:</span>
                  <div className="relative">
                    <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none appearance-none pr-7 font-semibold">
                      <option>Mei 2026</option>
                      <option>April 2026</option>
                      <option>Maret 2026</option>
                    </select>
                    <span className="absolute right-2 top-2 text-gray-400 pointer-events-none"><IconChevronDown /></span>
                  </div>
                </div>
                <span className="bg-[#E6F4EA] text-[#059669] font-bold px-3 py-1 rounded-full text-[11px]">3 sudah transfer</span>
                <span className="bg-[#FEF3C7] text-[#D97706] font-bold px-3 py-1 rounded-full text-[11px]">1 pending</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/60 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="p-4 pl-5">NIP</th>
                      <th className="p-4">NAMA PEGAWAI</th>
                      <th className="p-4">JABATAN</th>
                      <th className="p-4">GAJI BERSIH</th>
                      <th className="p-4">STATUS SLIP</th>
                      <th className="p-4">STATUS BAYAR</th>
                      <th className="p-4 pr-5 text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {[
                      { nip: "1980001", name: "Andi Susanto, S.Pd", role: "Guru Matematika", salary: "Rp 4.105.500", slipStatus: "Sudah Generate", payStatus: "Sudah Transfer" },
                      { nip: "1985002", name: "Maya Putri, M.Pd", role: "Guru B. Indonesia", salary: "Rp 3.720.000", slipStatus: "Sudah Generate", payStatus: "Sudah Transfer" },
                      { nip: "1990003", name: "Hendro Wibowo", role: "Staff TU", salary: "Rp 2.408.500", slipStatus: "Sudah Generate", payStatus: "Pending" },
                      { nip: "1982004", name: "Lina Sari, S.Kom", role: "Guru TIK", salary: "Rp 3.085.000", slipStatus: "Belum Generate", payStatus: "none" },
                      { nip: "1978005", name: "Rini Astuti, S.Si", role: "Guru Kimia", salary: "Rp 4.320.000", slipStatus: "Sudah Generate", payStatus: "Sudah Transfer" },
                      { nip: "1995006", name: "Doni Prasetya", role: "Guru Olahraga", salary: "Rp 2.696.000", slipStatus: "Belum Generate", payStatus: "none" }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 pl-5 font-mono text-gray-400 text-[11px]">{row.nip}</td>
                        <td className="p-4 font-bold text-gray-800">{row.name}</td>
                        <td className="p-4 text-gray-500">{row.role}</td>
                        <td className="p-4 font-bold text-[#1A3D63]">{row.salary}</td>
                        <td className="p-4">
                          <span className={`font-bold px-2.5 py-1 rounded-md text-[10px] inline-block ${row.slipStatus === "Sudah Generate" ? "bg-[#E6F4EA] text-[#059669]" : "bg-[#FEE2E2] text-[#EF4444]"}`}>
                            {row.slipStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          {row.payStatus === "none" ? (
                            <span className="text-gray-300 font-bold text-base">—</span>
                          ) : (
                            <span className={`font-bold px-2.5 py-1 rounded-md text-[10px] inline-block ${row.payStatus === "Sudah Transfer" ? "bg-[#E6F4EA] text-[#059669]" : "bg-[#FEF3C7] text-[#D97706]"}`}>
                              {row.payStatus}
                            </span>
                          )}
                        </td>
                        <td className="p-4 pr-5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => triggerToast(`Preview slip gaji ${row.name}`)} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-lg border-none bg-transparent cursor-pointer transition-colors" title="Preview">
                              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                            </button>
                            <button onClick={() => triggerToast(`Mengunduh slip gaji ${row.name}...`)} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-lg border-none bg-transparent cursor-pointer transition-colors" title="Download">
                              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                            </button>
                            {row.slipStatus === "Belum Generate" && (
                              <button onClick={() => triggerToast(`Generate slip gaji ${row.name}...`)} className="bg-[#1A3D63] hover:bg-[#122A44] text-white p-1.5 rounded-lg border-none cursor-pointer transition-all active:scale-95 shadow-sm" title="Generate Slip">
                                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                              </button>
                            )}
                          </div>
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
Write-Host "Done"
