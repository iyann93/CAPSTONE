with open('src/pages/dashboards/RekapAbsensiSiswa.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('const RekapAbsensiSiswa = ({ user, attendanceSessions = [] }) => {', 'const RekapAbsensiSiswa = ({ user, attendanceSessions = [], isEmbedded = false }) => {')
content = content.replace('className="p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F8FAFC] min-h-screen relative"', 'className={isEmbedded ? "space-y-6 animate-fadeIn" : "p-6 md:p-8 space-y-6 animate-fadeIn bg-[#F8FAFC] min-h-screen relative"}')

with open('src/pages/dashboards/RekapAbsensiSiswa.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patching RekapAbsensiSiswa complete.")
