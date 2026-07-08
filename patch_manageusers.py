import re

with open('src/pages/dashboards/ManageUsers.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update handleEditClick
edit_old = '''    setFormData({
      nama: user.name || '',
      email: user.email || '',
      password: '', // blank on edit
      roleId: roles.find(r => r.nama_role === user.role)?.id || '',
      siswaId: user.linked_siswa_id || '', // pre-fill dari relasi yang sudah ada
      isActive: user.is_active
    });'''
edit_new = '''    setFormData({
      nama: user.name || '',
      email: user.email || '',
      password: '', // blank on edit
      roleId: roles.find(r => r.nama_role === user.role)?.id || '',
      siswaId: user.linked_siswa_id || '', // pre-fill dari relasi yang sudah ada
      isActive: user.is_active,
      tanggal_lahir: user.tanggal_lahir || '',
      jenis_kelamin: user.jenis_kelamin || '',
      telepon: user.telepon || '',
      alamat: user.alamat || ''
    });'''
content = content.replace(edit_old, edit_new)

# 2. Update handleAddClick
add_old = "setFormData({ nama: '', email: '', password: '', roleId: '', siswaId: '', isActive: true });"
add_new = "setFormData({ nama: '', email: '', password: '', roleId: '', siswaId: '', isActive: true, tanggal_lahir: '', jenis_kelamin: '', telepon: '', alamat: '' });"
content = content.replace(add_old, add_new)

# 3. Add UI fields in Informasi Akun
ui_old = '''              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email / Username</label>
                <input
                  type="email"
                  placeholder="contoh: budi@sch.id"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-[#1A3D63] rounded-xl text-sm font-semibold text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-1 focus:ring-[#1A3D63]"
                />
              </div>'''

ui_new = '''              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email / Username</label>
                <input
                  type="email"
                  placeholder="contoh: budi@sch.id"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-[#1A3D63] rounded-xl text-sm font-semibold text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-1 focus:ring-[#1A3D63]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.tanggal_lahir}
                    onChange={(e) => setFormData({...formData, tanggal_lahir: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-[#1A3D63] rounded-xl text-sm font-semibold text-gray-800 outline-none transition-all focus:ring-1 focus:ring-[#1A3D63]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Jenis Kelamin</label>
                  <select
                    value={formData.jenis_kelamin}
                    onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})}
                    className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 focus:border-[#1A3D63] rounded-xl text-sm font-semibold text-gray-800 outline-none transition-all cursor-pointer focus:ring-1 focus:ring-[#1A3D63]"
                  >
                    <option value="" disabled>Pilih jenis kelamin...</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Telepon</label>
                  <input
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={formData.telepon}
                    onChange={(e) => setFormData({...formData, telepon: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-[#1A3D63] rounded-xl text-sm font-semibold text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-1 focus:ring-[#1A3D63]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Pribadi</label>
                  <input
                    type="text"
                    placeholder="Masukkan alamat lengkap..."
                    value={formData.alamat}
                    onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-[#1A3D63] rounded-xl text-sm font-semibold text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-1 focus:ring-[#1A3D63]"
                  />
                </div>
              </div>'''
content = content.replace(ui_old, ui_new)

with open('src/pages/dashboards/ManageUsers.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched ManageUsers.jsx")
