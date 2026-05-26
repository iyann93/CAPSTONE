$file = "c:\capstone SIA\CAPSTONE\src\pages\dashboards\BendaharaDashboard.jsx"
$content = Get-Content $file -Raw -Encoding UTF8

# 1. Add state variables
$stateSearch = "  const [editKomponenForm, setEditKomponenForm] = useState({ name: `"`", category: `"Pendapatan`", type: `"Bulanan`", nominal: `"`", status: `"Aktif`" });"
$stateReplace = $stateSearch + "`n`n  // Status Bayar Gaji Modal State`n  const [selectedDetailGaji, setSelectedDetailGaji] = useState(null);`n  const [showDetailGajiModal, setShowDetailGajiModal] = useState(false);"
$content = $content.Replace($stateSearch, $stateReplace)

# 2. Add onClick to Detail button
$buttonSearch = '<button className="inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-700 font-bold bg-transparent border-none cursor-pointer text-[11px] sm:text-xs transition-colors">'
$buttonReplace = @'
                          <button 
                            onClick={() => {
                              setSelectedDetailGaji(row);
                              setShowDetailGajiModal(true);
                            }}
                            className="inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-700 font-bold bg-transparent border-none cursor-pointer text-[11px] sm:text-xs transition-colors"
                          >
'@
$content = $content.Replace($buttonSearch, $buttonReplace)

# 3. Add Modal at the bottom
$modalBlock = @'
      {/* Detail Gaji Modal */}
      {showDetailGajiModal && selectedDetailGaji && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDetailGajiModal(false)} />
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 font-sans overflow-hidden">
            {/* Header */}
            <div className="bg-[#1A3D63] p-6 pb-5 flex justify-between items-start text-white">
              <div>
                <div className="text-[10px] text-blue-200/80 uppercase tracking-widest font-bold mb-1">DETAIL PEMBAYARAN GAJI</div>
                <h2 className="text-lg font-bold tracking-tight">{selectedDetailGaji.name}</h2>
                <p className="text-[13px] text-blue-200 mt-0.5">{selectedDetailGaji.role}</p>
              </div>
              <button onClick={() => setShowDetailGajiModal(false)} className="text-blue-200 hover:text-white bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-white/10 transition-colors">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 pb-4">
              {/* Status Badge */}
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100 border-dashed">
                <span className="text-sm font-medium text-gray-500">Status Pembayaran</span>
                <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${
                  selectedDetailGaji.status === 'Sudah Dibayar' ? 'bg-[#E6F4EA] text-[#059669]' : 
                  selectedDetailGaji.status === 'Proses Transfer' ? 'bg-blue-50 text-blue-600' :
                  'bg-[#FEE2E2] text-[#EF4444]'
                }`}>
                  {selectedDetailGaji.status}
                </span>
              </div>

              {/* Info List */}
              <div className="space-y-3.5 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">ID Transaksi</span>
                  <span className="font-bold text-gray-800">G-101</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Tanggal Bayar</span>
                  <span className="font-bold text-gray-800">{selectedDetailGaji.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Metode</span>
                  <span className="font-bold text-gray-800">Transfer Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Bank Tujuan</span>
                  <span className="font-bold text-gray-800">{selectedDetailGaji.bank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">No. Rekening</span>
                  <span className="font-bold text-gray-800">8821-****-9901</span>
                </div>
              </div>

              {/* Rincian Gaji */}
              <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 mb-2">
                <div className="text-[10px] font-bold text-gray-400 mb-3 tracking-wider uppercase">RINCIAN GAJI</div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Gaji Pokok</span>
                    <span className="font-bold text-gray-800">Rp 3.500.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#059669] font-medium">+ Tunjangan</span>
                    <span className="font-bold text-[#059669]">+Rp 1.000.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#EF4444] font-medium">- Potongan</span>
                    <span className="font-bold text-[#EF4444]">-Rp 394.500</span>
                  </div>
                </div>
                
                <div className="border-t border-dashed border-gray-200 my-4"></div>
                
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Gaji Bersih</span>
                  <span className="text-xl font-black text-[#059669]">{selectedDetailGaji.salary}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 pt-0">
              <button
                onClick={() => setShowDetailGajiModal(false)}
                className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-3.5 rounded-xl text-[13px] font-bold cursor-pointer transition-colors shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
'@

$content = $content.Replace("    </main>", $modalBlock)

[System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
Write-Host "Modified successfully"
