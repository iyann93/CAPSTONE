const fs = require('fs');
const file = 'src/pages/dashboards/BendaharaDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Rename existing showAddProgramModal -> showAddPenerimaModal
content = content.replace(/showAddProgramModal/g, 'showAddPenerimaModal');
content = content.replace(/setShowAddProgramModal/g, 'setShowAddPenerimaModal');

// 2. Add New States for Program Beasiswa
const stateInjectionPoint = `  const [beasiswaList, setBeasiswaList] = useState([]);`;
const newStates = `  // Actual Program State
  const [showAddProgramModal, setShowAddProgramModal] = useState(false);
  const [programList, setProgramList] = useState([
    { title: "Beasiswa Prestasi Akademik", subtitle: "2025/2026", type: "Beasiswa", amount: "100%", status: "Aktif", users: "12 siswa", typeColor: "blue" },
    { title: "Beasiswa dari Lazismu", subtitle: "2025/2026", type: "Beasiswa", amount: "50%", status: "Aktif", users: "24 siswa", typeColor: "blue" },
    { title: "Beasiswa Tahridz Al-Qur'an", subtitle: "Setiap Bulan", type: "Beasiswa", amount: "100%", status: "Aktif", users: "8 siswa", typeColor: "blue" },
    { title: "Beasiswa Prestasi Non-Akademik", subtitle: "Setiap Bulan", type: "Beasiswa", amount: "25%", status: "Aktif", users: "16 siswa", typeColor: "blue" },
    { title: "Beasiswa Tahfiz Quran", subtitle: "2025/2026", type: "Beasiswa", amount: "75%", status: "Aktif", users: "18 siswa", typeColor: "blue" },
    { title: "Beasiswa Penyarikatan Muhammadiyah", subtitle: "2025/2026", type: "Beasiswa", amount: "Rp 150.000", status: "Aktif", users: "3 siswa", typeColor: "blue" }
  ]);
  const [newProgramForm, setNewProgramForm] = useState({ title: "", amount: "", subtitle: "2025/2026" });

  const [beasiswaList, setBeasiswaList] = useState([]);`;
content = content.replace(stateInjectionPoint, newStates);

// 3. Add handleSaveProgram
const functionInjectionPoint = `  const handleSaveBeasiswa = async () => {`;
const handleSaveProgram = `  const handleSaveProgram = () => {
    if(!newProgramForm.title || !newProgramForm.amount) {
      triggerToast("Mohon lengkapi form program", "error");
      return;
    }
    const newProgram = {
      title: newProgramForm.title,
      subtitle: newProgramForm.subtitle,
      type: "Beasiswa",
      amount: newProgramForm.amount,
      status: "Aktif",
      users: "0 siswa",
      typeColor: "blue"
    };
    setProgramList([...programList, newProgram]);
    setShowAddProgramModal(false);
    setNewProgramForm({ title: "", amount: "", subtitle: "2025/2026" });
    triggerToast("Program berhasil ditambahkan!");
  };

  const handleDeleteProgram = (title) => {
    setProgramList(programList.filter(p => p.title !== title));
    triggerToast("Program berhasil dihapus!");
  };

  const handleSaveBeasiswa = async () => {`;
content = content.replace(functionInjectionPoint, handleSaveProgram);

// 4. Update Header Buttons
const headerButtonsOld = `<button
                  onClick={() => {
                    setSelectedBeasiswa(null);
                    setBeasiswaForm({
                      siswaId: "",
                      namaBeasiswa: "",
                      nominal: "",
                      periode: "2025/2026",
                      status: "Aktif",
                      tanggalMulai: new Date().toISOString().split('T')[0],
                      tanggalSelesai: ""
                    });
                    setShowAddPenerimaModal(true);
                  }}
                  className="bg-[#1A3D63] text-white font-bold text-sm px-4 py-2.5 rounded-xl cursor-pointer border-none hover:bg-[#122A44] transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  Tambah Penerima
                </button>`;

const headerButtonsNew = `<button
                  onClick={() => setShowAddProgramModal(true)}
                  className="bg-white border border-gray-200 text-[#1A3D63] font-bold text-sm px-4 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  Tambah Program
                </button>
                <button
                  onClick={() => {
                    setSelectedBeasiswa(null);
                    setBeasiswaForm({
                      siswaId: "",
                      namaBeasiswa: "",
                      nominal: "",
                      periode: "2025/2026",
                      status: "Aktif",
                      tanggalMulai: new Date().toISOString().split('T')[0],
                      tanggalSelesai: ""
                    });
                    setShowAddPenerimaModal(true);
                  }}
                  className="bg-[#1A3D63] text-white font-bold text-sm px-4 py-2.5 rounded-xl cursor-pointer border-none hover:bg-[#122A44] transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  Tambah Penerima
                </button>`;
content = content.replace(headerButtonsOld, headerButtonsNew);

// 5. Update Stats (Total Program Aktif)
const statsOld = `<div className="text-2xl font-bold text-white">5</div>
                <div className="text-[11px] text-blue-200 mt-1 font-semibold uppercase tracking-wider">Total Program Aktif</div>`;
const statsNew = `<div className="text-2xl font-bold text-white">{programList.length}</div>
                <div className="text-[11px] text-blue-200 mt-1 font-semibold uppercase tracking-wider">Total Program Aktif</div>`;
content = content.replace(statsOld, statsNew);

