import React, { useState, useEffect } from 'react';
import { getJabatan, getTemplates, upsertTemplate, getKomponenGaji } from '../../api/payroll';

const TemplateGajiTab = ({ triggerToast }) => {
  const [jabatanList, setJabatanList] = useState([]);
  const [komponenList, setKomponenList] = useState([]);
  const [selectedJabatan, setSelectedJabatan] = useState('');
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedJabatan) {
      fetchTemplates(selectedJabatan);
    } else {
      setTemplates([]);
    }
  }, [selectedJabatan]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [jabatanData, komponenData] = await Promise.all([
        getJabatan(),
        getKomponenGaji(),
      ]);
      setJabatanList(jabatanData);
      setKomponenList(komponenData);
      if (jabatanData.length > 0) {
        setSelectedJabatan(jabatanData[0].id);
      }
    } catch (error) {
      console.error(error);
      triggerToast("Gagal memuat data awal", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async (jabatan_id) => {
    try {
      setLoading(true);
      const data = await getTemplates(jabatan_id);
      // Map API data back to our state format
      // We want all components listed, with nominal from template if it exists, else default 0
      const currentTemplates = komponenList.map((komp) => {
        // API returns komponen_gaji_id column from the DB join
        const found = data.find((t) => t.komponen_gaji_id === komp.id);
        return {
          komponen_id: komp.id,
          nama: komp.nama,
          kategori: komp.kategori,
          tipe: komp.tipe, // tunjangan atau potongan
          formula_tipe: komp.formula_tipe,
          nominal: found ? String(Math.round(Number(found.nominal))) : '0',
        };
      });
      setTemplates(currentTemplates);
    } catch (error) {
      console.error(error);
      triggerToast("Gagal memuat template gaji", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleNominalChange = (komponen_id, val) => {
    // Strip dots (thousand separator) and keep only digits
    const raw = String(val).replace(/\./g, '').replace(/[^0-9]/g, '');
    setTemplates((prev) =>
      prev.map((t) =>
        t.komponen_id === komponen_id ? { ...t, nominal: raw } : t
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
    if (!selectedJabatan) return;
    try {
      setIsSaving(true);
      // Construct payload for each template item
      // Note: we can use Promise.all or an array payload if the backend supports array.
      // Assuming upsertTemplate can be called individually or we adapt the backend.
      // Wait, backend upsertTemplate expects single object or array?
      // "const data = await PayrollService.upsertTemplate(req.body);"
      // Let's assume we loop and upsert each if the backend expects an array.
      // In the implementation I wrote earlier, the backend repo uses `INSERT ... ON CONFLICT ...` 
      // Let's send an array if backend handles it, or iterate here.
      // The backend repository logic for upsert usually expects a single row. Let's iterate.
      for (const t of templates) {
        await upsertTemplate({
          jabatan_id: selectedJabatan,
          komponen_id: t.komponen_id,
          nominal: Number(String(t.nominal).replace(/\./g, '')) || 0,
        });
      }
      triggerToast("Template gaji berhasil disimpan!");
      fetchTemplates(selectedJabatan);
    } catch (error) {
      console.error(error);
      triggerToast("Gagal menyimpan template gaji", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Template Gaji Jabatan</h2>
          <p className="text-sm text-gray-500">Atur standar nominal komponen gaji untuk setiap jabatan.</p>
        </div>
        <div className="w-full md:w-1/3">
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Pilih Jabatan</label>
          <select
            value={selectedJabatan}
            onChange={(e) => setSelectedJabatan(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] transition-all bg-white"
          >
            <option value="" disabled>-- Pilih Jabatan --</option>
            {jabatanList.map((jab) => (
              <option key={jab.id} value={jab.id}>{jab.nama}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3D63]"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nama Komponen</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tipe</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Formula</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Nominal (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {templates.map((t) => (
                <tr key={t.komponen_id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">{t.nama}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      t.tipe === 'tunjangan' ? 'bg-[#E6F4EA] text-[#059669]' : 'bg-[#FEE2E2] text-[#EF4444]'
                    }`}>
                      {t.tipe === 'tunjangan' ? 'Pendapatan' : 'Potongan'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-500 capitalize">{(t.formula_tipe || 'flat').replace(/_/g, ' ')}</td>
                  <td className="py-3 px-4 text-right">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formatRibuan(t.nominal)}
                      onChange={(e) => handleNominalChange(t.komponen_id, e.target.value)}
                      className="w-36 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] transition-all"
                    />
                  </td>
                </tr>
              ))}
              {templates.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-400 text-sm">Belum ada komponen gaji yang aktif.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving || !selectedJabatan}
          className="bg-[#1A3D63] hover:bg-[#122A44] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
        >
          {isSaving ? 'Menyimpan...' : 'Simpan Template'}
        </button>
      </div>
    </div>
  );
};

export default TemplateGajiTab;
