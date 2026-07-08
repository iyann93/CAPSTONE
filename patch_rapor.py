import re

with open('src/pages/dashboards/GenerateRaporWali.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update JS PDF generation
content = content.replace("doc.setFontSize(16);", '''doc.setFontSize(16);
          const logoImg = document.getElementById("logo-sekolah-pdf");
          if (logoImg) {
              doc.addImage(logoImg, "PNG", 14, 12, 24, 24);
          }''')
          
content = content.replace("i + 1, m.mapel, m.nilai, m.predikat", "i + 1, m.mapel, m.kkm, m.nilai")
content = content.replace("head: [['No', 'Mata Pelajaran', 'Nilai', 'Predikat']],", "head: [['No', 'Mata Pelajaran', 'KKM', 'Nilai Akhir']],")

# 2. Update Print Preview HTML
old_preview_header = '''                        <div className="text-center mb-6">
                          <h2 className="text-xl font-bold uppercase underline">Laporan Hasil Belajar (Rapor)</h2>
                          <p className="font-bold">SMP Muhammadiyah Prambanan</p>
                        </div>'''
new_preview_header = '''                        <div className="flex items-center justify-between border-b-2 border-gray-800 pb-4 mb-6">
                          <div className="w-20"><img src="/logo-mbs.png" alt="Logo" id="logo-sekolah-pdf" className="w-full h-auto" /></div>
                          <div className="text-center flex-1">
                            <h2 className="text-xl font-bold uppercase underline">Laporan Hasil Belajar (Rapor)</h2>
                            <p className="font-bold">SMP Muhammadiyah Prambanan</p>
                          </div>
                          <div className="w-20"></div>
                        </div>'''
content = content.replace(old_preview_header, new_preview_header)

old_preview_th = '''                              <th className="border border-gray-300 py-1.5 px-2 text-center w-16">Nilai</th>
                              <th className="border border-gray-300 py-1.5 px-2 text-center w-24">Predikat</th>'''
new_preview_th = '''                              <th className="border border-gray-300 py-1.5 px-2 text-center w-16">KKM</th>
                              <th className="border border-gray-300 py-1.5 px-2 text-center w-24">Nilai Akhir</th>'''
content = content.replace(old_preview_th, new_preview_th)

old_preview_td = '''                                <td className="border border-gray-300 py-1.5 px-2 text-center font-bold">{m.nilai}</td>
                                <td className="border border-gray-300 py-1.5 px-2 text-center">{m.predikat}</td>'''
new_preview_td = '''                                <td className="border border-gray-300 py-1.5 px-2 text-center font-bold text-gray-600">{m.kkm}</td>
                                <td className="border border-gray-300 py-1.5 px-2 text-center font-bold text-[#1F3A5F]">{m.nilai}</td>'''
content = content.replace(old_preview_td, new_preview_td)

# 3. Update UI Table
old_ui_th = '''                          <th className="py-2 px-2 text-center text-[11px] font-bold text-gray-500">AKHIR</th>
                          <th className="py-2 px-2 text-center text-[11px] font-bold text-gray-500">PREDIKAT</th>'''
new_ui_th = '''                          <th className="py-2 px-2 text-center text-[11px] font-bold text-gray-500">KKM</th>
                          <th className="py-2 px-2 text-center text-[11px] font-bold text-gray-500">NILAI AKHIR</th>'''
content = content.replace(old_ui_th, new_ui_th)

old_ui_td = '''                              <td className="py-3 px-2 text-[13px] font-bold text-[#1F3A5F] text-center">{m.nilai}</td>
                              <td className="py-3 px-2 text-center">
                                <span className={px-2 py-0.5 rounded text-[10px] font-bold }>
                                  {m.predikat}
                                </span>
                              </td>'''
new_ui_td = '''                              <td className="py-3 px-2 text-[12px] font-bold text-gray-600 text-center">
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold text-gray-600 border border-gray-200">{m.kkm}</span>
                              </td>
                              <td className="py-3 px-2 text-[13px] font-bold text-[#1F3A5F] text-center">{m.nilai}</td>'''
content = content.replace(old_ui_td, new_ui_td)

with open('src/pages/dashboards/GenerateRaporWali.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patching completed.")