// 6. Map Cards dynamically instead of static array
const mapOld = `{[
                  { title: "Beasiswa Prestasi Akademik", subtitle: "2025/2026", type: "Beasiswa", amount: "100%", status: "Aktif", users: "12 siswa", typeColor: "blue" },
                  { title: "Beasiswa dari Lazismu", subtitle: "2025/2026", type: "Beasiswa", amount: "50%", status: "Aktif", users: "24 siswa", typeColor: "blue" },
                  { title: "Beasiswa Tahridz Al-Qur'an", subtitle: "Setiap Bulan", type: "Beasiswa", amount: "100%", status: "Aktif", users: "8 siswa", typeColor: "blue" },
                  { title: "Beasiswa Prestasi Non-Akademik", subtitle: "Setiap Bulan", type: "Beasiswa", amount: "25%", status: "Aktif", users: "16 siswa", typeColor: "blue" },
                  { title: "Beasiswa Tahfiz Quran", subtitle: "2025/2026", type: "Beasiswa", amount: "75%", status: "Aktif", users: "18 siswa", typeColor: "blue" },
                  { title: "Beasiswa Penyarikatan Muhammadiyah", subtitle: "2025/2026", type: "Beasiswa", amount: "Rp 150.000", status: "Aktif", users: "3 siswa", typeColor: "blue" }
                ].map((item, i) => (`;
content = content.replace(mapOld, '{programList.map((item, i) => (');

// 7. Update Delete Action on cards
const deleteBtnRegex = /<button className="w-8 h-8 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors cursor-pointer">\s*<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14\.74 9-\.346 9m-4\.788 0L9\.26 9m9\.968-3\.21c\.342\.052\.682\.107 1\.022\.166m-1\.022-\.165L18\.16 19\.673a2\.25 2\.25 0 0 1-2\.244 2\.077H8\.084a2\.25 2\.25 0 0 1-2\.244-2\.077L4\.772 5\.79m14\.456 0a48\.108 48\.108 0 0 0-3\.478-\.397m-12 \.562c\.34-\.059\.68-\.114 1\.022-\.165m0 0a48\.11 48\.11 0 0 1 3\.478-\.397m7\.5 0v-\.916c0-1\.18-\.91-2\.164-2\.09-2\.201a51\.964 51\.964 0 0 0-3\.32 0c-1\.18\.037-2\.09 1\.022-2\.09 2\.201v\.916m7\.5 0a48\.667 48\.667 0 0 0-7\.5 0" \/><\/svg>\s*<\/button>/g;
const newDeleteBtn = `<button onClick={() => handleDeleteProgram(item.title)} className="w-8 h-8 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors cursor-pointer">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        </button>`;
content = content.replace(deleteBtnRegex, newDeleteBtn);

// 8. Add Modal for New Program
const modalInsertionPoint = `{/* Add/Edit Program Beasiswa Modal */}`;
const programModal = `
      {/* Add New Program Modal */}
      {showAddProgramModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddProgramModal(false)} />
          <div className="bg-white rounded-[24px] p-6 sm:p-8 max-w-md w-full relative z-10 shadow-2xl animate-scaleUp font-sans border border-gray-100 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Tambah Program Baru</h2>
              <button onClick={() => setShowAddProgramModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer border-none">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar -mr-2">
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Program Beasiswa</label>
                  <input
                    type="text"
                    value={newProgramForm.title}
                    onChange={(e) => setNewProgramForm({ ...newProgramForm, title: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700"
                    placeholder="Contoh: Beasiswa Tahfiz Quran"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Periode</label>
                  <select
                    value={newProgramForm.subtitle}
                    onChange={(e) => setNewProgramForm({ ...newProgramForm, subtitle: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700 appearance-none"
                  >
                    <option value="2025/2026">2025/2026</option>
                    <option value="Setiap Bulan">Setiap Bulan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Potongan / Nominal</label>
                  <input
                    type="text"
                    value={newProgramForm.amount}
                    onChange={(e) => setNewProgramForm({ ...newProgramForm, amount: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700"
                    placeholder="Contoh: 100% atau Rp 250.000"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowAddProgramModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent">Batal</button>
              <button onClick={handleSaveProgram} className="bg-[#1A3D63] hover:bg-[#122A44] text-white py-2.5 px-6 rounded-xl text-sm font-bold cursor-pointer border-none shadow-md transition-all active:scale-95 flex items-center gap-2">
                Simpan Program
              </button>
            </div>
          </div>
        </div>
      )}
`;
content = content.replace(modalInsertionPoint, programModal + '\n      ' + modalInsertionPoint);

// 9. Update the Dropdown in Tambah Penerima
const staticOptions = `<option value="" disabled>-- Pilih Program --</option>
                        <option value="Beasiswa Prestasi Akademik">Beasiswa Prestasi Akademik</option>
                        <option value="Beasiswa dari Lazismu">Beasiswa dari Lazismu</option>
                        <option value="Beasiswa Tahfidz Al-Qur'an">Beasiswa Tahfidz Al-Qur'an</option>
                        <option value="Beasiswa Prestasi Non-Akademik">Beasiswa Prestasi Non-Akademik</option>
                        <option value="Beasiswa Tahfiz Quran">Beasiswa Tahfiz Quran</option>
                        <option value="Beasiswa Penyarikatan Muhammadiyah">Beasiswa Penyarikatan Muhammadiyah</option>`;

const dynamicOptions = `<option value="" disabled>-- Pilih Program --</option>
                        {programList.map((prog, idx) => (
                          <option key={idx} value={prog.title}>{prog.title}</option>
                        ))}`;
content = content.replace(staticOptions, dynamicOptions);

fs.writeFileSync(file, content);
console.log("Successfully rewrote the logic securely!");
