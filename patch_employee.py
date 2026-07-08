import re

with open('src/pages/dashboards/EmployeeData.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove Ganti Foto block
ganti_foto_block = '''                <div className="flex items-center gap-2 w-full">
                  <button className="flex-1 flex items-center justify-center bg-[#F3F4F6] hover:bg-gray-200 text-[#1F2937] px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all">
                    <UploadIcon />
                    Ganti Foto
                  </button>
                  <button className="px-3.5 py-2.5 bg-blue-50 text-[#4A7FA7] border border-blue-100 rounded-xl hover:bg-blue-100 transition-all">
                    <TrashIcon />
                  </button>
                </div>'''

content = content.replace(ganti_foto_block, '')

# 2. Remove Cetak SK block
cetak_sk_block = '''                  <button className="w-full flex items-center justify-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-[#1F2937] hover:bg-gray-50 transition-all shadow-sm">
                    <PrintIcon />
                    Cetak SK
                  </button>'''

content = content.replace(cetak_sk_block, '')

with open('src/pages/dashboards/EmployeeData.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patching EmployeeData completed.")
