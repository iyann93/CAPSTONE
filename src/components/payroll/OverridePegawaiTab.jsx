import React, { useState, useEffect, useMemo } from 'react';
import { getOverrides, upsertOverride, getKomponenGaji, getEmployees } from '../../api/payroll';

const OverridePegawaiTab = ({ triggerToast }) => {
  const [users, setUsers] = useState([]);
  const [komponenList, setKomponenList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [overrides, setOverrides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchOverrides(selectedUserId);
    } else {
      setOverrides([]);
    }
  }, [selectedUserId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [employeeData, komponenData] = await Promise.all([
        getEmployees(),
        getKomponenGaji(),
      ]);
      setUsers(employeeData);
      setKomponenList(komponenData);
    } catch (error) {
      console.error(error);
      triggerToast("Gagal memuat data awal", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchOverrides = async (user_id) => {
    try {
      setLoading(true);
      const data = await getOverrides(user_id);
      const currentOverrides = komponenList.map((komp) => {
        // API returns komponen_gaji_id column from the DB join
        const found = data.find((o) => o.komponen_gaji_id === komp.id);
        return {
          komponen_id: komp.id,
          nama: komp.nama,
          kategori: komp.kategori,
          tipe: komp.tipe,
          nominal: found ? String(Math.round(Number(found.nominal))) : '', // Empty string means no override
        };
      });
      setOverrides(currentOverrides);
    } catch (error) {
      console.error(error);
      triggerToast("Gagal memuat data override", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleNominalChange = (komponen_id, val) => {
    // Strip dots (thousand separator) and keep only digits
    const raw = String(val).replace(/\./g, '').replace(/[^0-9]/g, '');
    setOverrides((prev) =>
      prev.map((o) =>
        o.komponen_id === komponen_id ? { ...o, nominal: raw } : o
      )
    );
  };

  // Format raw number string to Indonesian thousand format (50000 → 50.000)
  const formatRibuan = (val) => {
    if (val === '' || val === null || val === undefined) return '';
    const num = parseInt(String(val).replace(/\./g, ''), 10);
    if (isNaN(num)) return '';
    return num.toLocaleString('id-ID');
  };

  const handleSave = async () => {
    if (!selectedUserId) return;
    try {
      setIsSaving(true);
      // Save all overrides that have a non-empty nominal (including 0)
      const toSave = overrides.filter(o => o.nominal !== '');
      if (toSave.length === 0) {
        triggerToast("Tidak ada nominal yang diisi", "error");
        return;
      }
      await Promise.all(
        toSave.map(o =>
          upsertOverride({
            user_id: selectedUserId,
            komponen_id: o.komponen_id,
            nominal: Number(String(o.nominal).replace(/\./g, '')) || 0,
          })
        )
      );
      triggerToast("Override gaji berhasil disimpan!");
      fetchOverrides(selectedUserId);
    } catch (error) {
      console.error(error);
      triggerToast(`Gagal menyimpan: ${error.response?.data?.message || error.message}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.nama_jabatan?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">Pengaturan Gaji Pegawai (Override)</h2>
        <p className="text-sm text-gray-500">Buat pengecualian (override) nominal komponen gaji untuk pegawai tertentu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kolom Kiri: Daftar Pegawai */}
        <div className="col-span-1 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100">
            <input
              type="text"
              placeholder="Cari nama pegawai..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredUsers.map(u => (
              <button
                key={u.id}
                onClick={() => setSelectedUserId(u.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                  selectedUserId === u.id
                    ? 'bg-[#1A3D63] text-white shadow-md'
                    : 'hover:bg-white text-gray-700 hover:shadow-sm'
                }`}
              >
                <div className="font-bold text-sm truncate">{u.name || u.email}</div>
                <div className={`text-xs mt-0.5 truncate ${selectedUserId === u.id ? 'text-blue-200' : 'text-gray-400'}`}>
                  {u.role} {u.nama_jabatan ? `• ${u.nama_jabatan}` : ''}
                </div>
              </button>
            ))}
            {filteredUsers.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-400">Pegawai tidak ditemukan.</div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Form Override */}
        <div className="col-span-1 md:col-span-2">
          {!selectedUserId ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-gray-100 rounded-xl bg-gray-50/30">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
              </div>
              <h3 className="text-gray-800 font-bold mb-1">Pilih Pegawai</h3>
              <p className="text-gray-500 text-sm">Pilih pegawai di panel sebelah kiri untuk mengatur override komponen gaji.</p>
            </div>
          ) : loading ? (
            <div className="h-full flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3D63]"></div>
            </div>
          ) : (
            <div className="border border-gray-100 rounded-xl bg-white flex flex-col h-full">
              <div className="p-4 border-b border-gray-100 bg-blue-50/30">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Override Aktif untuk</div>
                <div className="text-lg font-bold text-gray-800">
                  {users.find(u => u.id === selectedUserId)?.name}
                </div>
              </div>
              
              <div className="p-4 flex-1 overflow-y-auto">
                <p className="text-xs text-gray-500 mb-4 bg-yellow-50 text-yellow-700 p-3 rounded-lg border border-yellow-100">
                  <span className="font-bold">Info:</span> Jika kolom nominal dikosongkan, maka sistem akan menggunakan nominal <b>Template Jabatan</b> sebagai default.
                </p>
                
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-2 px-2 text-[11px] font-bold text-gray-500 uppercase">Komponen</th>
                      <th className="py-2 px-2 text-[11px] font-bold text-gray-500 uppercase">Tipe</th>
                      <th className="py-2 px-2 text-[11px] font-bold text-gray-500 uppercase text-right">Nominal Override (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {overrides.map((o) => (
                      <tr key={o.komponen_id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-2 text-sm font-medium text-gray-800">{o.nama}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.tipe === 'tunjangan' ? 'bg-[#E6F4EA] text-[#059669]' : 'bg-[#FEE2E2] text-[#EF4444]'
                          }`}>
                            {o.tipe === 'tunjangan' ? 'Pendapatan' : 'Potongan'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="Gunakan Default"
                            value={formatRibuan(o.nominal)}
                            onChange={(e) => handleNominalChange(o.komponen_id, e.target.value)}
                            className="w-full md:w-44 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] transition-all placeholder:text-gray-300"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-[#1A3D63] hover:bg-[#122A44] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Override'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverridePegawaiTab;
