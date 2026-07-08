with open('src/components/Sidebar.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if '{ label: "Rekap Absensi Siswa", icon: <BarChartIcon /> }' in line:
        continue
    new_lines.append(line)

# Clean up trailing comma from previous line if we removed the last item.
# Specifically, in the roles: ["Guru", "Guru Mapel"] block, Absensi Siswa has a comma at the end because Rekap Absensi Siswa followed it.
# Actually, JavaScript allows trailing commas, so it's fine.

with open('src/components/Sidebar.jsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Sidebar patched.")
