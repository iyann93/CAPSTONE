const fs = require('fs');
const file = 'src/pages/dashboards/BendaharaDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update State
const oldState = `  const [newProgramForm, setNewProgramForm] = useState({ title: "", amount: "", subtitle: "2025/2026" });`;
const newState = `  const [newProgramForm, setNewProgramForm] = useState({
    nama: "",
    deskripsi: "",
    kategori: "Akademik",
    periode: "2025/2026",
    kuota: "",
    nominal: "",
    persyaratan: "",
    status: "Aktif"
  });`;
content = content.replace(oldState, newState);

// 2. Update handleSaveProgram
const oldSaveFuncRegex = /const handleSaveProgram = \(\) => \{[\s\S]*?triggerToast\("Program berhasil ditambahkan!"\);\s*\};/;
const newSaveFunc = `const handleSaveProgram = () => {
    if(!newProgramForm.nama || !newProgramForm.nominal) {
      triggerToast("Mohon isi Nama Program dan Nominal minimal", "error");
      return;
    }
    const newProgram = {
      title: newProgramForm.nama,
      subtitle: newProgramForm.periode,
      type: newProgramForm.kategori,
      amount: newProgramForm.nominal,
      status: newProgramForm.status,
      users: "0 siswa",
      typeColor: "blue",
      description: newProgramForm.deskripsi,
      quota: newProgramForm.kuota,
      requirements: newProgramForm.persyaratan
    };
    setProgramList([...programList, newProgram]);
    setShowAddProgramModal(false);
    setNewProgramForm({
      nama: "", deskripsi: "", kategori: "Akademik", periode: "2025/2026", kuota: "", nominal: "", persyaratan: "", status: "Aktif"
    });
    triggerToast("Program berhasil ditambahkan!");
  };`;
content = content.replace(oldSaveFuncRegex, newSaveFunc);

// 3. Replace the Modal UI
const oldModalRegex = /\{\/\* Add New Program Modal \*\/\}\s*\{showAddProgramModal && \([\s\S]*?\}\s*\)\}/;
const newModal = `{/* Add New Program Modal */}
      {showAddProgramModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddProgramModal(false)} />
          <div className="bg-white rounded-[24px] p-6 sm:p-8 max-w-2xl w-full relative z-10 shadow-2xl animate-scaleUp font-sans border border-gray-100 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Tambah Program Baru</h2>
              <button onClick={() => setShowAddProgramModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer border-none">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar -mr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left Column */}
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Program <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newProgramForm.nama}
                      onChange={(e) => setNewProgramForm({ ...newProgramForm, nama: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700"
                      placeholder="Contoh: Beasiswa Tahfiz Quran"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori Beasiswa</label>
                    <select
                      value={newProgramForm.kategori}
                      onChange={(e) => setNewProgramForm({ ...newProgramForm, kategori: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700 appearance-none"
                    >
                      <option value="Akademik">Akademik</option>
                      <option value="Non-Akademik">Non-Akademik</option>
                      <option value="Umum">Umum</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Periode Pendaftaran</label>
                    <input
                      type="text"
                      value={newProgramForm.periode}
                      onChange={(e) => setNewProgramForm({ ...newProgramForm, periode: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700"
                      placeholder="Contoh: 2025/2026 atau Ganjil 2025"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status Program</label>
                    <select
                      value={newProgramForm.status}
                      onChange={(e) => setNewProgramForm({ ...newProgramForm, status: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700 appearance-none"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Tidak Aktif">Tidak Aktif</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nominal Dana <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newProgramForm.nominal}
                      onChange={(e) => setNewProgramForm({ ...newProgramForm, nominal: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700"
                      placeholder="Contoh: 100% atau Rp 250.000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kuota Penerima</label>
                    <input
                      type="number"
                      value={newProgramForm.kuota}
                      onChange={(e) => setNewProgramForm({ ...newProgramForm, kuota: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700"
                      placeholder="Contoh: 50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Singkat</label>
                    <textarea
                      value={newProgramForm.deskripsi}
                      onChange={(e) => setNewProgramForm({ ...newProgramForm, deskripsi: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700 resize-none h-[60px]"
                      placeholder="Penjelasan singkat..."
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Persyaratan</label>
                    <textarea
                      value={newProgramForm.persyaratan}
                      onChange={(e) => setNewProgramForm({ ...newProgramForm, persyaratan: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700 resize-none h-[60px]"
                      placeholder="Syarat penerima..."
                    ></textarea>
                  </div>
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
      )}`;
content = content.replace(oldModalRegex, newModal);

fs.writeFileSync(file, content);
console.log("Successfully expanded modal");
