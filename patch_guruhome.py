with open('src/pages/dashboards/GuruHome.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('Dra Sri Wahyuni', 'Drs. Hendra, M.Pd')
content = content.replace('Dra. Sri Wahyuni', 'Drs. Hendra, M.Pd')
content = content.replace('Bahasa Indonesia', 'Pendidikan Pancasila')

with open('src/pages/dashboards/GuruHome.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patching GuruHome complete.")
