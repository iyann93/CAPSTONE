import re

with open('src/pages/dashboards/WakilKepalaSarpras.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to replace the showLaporanModal container.
# The start is: {showLaporanModal && ReactDOM.createPortal(
# We'll replace up to: {/* Sticky Header

start_str = "{showLaporanModal && ReactDOM.createPortal("
end_str = "              {/* Sticky Header"

idx1 = content.find(start_str)
idx2 = content.find(end_str)

if idx1 != -1 and idx2 != -1:
    new_header = '''{showLaporanModal && ReactDOM.createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-8 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-full flex flex-col overflow-hidden">
'''
    content = content[:idx1] + new_header + content[idx2:]

# Now replace the Action Bar
action_start = "{/* Sticky Header"
action_end = "{/* Scrollable Preview Area"

idx3 = content.find(action_start)
idx4 = content.find(action_end)

if idx3 != -1 and idx4 != -1:
    new_action = '''              {/* Action Bar */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50 flex-shrink-0">
                <h3 className="text-lg font-bold text-[#1F3A5F] m-0">Pratinjau Laporan Penggunaan Anggaran</h3>
                <div className="flex gap-3">
                  <button
                    onClick={handleCetakLaporan}
                    disabled={isGeneratingPdf}
                    className={lex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all }
                  >
                    <DownloadIcon /> {isGeneratingPdf ? 'Memproses...' : 'Unduh PDF'}
                  </button>
                  <button
                    onClick={() => setShowLaporanModal(false)}
                    className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-sm font-bold transition-all shadow-sm"
                  >
                    Tutup
                  </button>
                </div>
              </div>

'''
    content = content[:idx3] + new_action + content[idx4:]

# Now replace Scrollable Preview Area wrapper
scroll_start = "{/* Scrollable Preview Area */}"
scroll_end = "                <div\n                  className=\"bg-white font-sans\"\n                  style={{\n                    width: '794px',\n                    minWidth: '794px',"

idx5 = content.find(scroll_start)
idx6 = content.find(scroll_end)

if idx5 != -1 and idx6 != -1:
    new_scroll = '''              {/* Scrollable Preview Area */}
              <div className="flex-1 overflow-y-auto bg-gray-200 p-6 sm:p-10 flex justify-center items-start custom-scrollbar">
                <div className="bg-white font-sans shadow-md border border-gray-300" style={{ width: '794px', minWidth: '794px', padding: '48px' }}>
'''
    content = content[:idx5] + new_scroll + content[idx6 + len(scroll_end):]

with open('src/pages/dashboards/WakilKepalaSarpras.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched modal")
