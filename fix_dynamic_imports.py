import os, re

target_dir = 'src/pages/dashboards'
files_to_fix = [
    'AbsensiSiswa.jsx',
    'CatatanSiswa.jsx',
    'GradePromotion.jsx',
    'GradePromotionCriteria.jsx',
    'GradePromotionDetail.jsx',
    'GraduationData.jsx',
    'InputNilai.jsx',
    'KepalaSekolahHome.jsx',
    'RekapAbsensiSiswa.jsx',
    'StudentAttendance.jsx',
    'StudentAttendanceInput.jsx',
]

DYNAMIC_IMPORT = "const { default: api } = await import('../../api/axios');"
STATIC_IMPORT = "import api from '../../api/axios';"

for fname in files_to_fix:
    fpath = os.path.join(target_dir, fname)
    if not os.path.exists(fpath):
        print(f'SKIP (not found): {fname}')
        continue

    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    if DYNAMIC_IMPORT not in content:
        print(f'SKIP (no dynamic import): {fname}')
        continue

    # Add static import if not already present
    if STATIC_IMPORT not in content:
        lines = content.split('\n')
        last_import_idx = 0
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                last_import_idx = i
        lines.insert(last_import_idx + 1, STATIC_IMPORT)
        content = '\n'.join(lines)

    # Remove all dynamic imports
    content = content.replace(DYNAMIC_IMPORT, '')

    # Clean up excessive blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f'FIXED: {fname}')

print('All done!')
