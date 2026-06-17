const fs = require('fs');
const filePath = 'd:\\SEMESTER 6\\capstone SIA\\CAPSTONE\\src\\pages\\dashboards\\BendaharaDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add states for Dana Form Dirty Checking
const stateInsert = `
  const [isDanaFormDirty, setIsDanaFormDirty] = useState(false);
  const [showDanaCancelConfirm, setShowDanaCancelConfirm] = useState(false);
`;
content = content.replace(
  /const \[newDanaForm, setNewDanaForm\] = useState\(\{[\s\S]*?\}\);/,
  match => match + stateInsert
);

// 2. Add handleCancelDana function
const handleCancelDana = `
  const handleCancelDana = () => {
    if (isDanaFormDirty) {
      setShowDanaCancelConfirm(true);
    } else {
      setShowAddDanaModal(false);
    }
  };
`;
// Insert it after handleSaveDana
content = content.replace(
  /(const handleSaveDana = \(\) => \{[\s\S]*?\}\);)/,
  match => match + '\n' + handleCancelDana
);

// 3. Update handleSaveDana to clear dirty state
content = content.replace(
  /setShowAddDanaModal\(false\);/,
  'setShowAddDanaModal(false);\n    setIsDanaFormDirty(false);'
);

// 4. Update the trigger to open Add Dana modal to clear dirty state
content = content.replace(
  /onClick=\{\(\) => setShowAddDanaModal\(true\)\}/g,
  'onClick={() => { setIsDanaFormDirty(false); setShowAddDanaModal(true); }}'
);

// 5. Update Batal button and Background in showAddDanaModal to use handleCancelDana
// First, find the background overlay
content = content.replace(
  /<div className="absolute inset-0 bg-black\/40 backdrop-blur-sm" onClick=\{\(\) => setShowAddDanaModal\(false\)\} \/>/g,
  '<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCancelDana} />'
);

// Then, find the Batal button inside the Add Dana Modal
// It looks like: <button onClick={() => setShowAddDanaModal(false)} className="px-5 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent">Batal</button>
content = content.replace(
  /<button onClick=\{\(\) => setShowAddDanaModal\(false\)\} className="px-5 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent">Batal<\/button>/g,
  '<button onClick={handleCancelDana} className="px-5 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent">Batal</button>'
);

// Also the top close 'X' button
content = content.replace(
  /<button onClick=\{\(\) => setShowAddDanaModal\(false\)\} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer border-none">/g,
  '<button onClick={handleCancelDana} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer border-none">'
);


// 6. Add setIsDanaFormDirty(true) to onChange handlers in Add Dana Modal
content = content.replace(
  /onChange=\{\(e\) => setNewDanaForm\(\{ \.\.\.newDanaForm, sumber: e\.target\.value \}\)\}/,
  'onChange={(e) => { setIsDanaFormDirty(true); setNewDanaForm({ ...newDanaForm, sumber: e.target.value }) }}'
);

content = content.replace(
  /onChange=\{\(e\) => setNewDanaForm\(\{ \.\.\.newDanaForm, tanggal: e\.target\.value \}\)\}/,
  'onChange={(e) => { setIsDanaFormDirty(true); setNewDanaForm({ ...newDanaForm, tanggal: e.target.value }) }}'
);

content = content.replace(
  /onChange=\{\(e\) => setNewDanaForm\(\{ \.\.\.newDanaForm, keterangan: e\.target\.value \}\)\}/,
  'onChange={(e) => { setIsDanaFormDirty(true); setNewDanaForm({ ...newDanaForm, keterangan: e.target.value }) }}'
);

content = content.replace(
  /let val = e\.target\.value\.replace\(\/\[\^0-9\]\/g, ''\);/,
  'setIsDanaFormDirty(true);\n                        let val = e.target.value.replace(/[^0-9]/g, \'\');'
);


// 7. Add the showDanaCancelConfirm modal
const confirmModal = `
      {showDanaCancelConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDanaCancelConfirm(false)} />
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-xl animate-scaleUp">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Batalkan Perubahan?</h3>
            <p className="text-sm text-gray-600 mb-6">Data dana yang sudah Anda isi belum disimpan dan akan hilang. Apakah Anda yakin ingin membatalkan?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDanaCancelConfirm(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent">Lanjutkan Mengisi</button>
              <button onClick={() => { setShowDanaCancelConfirm(false); setShowAddDanaModal(false); setIsDanaFormDirty(false); }} className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm cursor-pointer border-none">Ya, Batalkan</button>
            </div>
          </div>
        </div>
      )}
`;

const insertIndex = content.lastIndexOf('</div>');
// Need to insert it right before the last closing div of the main container, or next to showAddDanaModal closing.
// Actually, I can insert it right before \n    </div>\n  );\n}
content = content.replace(
  /(\n    <\/div>\n  \);\n\})/,
  match => confirmModal + match
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Cancel verification applied successfully to Dana modal');
