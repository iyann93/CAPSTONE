const fs = require('fs');
const filePath = 'd:\\SEMESTER 6\\capstone SIA\\CAPSTONE\\src\\pages\\dashboards\\BendaharaDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const startStr = "{showAddProgramModal && (";
const startIdx = content.indexOf(startStr);
if (startIdx === -1) {
    console.error("Could not find showAddProgramModal");
    process.exit(1);
}

// Find the closing parenthesis for the modal
let endIdx = content.indexOf('          </div>\n        </div>\n      )}', startIdx);
if (endIdx === -1) {
    console.error("Could not find end of showAddProgramModal");
    process.exit(1);
}
endIdx += '          </div>\n        </div>\n      )}'.length;

const newModals = `{showAddProgramModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 md:p-10">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCancelProgram} />
          <div className="bg-white rounded-[24px] p-5 sm:p-6 max-w-2xl w-full relative z-10 shadow-2xl animate-scaleUp font-sans border border-gray-100 flex flex-col max-h-[calc(100vh-100px)]">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h2 className="text-lg font-bold text-gray-800">Tambah Program Baru</h2>
              <button onClick={handleCancelProgram} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer border-none">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="overflow-y-auto overflow-x-hidden pr-2 flex-1 scrollbar-hide">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Program <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newProgramForm.nama}
                      onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, nama: e.target.value }) }}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400"
                      placeholder="Contoh: Beasiswa Prestasi"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Kategori Beasiswa <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        value={newProgramForm.kategori}
                        onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, kategori: e.target.value }) }}
                        className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 appearance-none transition-all cursor-pointer"
                      >
                        <option value="" disabled>Pilih Kategori</option>
                        <option value="Dhuafa/Kurang Mampu">Dhuafa/Kurang Mampu</option>
                        <option value="Yatim/Piatu">Yatim/Piatu</option>
                        <option value="Prestasi Akademik">Prestasi Akademik</option>
                        <option value="Prestasi Non-Akademik">Prestasi Non-Akademik</option>
                        <option value="Tahfidz">Tahfidz</option>
                        <option value="Beasiswa Khusus">Beasiswa Khusus</option>
                      </select>
                      <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"><IconChevronDown /></span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sumber Dana <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        value={newProgramForm.sumberDana}
                        onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, sumberDana: e.target.value }) }}
                        className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 appearance-none transition-all cursor-pointer"
                      >
                        <option value="" disabled>Pilih Sumber</option>
                        <option value="Lazismu">Lazismu</option>
                        <option value="Sekolah">Sekolah</option>
                        <option value="Donatur">Donatur</option>
                        <option value="Alumni">Alumni</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                      <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"><IconChevronDown /></span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nominal Bantuan <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newProgramForm.nominal}
                      onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, nominal: e.target.value }) }}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400"
                      placeholder="Contoh: Rp250.000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Kuota Penerima</label>
                    <input
                      type="number"
                      value={newProgramForm.kuota}
                      onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, kuota: e.target.value }) }}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400"
                      placeholder="Contoh: 50"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tahun Ajaran <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        value={newProgramForm.tahunAjaran}
                        onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, tahunAjaran: e.target.value }) }}
                        className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 appearance-none transition-all cursor-pointer"
                      >
                        <option value="2025/2026">2025/2026</option>
                        <option value="2024/2025">2024/2025</option>
                      </select>
                      <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"><IconChevronDown /></span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Periode Pendaftaran <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newProgramForm.periodePendaftaran}
                      onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, periodePendaftaran: e.target.value }) }}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400"
                      placeholder="Contoh: 1 Juli - 15 Juli 2025"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Status Program</label>
                    <div className="relative">
                      <select
                        value={newProgramForm.status}
                        onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, status: e.target.value }) }}
                        className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 appearance-none transition-all cursor-pointer"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Nonaktif">Nonaktif</option>
                      </select>
                      <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"><IconChevronDown /></span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Deskripsi Program</label>
                  <textarea
                    value={newProgramForm.deskripsi}
                    onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, deskripsi: e.target.value }) }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400 resize-none min-h-[80px]"
                    placeholder="Jelaskan secara singkat mengenai program beasiswa ini..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Persyaratan Khusus</label>
                  <textarea
                    value={newProgramForm.persyaratan}
                    onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, persyaratan: e.target.value }) }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400 resize-none min-h-[80px]"
                    placeholder="Sebutkan syarat-syarat khusus (misal: FC Rapor, SKTM, dll)..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-gray-100 flex justify-end gap-3 shrink-0">
              <button onClick={handleCancelProgram} className="px-5 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent">Batal</button>
              <button onClick={handleSaveProgram} className="bg-[#1A3D63] hover:bg-[#122A44] text-white py-2 px-6 rounded-xl text-sm font-bold cursor-pointer border-none shadow-md transition-all active:scale-95 flex items-center gap-2">
                Simpan Program
              </button>
            </div>
          </div>
        </div>
      )}

      {showProgramCancelConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowProgramCancelConfirm(false)} />
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-xl animate-scaleUp">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Batalkan Perubahan?</h3>
            <p className="text-sm text-gray-600 mb-6">Data yang sudah Anda isi belum disimpan dan akan hilang. Apakah Anda yakin ingin membatalkan?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowProgramCancelConfirm(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors">Lanjutkan Mengisi</button>
              <button onClick={() => { setShowProgramCancelConfirm(false); setShowAddProgramModal(false); setIsProgramFormDirty(false); }} className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm">Ya, Batalkan</button>
            </div>
          </div>
        </div>
      )}

      {showAddDanaModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 md:p-10">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddDanaModal(false)} />
          <div className="bg-white rounded-[24px] p-5 sm:p-6 max-w-lg w-full relative z-10 shadow-2xl animate-scaleUp font-sans border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h2 className="text-lg font-bold text-gray-800">Tambah Dana Masuk</h2>
              <button onClick={() => setShowAddDanaModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer border-none">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="overflow-y-auto pr-2 flex-1 scrollbar-hide">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sumber Dana <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      value={newDanaForm.sumber}
                      onChange={(e) => setNewDanaForm({ ...newDanaForm, sumber: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/10 bg-white text-gray-700 appearance-none transition-all cursor-pointer"
                    >
                      <option value="Lazismu">Lazismu</option>
                      <option value="Sekolah">Sekolah</option>
                      <option value="Donatur">Donatur</option>
                      <option value="Alumni">Alumni</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    <span className="absolute right-3 top-3 text-gray-400 pointer-events-none"><IconChevronDown /></span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nominal Dana <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newDanaForm.nominal}
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^0-9]/g, '');
                      if (val) val = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
                      setNewDanaForm({ ...newDanaForm, nominal: val });
                    }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/10 bg-white text-gray-700 transition-all placeholder-gray-400"
                    placeholder="Contoh: Rp 50.000.000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tanggal Dana Masuk <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={newDanaForm.tanggal}
                    onChange={(e) => setNewDanaForm({ ...newDanaForm, tanggal: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/10 bg-white text-gray-700 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Keterangan Tambahan</label>
                  <textarea
                    value={newDanaForm.keterangan}
                    onChange={(e) => setNewDanaForm({ ...newDanaForm, keterangan: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/10 bg-white text-gray-700 transition-all placeholder-gray-400 resize-none min-h-[80px]"
                    placeholder="Opsional: Keterangan tentang penggunaan atau peruntukan dana..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-gray-100 flex justify-end gap-3 shrink-0">
              <button onClick={() => setShowAddDanaModal(false)} className="px-5 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent">Batal</button>
              <button onClick={handleSaveDana} className="bg-[#10B981] hover:bg-[#059669] text-white py-2 px-6 rounded-xl text-sm font-bold cursor-pointer border-none shadow-md transition-all active:scale-95 flex items-center gap-2">
                Simpan Dana
              </button>
            </div>
          </div>
        </div>
      )}`;

content = content.substring(0, startIdx) + newModals + content.substring(endIdx);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Modals injected successfully');
