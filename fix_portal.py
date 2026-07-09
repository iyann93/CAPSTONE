import re

with open('src/pages/dashboards/PengumumanSekolah.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import ReactDOM
if 'import ReactDOM' not in content:
    content = content.replace('import React, { useState, useEffect } from "react";', 'import React, { useState, useEffect } from "react";\nimport ReactDOM from "react-dom";')

# Replace Modal
old_modal_start = '''      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">'''
new_modal_start = '''      {/* Add Modal */}
      {isAdding && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">'''
content = content.replace(old_modal_start, new_modal_start)

old_modal_end = '''              <button onClick={handleSaveNewAnn} className="px-5 py-2 bg-[#1A3D63] text-white rounded-lg text-[13px] font-bold hover:bg-[#122A44] transition-colors">Terbitkan Pengumuman</button>
            </div>
          </div>
        </div>
      )}'''
new_modal_end = '''              <button onClick={handleSaveNewAnn} className="px-5 py-2 bg-[#1A3D63] text-white rounded-lg text-[13px] font-bold hover:bg-[#122A44] transition-colors">Terbitkan Pengumuman</button>
            </div>
          </div>
        </div>,
        document.body
      )}'''
content = content.replace(old_modal_end, new_modal_end)

# Reduce size of modal inputs
content = content.replace('rows="5"', 'rows="3"')
content = content.replace('max-h-[70vh]', 'max-h-[85vh]')

with open('src/pages/dashboards/PengumumanSekolah.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patching portal completed.")
