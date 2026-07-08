import re

with open('src/pages/dashboards/SystemSettings.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add useEffect import
content = content.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";')

# 2. Add state and handlers
state_code = '''
const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState("Profil Sekolah");
  
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("system_settings_data");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const handleChange = (label, val) => {
    setSettings(prev => ({ ...prev, [label]: val }));
  };

  const handleSave = () => {
    localStorage.setItem("system_settings_data", JSON.stringify(settings));
    alert("Perubahan konfigurasi sistem berhasil disimpan dan akan tetap ada walau pindah menu!");
  };

  const renderInputRow = (label, defaultValue) => (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-2">
      <label className="md:col-span-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
      <div className="md:col-span-9">
        <input
          type="text"
          value={settings[label] !== undefined ? settings[label] : defaultValue}
          onChange={(e) => handleChange(label, e.target.value)}
          className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:border-primary-500/30 transition-all"
        />
      </div>
    </div>
  );
'''

# Find the start of SystemSettings
start_idx = content.find('const SystemSettings = () => {')
end_idx = content.find('return <div className="animate-fadeIn space-y-6 pb-10">')

content = content[:start_idx] + state_code + '\n  ' + content[end_idx:]

# 3. Replace the save button onClick
content = content.replace('onClick={() => alert("Perubahan konfigurasi sistem berhasil disimpan!")}', 'onClick={handleSave}')

with open('src/pages/dashboards/SystemSettings.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched SystemSettings.jsx")
