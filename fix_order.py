import re

with open('src/pages/dashboards/GenerateRaporWali.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update JS PDF generation
content = content.replace("i + 1, m.mapel, m.kkm, m.nilai", "i + 1, m.mapel, m.nilai, m.kkm")
content = content.replace("head: [['No', 'Mata Pelajaran', 'KKM', 'Nilai Akhir']],", "head: [['No', 'Mata Pelajaran', 'Nilai', 'KKM']],")

# 2. Update Print Preview HTML
old_preview_th = '''                            <th className="border border-gray-300 py-1.5 px-2 text-center w-16">KKM</th>
                            <th className="border border-gray-300 py-1.5 px-2 text-center w-24">Nilai Akhir</th>'''
new_preview_th = '''                            <th className="border border-gray-300 py-1.5 px-2 text-center w-16">Nilai</th>
                            <th className="border border-gray-300 py-1.5 px-2 text-center w-24">KKM</th>'''
content = content.replace(old_preview_th, new_preview_th)

old_preview_td = '''                              <td className="border border-gray-300 py-1.5 px-2 text-center font-bold text-gray-500">{m.kkm}</td>
                              <td className="border border-gray-300 py-1.5 px-2 text-center font-bold">{m.nilai}</td>'''
new_preview_td = '''                              <td className="border border-gray-300 py-1.5 px-2 text-center font-bold">{m.nilai}</td>
                              <td className="border border-gray-300 py-1.5 px-2 text-center font-bold text-gray-500">{m.kkm}</td>'''
content = content.replace(old_preview_td, new_preview_td)

# 3. Update UI Table
old_ui_th = '''                          <th className="py-2 px-2 text-center text-[11px] font-bold text-gray-500">KKM</th>
                          <th className="py-2 px-2 text-center text-[11px] font-bold text-gray-500">NILAI AKHIR</th>'''
new_ui_th = '''                          <th className="py-2 px-2 text-center text-[11px] font-bold text-gray-500">NILAI</th>
                          <th className="py-2 px-2 text-center text-[11px] font-bold text-gray-500">KKM</th>'''
content = content.replace(old_ui_th, new_ui_th)

old_ui_td = '''                              <td className="py-3 px-2 text-[12px] font-bold text-gray-600 text-center">
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold text-gray-600 border border-gray-200">{m.kkm}</span>
                              </td>
                              <td className="py-3 px-2 text-[13px] font-bold text-[#1F3A5F] text-center">{m.nilai}</td>'''
new_ui_td = '''                              <td className="py-3 px-2 text-[13px] font-bold text-[#1F3A5F] text-center">{m.nilai}</td>
                              <td className="py-3 px-2 text-[12px] font-bold text-gray-600 text-center">
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold text-gray-600 border border-gray-200">{m.kkm}</span>
                              </td>'''
content = content.replace(old_ui_td, new_ui_td)

with open('src/pages/dashboards/GenerateRaporWali.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patching completed.")
