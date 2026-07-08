with open('src/pages/dashboards/JadwalMengajar.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('Dra. Sri Wahyuni', 'Drs. Hendra, M.Pd')
content = content.replace('Bahasa Indonesia', 'Pendidikan Pancasila')
content = content.replace('BAHASA INDONESIA', 'PENDIDIKAN PANCASILA')
content = content.replace('Sastra Indonesia', 'PKN Peminatan')
content = content.replace('SASTRA INDONESIA', 'PKN PEMINATAN')

with open('src/pages/dashboards/JadwalMengajar.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patching JadwalMengajar complete.")
