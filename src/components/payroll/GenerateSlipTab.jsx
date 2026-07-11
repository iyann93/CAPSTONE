import React, { useState, useEffect, useRef } from 'react';
import { generateSlip, getEmployees, bulkDeleteSlips } from '../../api/payroll';

const GenerateSlipTab = ({ triggerToast, onGeneratingChange, cancelRef }) => {
  const [bulan, setBulan] = useState(String(new Date().getMonth() + 1));
  const [tahun, setTahun] = useState(String(new Date().getFullYear()));
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const cancelledRef = useRef(false);
  const generatedIdsRef = useRef([]);
  const resolveCleanupRef = useRef(null);

  // Notify parent when generating state changes
  useEffect(() => {
    if (onGeneratingChange) onGeneratingChange(isGenerating);
  }, [isGenerating, onGeneratingChange]);

  // Expose a cancel function to parent via cancelRef
  useEffect(() => {
    if (cancelRef) {
      cancelRef.current = () => {
        return new Promise(resolve => {
          cancelledRef.current = true;
          resolveCleanupRef.current = resolve;
          setIsGenerating(false);
          setProgress(0);
          setLogs(prev => [...prev, { status: 'error', message: 'Membatalkan proses, harap tunggu...' }]);
        });
      };
    }
  }, [cancelRef]);

  const handleGenerateAll = async () => {
    cancelledRef.current = false;
    generatedIdsRef.current = [];
    setIsGenerating(true);
    setProgress(0);
    setLogs([{ status: 'info', message: 'Memulai proses generate slip gaji...' }]);

    try {
      // 1. Get all employees
      const employees = await getEmployees();
      
      if (employees.length === 0) {
        setLogs(prev => [...prev, { status: 'error', message: 'Tidak ada data pegawai yang ditemukan.' }]);
        setIsGenerating(false);
        return;
      }

      setLogs(prev => [...prev, { status: 'info', message: `Ditemukan ${employees.length} pegawai. Memproses...` }]);

      // 2. Generate sequentially or in chunks to avoid overwhelming the server
      let successCount = 0;
      let failCount = 0;
      const BATCH_SIZE = 10;

      for (let i = 0; i < employees.length; i += BATCH_SIZE) {
        // Check if cancelled
        if (cancelledRef.current) break;

        const batch = employees.slice(i, i + BATCH_SIZE);
        const promises = batch.map(async (emp) => {
          try {
            const res = await generateSlip({
              userId: emp.id,
              bulan: parseInt(bulan, 10),
              tahun: parseInt(tahun, 10),
              hariHadir: 20, 
              jumlahAlpha: 0,
              jamLembur: 0
            });
            return { success: true, id: res?.id, emp };
          } catch (err) {
            return { success: false, err, emp };
          }
        });

        const results = await Promise.all(promises);

        for (const r of results) {
          if (r.success) {
            if (r.id) generatedIdsRef.current.push(r.id);
            successCount++;
          } else {
            failCount++;
            const msg = r.err.response?.data?.message || r.err.message;
            const empName = r.emp.nama || r.emp.name || r.emp.nama_lengkap || 'Pegawai';
            setLogs(prev => [...prev, { status: 'error', message: `[ERROR] Gagal generate untuk ${empName}: ${msg}` }]);
          }
        }
        
        // Update progress
        setProgress(Math.round((Math.min(i + BATCH_SIZE, employees.length) / employees.length) * 100));
      }

      if (cancelledRef.current) {
        setLogs(prev => [...prev, { status: 'info', message: 'Proses dibatalkan. Melakukan pembersihan data (rollback)...' }]);
        if (generatedIdsRef.current.length > 0) {
          try {
            await bulkDeleteSlips(generatedIdsRef.current);
            setLogs(prev => [...prev, { status: 'info', message: `${generatedIdsRef.current.length} slip gaji yang terlanjur terbuat berhasil dihapus.` }]);
          } catch (e) {
            console.error('Gagal rollback:', e);
            setLogs(prev => [...prev, { status: 'error', message: 'Gagal menghapus slip gaji yang sempat terbuat.' }]);
          }
        }
        generatedIdsRef.current = [];
        if (resolveCleanupRef.current) resolveCleanupRef.current();
      } else {
        setLogs(prev => [...prev, { 
          status: 'info', 
          message: `Selesai! Berhasil: ${successCount}, Gagal/Sudah ada: ${failCount}` 
        }]);
        triggerToast("Proses generate slip gaji selesai!");
      }

    } catch (error) {
      console.error(error);
      setLogs(prev => [...prev, { status: 'error', message: `Gagal memulai proses: ${error.message}` }]);
      triggerToast("Terjadi kesalahan sistem", "error");
      if (resolveCleanupRef.current) resolveCleanupRef.current();
    } finally {
      setIsGenerating(false);
    }
  };

  const months = [
    { value: '1', label: 'Januari' }, { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' }, { value: '4', label: 'April' },
    { value: '5', label: 'Mei' }, { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' }, { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' }, { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
  ];

  const currentYear = new Date().getFullYear();
  const currentMonthNum = new Date().getMonth() + 1;
  const years = Array.from(new Array(5), (val, index) => String(currentYear - 2 + index));

  const isFutureSelected = Number(tahun) > currentYear || (Number(tahun) === currentYear && Number(bulan) > currentMonthNum);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800">Generate Slip Gaji</h2>
        <p className="text-sm text-gray-500">Buat slip gaji untuk seluruh pegawai berdasarkan template dan pengaturan override yang telah dikonfigurasi.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Pengaturan */}
        <div className="space-y-6 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Bulan</label>
              <select
                value={bulan}
                onChange={(e) => setBulan(e.target.value)}
                disabled={isGenerating}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 bg-white"
              >
                {months.map(m => {
                  const isFuture = Number(tahun) === currentYear && Number(m.value) > currentMonthNum;
                  return (
                    <option key={m.value} value={m.value} disabled={isFuture}>
                      {m.label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Tahun</label>
              <select
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                disabled={isGenerating}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 bg-white"
              >
                {years.map(y => {
                  const isFutureYear = Number(y) > currentYear;
                  return (
                    <option key={y} value={y} disabled={isFutureYear}>
                      {y}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
              Informasi Kalkulasi
            </h4>
            <ul className="text-xs text-blue-700 space-y-1.5 list-disc pl-4">
              <li>Sistem akan mengambil nominal dari <b>Template Gaji Jabatan</b>.</li>
              <li>Jika ada <b>Override Pegawai</b>, nominal akan diganti dengan yang spesifik.</li>
              <li>Slip yang sudah pernah digenerate pada bulan/tahun yang sama akan diabaikan (skip) kecuali dihapus terlebih dahulu.</li>
            </ul>
          </div>

          <button
            onClick={handleGenerateAll}
            disabled={isGenerating || isFutureSelected}
            className="w-full bg-[#1A3D63] hover:bg-[#122A44] text-white py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses ({progress}%)
              </>
            ) : (
              <>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                Generate Semua Slip
              </>
            )}
          </button>
        </div>

        {/* Console / Log Viewer */}
        <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden h-[400px]">
          <div className="bg-gray-800 p-3 flex flex-wrap justify-between items-center border-b border-gray-700">
            <span className="text-xs font-bold text-gray-300 font-mono">Proses Logs</span>
            {progress > 0 && <span className="text-xs font-bold text-blue-400 font-mono">{progress}%</span>}
          </div>
          <div className="bg-gray-900 flex-1 p-4 overflow-y-auto font-mono text-[11px] space-y-1.5">
            {logs.length === 0 ? (
              <div className="text-gray-500 text-center mt-10">Belum ada proses yang berjalan.</div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className={`${
                  log.status === 'error' ? 'text-red-400' :
                  log.status === 'success' ? 'text-green-400' : 'text-blue-300'
                }`}>
                  <span className="text-gray-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  {log.message}
                </div>
              ))
            )}
          </div>
          {/* Progress Bar under logs */}
          <div className="h-1.5 bg-gray-800 w-full">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateSlipTab;
