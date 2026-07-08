import os

files_to_fix = [
    'src/pages/dashboards/AbsensiSiswa.jsx',
    'src/pages/dashboards/CatatanSiswa.jsx',
    'src/pages/dashboards/InputNilai.jsx',
    'src/pages/dashboards/RekapAbsensiSiswa.jsx',
]

SKELETON = '''    <div className="p-6 md:p-8 space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-xl w-48"></div>
      <div className="h-4 bg-gray-100 rounded w-72"></div>
      <div className="bg-white rounded-3xl p-6 space-y-3 border border-gray-100">
        <div className="h-4 bg-gray-100 rounded w-full"></div>
        <div className="h-4 bg-gray-100 rounded w-3/4"></div>
        <div className="h-4 bg-gray-100 rounded w-5/6"></div>
      </div>
    </div>'''

for fpath in files_to_fix:
    if not os.path.exists(fpath):
        print(f'SKIP: {fpath}')
        continue
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace simple loading texts with skeleton
    old1 = '  if (loading) {\n    return <div className="p-8">Memuat data dari database...</div>;\n  }'
    old2 = '  if (loading) {\n    return <div className="p-8 font-bold text-gray-500">Memuat data siswa dari database...</div>;\n  }'
    
    new_block = f'  if (loading) {{\n    return (\n{SKELETON}\n    );\n  }}'
    
    content = content.replace(old1, new_block)
    content = content.replace(old2, new_block)
    
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'FIXED skeleton: {fpath}')

print('Done!')
