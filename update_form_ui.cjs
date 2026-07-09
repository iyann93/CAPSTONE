const fs = require('fs');
const filePath = 'd:\\SEMESTER 6\\capstone SIA\\CAPSTONE\\src\\pages\\dashboards\\BendaharaDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update Nominal Bantuan Input to have fixed Rp prefix.
const nominalOld = `                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nominal Bantuan <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newProgramForm.nominal}
                      onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, nominal: e.target.value }) }}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400"
                      placeholder="Contoh: Rp250.000"
                    />
                  </div>`;
const nominalNew = `                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nominal Bantuan <span className="text-red-500">*</span></label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-gray-500 font-bold text-sm pointer-events-none">Rp</span>
                      <input
                        type="text"
                        value={newProgramForm.nominal}
                        onChange={(e) => { 
                          setIsProgramFormDirty(true); 
                          let val = e.target.value.replace(/[^0-9]/g, '');
                          if (val) val = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(val);
                          setNewProgramForm({ ...newProgramForm, nominal: val });
                        }}
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400"
                        placeholder="250.000"
                      />
                    </div>
                  </div>`;
content = content.replace(nominalOld, nominalNew);

// 2. Update Periode Pendaftaran from 1 text input to 2 date inputs.
const periodeOld = `                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Periode Pendaftaran <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newProgramForm.periodePendaftaran}
                      onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, periodePendaftaran: e.target.value }) }}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400"
                      placeholder="Contoh: 1 Juli - 15 Juli 2025"
                    />
                  </div>`;
const periodeNew = `                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Periode Pendaftaran <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={newProgramForm.tanggalMulaiDaftar}
                        onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, tanggalMulaiDaftar: e.target.value }) }}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all"
                      />
                      <span className="text-gray-400 text-sm font-bold">-</span>
                      <input
                        type="date"
                        value={newProgramForm.tanggalSelesaiDaftar}
                        onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, tanggalSelesaiDaftar: e.target.value }) }}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all"
                      />
                    </div>
                  </div>`;
content = content.replace(periodeOld, periodeNew);

// 3. Update Deskripsi Placeholder
const descOld = `                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Deskripsi Program</label>
                  <textarea
                    value={newProgramForm.deskripsi}
                    onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, deskripsi: e.target.value }) }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400 resize-none min-h-[80px]"
                    placeholder="Jelaskan secara singkat mengenai program beasiswa ini..."
                  ></textarea>
                </div>`;
const descNew = `                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Deskripsi Program</label>
                  <textarea
                    value={newProgramForm.deskripsi}
                    onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, deskripsi: e.target.value }) }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400 resize-none min-h-[80px]"
                    placeholder="Contoh: Program beasiswa ini ditujukan untuk siswa berprestasi yang berasal dari keluarga kurang mampu guna meringankan biaya pendidikan."
                  ></textarea>
                </div>`;
content = content.replace(descOld, descNew);

// 4. Update Persyaratan Placeholder
const reqOld = `                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Persyaratan Khusus</label>
                  <textarea
                    value={newProgramForm.persyaratan}
                    onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, persyaratan: e.target.value }) }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400 resize-none min-h-[80px]"
                    placeholder="Sebutkan syarat-syarat khusus (misal: FC Rapor, SKTM, dll)..."
                  ></textarea>
                </div>`;
const reqNew = `                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Persyaratan Khusus</label>
                  <textarea
                    value={newProgramForm.persyaratan}
                    onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, persyaratan: e.target.value }) }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400 resize-none min-h-[80px]"
                    placeholder="Contoh: siswa aktif MBS Prambanan, berasal dari keluarga kurang mampu, melampirkan surat keterangan tidak mampu atau dokumen pendukung, tidak memiliki pelanggaran disiplin berat, dan bersedia mengikuti proses verifikasi sekolah."
                  ></textarea>
                </div>`;
content = content.replace(reqOld, reqNew);

// 5. Append Delete Confirmation Modal right before the end of the return statement.
const deleteModal = `
      {showDeleteProgramConfirmModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteProgramConfirmModal(false)} />
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-xl animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-4">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Program Beasiswa?</h3>
            <p className="text-sm text-gray-600 mb-6">Apakah Anda yakin ingin menghapus program beasiswa ini? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteProgramConfirmModal(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors">Batal</button>
              <button onClick={executeDeleteProgram} className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm">Ya, Hapus Program</button>
            </div>
          </div>
        </div>
      )}
`;

// Insert right before `{showProgramCancelConfirm && (`
const cancelConfirmStr = "{showProgramCancelConfirm && (";
const cancelConfirmIdx = content.indexOf(cancelConfirmStr);
if(cancelConfirmIdx !== -1) {
    content = content.substring(0, cancelConfirmIdx) + deleteModal + content.substring(cancelConfirmIdx);
} else {
    console.error("Could not find cancel confirm modal");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('UI fields updated successfully');
