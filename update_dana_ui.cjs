const fs = require('fs');
const filePath = 'd:\\SEMESTER 6\\capstone SIA\\CAPSTONE\\src\\pages\\dashboards\\BendaharaDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update State Initializer
content = content.replace(
  /const \[newDanaForm, setNewDanaForm\] = useState\(\{\s*sumber: "Lazismu",/,
  'const [newDanaForm, setNewDanaForm] = useState({\n    sumber: "",'
);

content = content.replace(
  /setNewDanaForm\(\{\s*sumber: "Lazismu",/,
  'setNewDanaForm({\n      sumber: "",'
);

// 2. Update Toolbar Button "Tambah Dana Beasiswa"
content = content.replace(
  /className="bg-\[#10B981\] text-white font-bold text-sm px-4 py-2\.5 rounded-xl cursor-pointer border-none hover:bg-\[#059669\] transition-all flex items-center shadow-sm"\s*>\s*Tambah Dana Beasiswa/,
  'className="bg-[#1A3D63] text-white font-bold text-sm px-4 py-2.5 rounded-xl cursor-pointer border-none hover:bg-[#122A44] transition-all flex items-center shadow-sm"\n                >\n                  Tambah Dana Beasiswa'
);

// 3. Update Modal Button "Simpan Dana"
content = content.replace(
  /className="bg-\[#10B981\] hover:bg-\[#059669\] text-white py-2 px-6 rounded-xl text-sm font-bold cursor-pointer border-none shadow-md transition-all active:scale-95 flex items-center gap-2"\s*>\s*Simpan Dana/,
  'className="bg-[#1A3D63] hover:bg-[#122A44] text-white py-2 px-6 rounded-xl text-sm font-bold cursor-pointer border-none shadow-md transition-all active:scale-95 flex items-center gap-2"\n              >\n                Simpan Dana'
);

// 4. Update the select field to have an empty option
content = content.replace(
  /<select\s*value=\{newDanaForm\.sumber\}\s*onChange=\{\(e\) => setNewDanaForm\(\{ \.\.\.newDanaForm, sumber: e\.target\.value \}\)\}\s*className="([^"]+)"\s*>\s*<option value="Lazismu">Lazismu<\/option>/,
  '<select\n                      value={newDanaForm.sumber}\n                      onChange={(e) => setNewDanaForm({ ...newDanaForm, sumber: e.target.value })}\n                      className="$1"\n                    >\n                      <option value="" disabled>Pilih Sumber</option>\n                      <option value="Lazismu">Lazismu</option>'
);

// 5. Replace focus rings and borders in showAddDanaModal from green to blue
// Only do this in the dana modal area, so I'll just globally replace `#10B981` with `#1A3D63` inside the modal block if any exist.
// A simpler way: we know they are focus:border-[#10B981] and focus:ring-[#10B981]/10
content = content.replace(/focus:border-\[#10B981\]/g, 'focus:border-[#1A3D63]');
content = content.replace(/focus:ring-\[#10B981\]\/10/g, 'focus:ring-[#1A3D63]/10');


// 6. Update Nominal Dana to have fixed Rp prefix.
const nominalDanaOld = `                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nominal Dana <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newDanaForm.nominal}
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^0-9]/g, '');
                      if (val) val = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
                      setNewDanaForm({ ...newDanaForm, nominal: val });
                    }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400"
                    placeholder="Contoh: Rp 50.000.000"
                  />
                </div>`;
const nominalDanaNew = `                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nominal Dana <span className="text-red-500">*</span></label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-500 font-bold text-sm pointer-events-none">Rp</span>
                    <input
                      type="text"
                      value={newDanaForm.nominal}
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^0-9]/g, '');
                        if (val) val = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(val);
                        setNewDanaForm({ ...newDanaForm, nominal: val });
                      }}
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400"
                      placeholder="50.000.000"
                    />
                  </div>
                </div>`;

content = content.replace(nominalDanaOld, nominalDanaNew);

fs.writeFileSync(filePath, content, 'utf8');
console.log('UI updates for Dana Masuk applied successfully');
