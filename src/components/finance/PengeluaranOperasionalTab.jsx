import React, { useState, useEffect } from 'react';
import { getOperasional, createOperasional, deleteMultipleOperasional } from '../../api/finance';

// Icons
const IconChevronDown = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const IconSearch = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const IconPlus = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const IconTrash = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const IconEye = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconX = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconUpload = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

// No mock data needed

// Helper untuk membuat item form kosong
const emptyItem = () => ({
  id: Date.now() + Math.random(),
  tanggal: "",
  kategori: "",
  nama: "",
  nominal: "",
  sumberDana: "",
  keterangan: "",
  uploadedFiles: [],
  fileUploadError: ""
});

const PengeluaranOperasionalTab = ({ triggerToast, danaBeasiswaList = [], beasiswaList = [], sppPayments = [] }) => {
  const [activeTab, setActiveTab] = useState("pemasukan"); // 'pemasukan' atau 'pengeluaran'
  const [selectedYear, setSelectedYear] = useState("2025/2026");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua Kategori");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Multi-item Form State
  const [formItems, setFormItems] = useState([emptyItem()]);
  
  // Local Data State
  const [localPemasukanData, setLocalPemasukanData] = useState([]);
  const [localPengeluaranData, setLocalPengeluaranData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadOperasionalData = async () => {
    setIsLoading(true);
    try {
      const data = await getOperasional();
      if (Array.isArray(data)) {
        setLocalPemasukanData(data.filter(d => d.tipe === 'pemasukan'));
        setLocalPengeluaranData(data.filter(d => d.tipe === 'pengeluaran'));
      }
    } catch (err) {
      console.error("Gagal memuat data operasional:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOperasionalData();
  }, []);
  // Table Selection & Modals State
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedPreviewFile, setSelectedPreviewFile] = useState(null);

  const formatTanggal = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(filteredData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMultipleOperasional(selectedItems);
      triggerToast ? triggerToast(`${selectedItems.length} data berhasil dihapus!`, "success") : alert(`${selectedItems.length} data berhasil dihapus!`);
      setShowDeleteConfirm(false);
      setSelectedItems([]);
      loadOperasionalData();
    } catch (err) {
      triggerToast ? triggerToast("Gagal menghapus data", "error") : alert("Gagal menghapus data");
    }
  };

  const handleItemChange = (itemId, field, value) => {
    setFormItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    ));
    setIsDirty(true);
  };

  const handleAddItem = () => {
    setFormItems(prev => [...prev, emptyItem()]);
    setIsDirty(true);
  };

  const handleRemoveItem = (itemId) => {
    setFormItems(prev => prev.length > 1 ? prev.filter(item => item.id !== itemId) : prev);
    setIsDirty(true);
  };

  const handleItemFileChange = (itemId, files) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    let fileUploadError = "";
    const validFiles = [];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        fileUploadError = "Format file tidak didukung! Harap upload file JPG, PNG, atau PDF.";
        continue;
      }
      if (file.size > 2 * 1024 * 1024) {
        fileUploadError = "Ukuran file terlalu besar! Maksimal 2 MB.";
        continue;
      }
      if (file.type.includes('image')) {
        file.preview = URL.createObjectURL(file);
      }
      validFiles.push(file);
    }
    setFormItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, uploadedFiles: [...item.uploadedFiles, ...validFiles], fileUploadError }
        : item
    ));
    setIsDirty(true);
  };

  const handleRemoveItemFile = (itemId, fileIdx) => {
    setFormItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, uploadedFiles: item.uploadedFiles.filter((_, i) => i !== fileIdx) }
        : item
    ));
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelConfirm(true);
    } else {
      setShowAddModal(false);
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    setShowAddModal(false);
    setFormItems([emptyItem()]);
    setIsDirty(false);
  };

  const handleSave = async () => {
    // Validasi semua item
    for (let i = 0; i < formItems.length; i++) {
      const item = formItems[i];
      if (!item.tanggal || !item.kategori || !item.nama || !item.nominal || !item.sumberDana) {
        triggerToast
          ? triggerToast(`Item ke-${i + 1}: Mohon isi semua kolom yang wajib (*)`, "error")
          : alert(`Item ke-${i + 1}: Mohon isi semua kolom yang wajib (*)`);
        return;
      }
      if (item.uploadedFiles.length === 0) {
        setFormItems(prev => prev.map((fi, idx) =>
          idx === i ? { ...fi, fileUploadError: "Harap unggah bukti transaksi sebelum menyimpan!" } : fi
        ));
        return;
      }
    }

    setIsSaving(true);
    try {
      // Simpan semua item satu per satu
      for (const item of formItems) {
        const buktiArray = await Promise.all(item.uploadedFiles.map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
          });
        }));

        const payload = {
          tipe: activeTab,
          tanggal: item.tanggal,
          nama: item.nama,
          kategori: item.kategori,
          nominal: Number(String(item.nominal).replace(/[^0-9]/g, '')),
          sumber_dana: item.sumberDana,
          keterangan: item.keterangan,
          bukti: buktiArray
        };
        await createOperasional(payload);
      }

      setIsSaving(false);
      setShowAddModal(false);
      setFormItems([emptyItem()]);
      setIsDirty(false);
      const jumlah = formItems.length;
      const tipe = activeTab === "pemasukan" ? "pemasukan" : "pengeluaran";
      const msg = jumlah > 1
        ? `${jumlah} data ${tipe} berhasil disimpan!`
        : `Data ${tipe} berhasil disimpan!`;
      triggerToast ? triggerToast(msg, "success") : alert(msg);
      loadOperasionalData();
    } catch (err) {
      setIsSaving(false);
      triggerToast ? triggerToast("Gagal menyimpan data", "error") : alert("Gagal menyimpan data");
    }
  };

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const currentMonth = monthNames[new Date().getMonth()];
  const currentData = activeTab === "pengeluaran" ? localPengeluaranData : localPemasukanData;
  const currentBeasiswa = activeTab === "pengeluaran" ? beasiswaList : danaBeasiswaList;
  
  const isCurrentMonthAndYear = (dateStr) => {
    if (!dateStr) return false;
    const now = new Date();
    const currentMonthNum = now.getMonth();
    const currentYearNum = now.getFullYear();

    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.getMonth() === currentMonthNum && d.getFullYear() === currentYearNum;
    }
    
    // Fallback if format is "10 Juni 2025"
    const parts = dateStr.split(' ');
    if (parts.length === 3) {
      const m = monthNames.indexOf(parts[1]);
      if (m === currentMonthNum && parseInt(parts[2]) === currentYearNum) return true;
    }
    return false;
  };

  const totalBulanIniSpp = sppPayments.filter(item => isCurrentMonthAndYear(item.tanggal_bayar || item.updatedAt || item.createdAt))
    .reduce((acc, curr) => acc + (Number(String(curr.amount).replace(/[^0-9]/g, '')) || 0), 0);
  const totalSppTahunan = sppPayments.reduce((acc, curr) => acc + (Number(String(curr.amount).replace(/[^0-9]/g, '')) || 0), 0);

  const totalBulanIni = currentData
    .filter(item => isCurrentMonthAndYear(item.tanggal))
    .reduce((acc, curr) => acc + Number(curr.nominal), 0) + 
    currentBeasiswa.filter(item => isCurrentMonthAndYear(item.tanggal || item.tanggal_mulai))
    .reduce((acc, curr) => acc + Number(curr.nominal), 0) +
    (activeTab === "pemasukan" ? totalBulanIniSpp : 0);
    
  const totalKeseluruhan = currentData.reduce((acc, curr) => acc + Number(curr.nominal), 0) + currentBeasiswa.reduce((acc, curr) => acc + Number(curr.nominal), 0) + (activeTab === "pemasukan" ? totalSppTahunan : 0);
  const totalOperasionalSaja = currentData.reduce((acc, curr) => acc + Number(curr.nominal), 0);

  const card1Title = activeTab === "pemasukan" ? "Pemasukan Bulan Ini" : "Total Pengeluaran Tahunan";
  const card1Value = activeTab === "pemasukan" ? totalBulanIni : totalKeseluruhan;

  const card2Title = activeTab === "pemasukan" ? "Total Pemasukan Tahunan" : "Total Operasional Tahunan";
  const card2Value = activeTab === "pemasukan" ? totalKeseluruhan : totalOperasionalSaja;
  const jumlahKategori = new Set(currentData.map(item => item.kategori)).size;

  // Aggregate SPP payments by month into summary rows
  const sppByMonth = {};
  sppPayments.forEach(p => {
    const dateStr = p.tanggal_bayar || p.updatedAt || p.createdAt || '';
    const d = dateStr ? new Date(dateStr) : null;
    const monthKey = d && !isNaN(d)
      ? `${monthNames[d.getMonth()]} ${d.getFullYear()}`
      : (p.period || 'Lainnya');
    const nom = Number(String(p.amount || '0').replace(/[^0-9]/g, ''));
    if (!sppByMonth[monthKey]) {
      sppByMonth[monthKey] = { total: 0, count: 0, tanggal: dateStr };
    }
    sppByMonth[monthKey].total += nom;
    sppByMonth[monthKey].count += 1;
  });

  const sppRows = Object.entries(sppByMonth).map(([monthKey, val]) => ({
    id: `spp-${monthKey}`,
    _type: 'spp',
    tanggal: val.tanggal,
    nama: `Total Pemasukan SPP - ${monthKey}`,
    kategori: 'SPP',
    nominal: val.total,
    keterangan: `${val.count} siswa lunas`,
    sumberDana: 'SPP Siswa',
  }));

  const filteredData = [
    ...currentData.filter(item => {
      const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "Semua Kategori" || item.kategori === categoryFilter;
      return matchesSearch && matchesCategory;
    }),
    ...(activeTab === "pemasukan" ? sppRows.filter(item => {
      const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "Semua Kategori" || item.kategori === categoryFilter;
      return matchesSearch && matchesCategory;
    }) : [])
  ].sort((a, b) => {
    const dateA = new Date(a.tanggal || 0).getTime();
    const dateB = new Date(b.tanggal || 0).getTime();
    return dateB - dateA;
  });

  return (
    <div className="flex flex-col gap-6 animate-fadeIn font-sans">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-[26px] font-bold text-gray-800 tracking-tight">Pemasukan dan Pengeluaran</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola pencatatan arus kas Pemasukan & Pengeluaran sekolah.</p>
          <div className="flex gap-2 mt-4 bg-gray-100 p-1 rounded-xl inline-flex">
            <button 
              onClick={() => {setActiveTab("pemasukan"); setCategoryFilter("Semua Kategori"); setSearchQuery("");}}
              className={`px-5 py-2 text-sm font-bold rounded-lg transition-all border-none cursor-pointer ${activeTab === 'pemasukan' ? 'bg-white text-[#1A3D63] shadow-sm' : 'bg-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Pemasukan
            </button>
            <button 
              onClick={() => {setActiveTab("pengeluaran"); setCategoryFilter("Semua Kategori"); setSearchQuery("");}}
              className={`px-5 py-2 text-sm font-bold rounded-lg transition-all border-none cursor-pointer ${activeTab === 'pengeluaran' ? 'bg-white text-[#1A3D63] shadow-sm' : 'bg-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Pengeluaran
            </button>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
          <div className="relative group w-full sm:w-auto">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#1A3D63] transition-colors">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" /></svg>
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full flex items-center gap-2 bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-[13px] font-bold text-gray-700 cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all"
            >
              <option value="2025/2026">Tahun Ajaran: 2025/2026</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#1A3D63] transition-colors">
              <IconChevronDown />
            </div>
          </div>
          <button
            onClick={() => { setFormItems([emptyItem()]); setIsDirty(false); setShowAddModal(true); }}
            className="flex items-center gap-2 justify-center bg-[#1A3D63] hover:bg-[#122A44] text-white border-none rounded-xl px-5 py-2.5 text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-sm w-full sm:w-auto"
          >
            <IconPlus />
            {activeTab === "pemasukan" ? "Tambah Pemasukan" : "Tambah Pengeluaran"}
          </button>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Card 1 */}
        <div className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
          <div>
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">{card1Title}</div>
            <div className="text-3xl font-black text-white">Rp {card1Value.toLocaleString('id-ID')}</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#1A3D63] rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
          <div>
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">{card2Title}</div>
            <div className="text-3xl font-black text-white">Rp {card2Value.toLocaleString('id-ID')}</div>
          </div>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">
            {activeTab === "pemasukan" ? "Riwayat Pemasukan Dana" : "Riwayat Pengeluaran Operasional"}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {activeTab === "pemasukan" 
              ? "Daftar seluruh riwayat pemasukan dana." 
              : "Daftar seluruh riwayat pengeluaran operasional."}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === "pemasukan" ? "Cari nama pemasukan..." : "Cari nama pengeluaran..."}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#1A3D63] font-medium"
            />
            <span className="absolute left-3.5 top-3.5 text-gray-400">
              <IconSearch />
            </span>
          </div>

          {/* Category Dropdown & Delete Button */}
          <div className="flex items-center gap-3">
            {selectedItems.length > 0 && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors shadow-sm cursor-pointer"
              >
                <IconTrash />
                Hapus ({selectedItems.length})
              </button>
            )}
            <div className="relative group min-w-[180px]">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full flex items-center gap-2 bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-xs sm:text-[13px] font-bold text-gray-700 cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all"
              >
                <option value="Semua Kategori">Semua Kategori</option>
                {activeTab === "pemasukan" ? (
                  <>
                    <option value="Dana BOS">Dana BOS</option>
                    <option value="Donasi">Donasi</option>
                    <option value="Hibah/Bantuan">Hibah/Bantuan</option>
                    <option value="SPP">SPP</option>
                    <option value="Lainnya">Lainnya</option>
                  </>
                ) : (
                  <>
                    <option value="Listrik">Listrik</option>
                    <option value="Air">Air</option>
                    <option value="Internet">Internet</option>
                    <option value="ATK">ATK</option>
                    <option value="Kebersihan">Kebersihan</option>
                    <option value="Perawatan Gedung">Perawatan Gedung</option>
                    <option value="Peralatan Sekolah">Peralatan Sekolah</option>
                    <option value="Transportasi">Transportasi</option>
                    <option value="Kegiatan Sekolah">Kegiatan Sekolah</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </>
                )}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#1A3D63] transition-colors">
                <IconChevronDown />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto max-h-[500px] custom-scrollbar rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider shadow-sm">
                <th className="py-4 px-4 w-12 text-center rounded-tl-xl bg-gray-50">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedItems.length > 0 && selectedItems.length === filteredData.length}
                    className="w-4 h-4 text-[#1A3D63] rounded border-gray-300 focus:ring-[#1A3D63] cursor-pointer"
                  />
                </th>
                <th className="py-4 px-4 w-12 text-center bg-gray-50">NO</th>
                <th className="py-4 px-4 bg-gray-50">TANGGAL</th>
                <th className="py-4 px-4 bg-gray-50">{activeTab === "pemasukan" ? "NAMA PEMASUKAN" : "NAMA PENGELUARAN"}</th>
                <th className="py-4 px-4 bg-gray-50">KATEGORI</th>
                <th className="py-4 px-4 bg-gray-50">NOMINAL</th>
                <th className="py-4 px-4 text-center rounded-tr-xl bg-gray-50">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400 font-medium">{activeTab === "pemasukan" ? "Data pemasukan tidak ditemukan." : "Data pengeluaran tidak ditemukan."}</td>
                </tr>
              ) : (
                filteredData.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 text-center">
                      {row._type === 'spp' ? (
                        <span className="text-gray-300 text-xs">—</span>
                      ) : (
                        <input 
                          type="checkbox" 
                          checked={selectedItems.includes(row.id)}
                          onChange={() => handleSelectItem(row.id)}
                          className="w-4 h-4 text-[#1A3D63] rounded border-gray-300 focus:ring-[#1A3D63] cursor-pointer"
                        />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center text-gray-500 font-bold">{idx + 1}.</td>
                    <td className="py-4 px-4 font-medium text-gray-600">{formatTanggal(row.tanggal)}</td>
                    <td className="py-4 px-4 font-bold text-gray-800">{row.nama}</td>
                    <td className="py-4 px-4">
                      {row._type === 'spp' ? (
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-semibold text-[10px]">SPP</span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg font-semibold text-[10px]">{row.kategori}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-600">Rp {Number(row.nominal || 0).toLocaleString('id-ID')}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedDetailItem(row)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold rounded-lg transition-colors cursor-pointer border-none shadow-sm"
                          title="Detail"
                        >
                          <IconEye />
                          Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {filteredData.length > 0 && (
          <div className="mt-4 px-2">
            <span className="text-[11px] font-semibold text-gray-500">
              Total {filteredData.length} data {activeTab}
            </span>
          </div>
        )}
      </div>
      
      {/* Container History Beasiswa khusus di tab Pemasukan */}
      {activeTab === "pemasukan" && (
        <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-sm mt-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800 tracking-tight">Riwayat Penerimaan Dana Beasiswa</h2>
              <p className="text-xs text-gray-500 mt-1">Data dikelola otomatis dari modul Kelola Dana Beasiswa.</p>
            </div>
          </div>
          
          <div className="overflow-x-auto overflow-y-auto max-h-[300px] custom-scrollbar rounded-xl border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider shadow-sm">
                  <th className="py-4 px-4 w-12 text-center rounded-tl-xl bg-gray-50">NO</th>
                  <th className="py-4 px-4 bg-gray-50">TANGGAL</th>
                  <th className="py-4 px-4 bg-gray-50">NAMA PEMASUKAN</th>
                  <th className="py-4 px-4 bg-gray-50">KATEGORI</th>
                  <th className="py-4 px-4 bg-gray-50">NOMINAL</th>
                  <th className="py-4 px-4 text-center rounded-tr-xl bg-gray-50">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {danaBeasiswaList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400 font-medium">Data beasiswa tidak ditemukan.</td>
                  </tr>
                ) : (
                  danaBeasiswaList.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-4 text-center text-gray-500 font-bold">{idx + 1}.</td>
                      <td className="py-4 px-4 font-medium text-gray-600">{formatTanggal(row.tanggal)}</td>
                      <td className="py-4 px-4 font-bold text-gray-800">Penerimaan Dana Beasiswa {row.sumber}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg font-semibold text-[10px]">Beasiswa</span>
                      </td>
                      <td className="py-4 px-4 font-bold text-emerald-600">Rp {Number(row.nominal).toLocaleString('id-ID')}</td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedDetailItem({...row, nama: `Penerimaan Dana Beasiswa ${row.sumber}`, kategori: 'Beasiswa', sumberDana: row.sumber})}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold rounded-lg transition-colors cursor-pointer border-none shadow-sm"
                            title="Detail"
                          >
                            <IconEye />
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 px-2">
            <span className="text-[11px] font-semibold text-gray-500">
              Total {danaBeasiswaList.length} data beasiswa
            </span>
          </div>
        </div>
      )}

      {/* Container Penyaluran Beasiswa khusus di tab Pengeluaran */}
      {activeTab === "pengeluaran" && (
        <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-sm mt-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800 tracking-tight">Riwayat Penyaluran Beasiswa</h2>
              <p className="text-xs text-gray-500 mt-1">Data dikelola otomatis dari modul Daftar Penerima Beasiswa.</p>
            </div>
          </div>
          
          <div className="overflow-x-auto overflow-y-auto max-h-[300px] custom-scrollbar rounded-xl border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider shadow-sm">
                  <th className="py-4 px-4 w-12 text-center rounded-tl-xl bg-gray-50">NO</th>
                  <th className="py-4 px-4 bg-gray-50">TANGGAL</th>
                  <th className="py-4 px-4 bg-gray-50">NAMA PENGELUARAN</th>
                  <th className="py-4 px-4 bg-gray-50">KATEGORI</th>
                  <th className="py-4 px-4 bg-gray-50">NOMINAL</th>
                  <th className="py-4 px-4 text-center rounded-tr-xl bg-gray-50">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {beasiswaList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400 font-medium">Data penyaluran beasiswa tidak ditemukan.</td>
                  </tr>
                ) : (
                  beasiswaList.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-4 text-center text-gray-500 font-bold">{idx + 1}.</td>
                      <td className="py-4 px-4 font-medium text-gray-600">{formatTanggal(row.tanggal)}</td>
                      <td className="py-4 px-4 font-bold text-gray-800">{row.nama}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg font-semibold text-[10px]">Beasiswa</span>
                      </td>
                      <td className="py-4 px-4 font-bold text-emerald-600">Rp {Number(row.nominal).toLocaleString('id-ID')}</td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedDetailItem({...row, nama: row.nama, kategori: 'Beasiswa', sumberDana: row.sumber, tanggal: row.tanggal})}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold rounded-lg transition-colors cursor-pointer border-none shadow-sm"
                            title="Detail"
                          >
                            <IconEye />
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 px-2">
            <span className="text-[11px] font-semibold text-gray-500">
              Total {beasiswaList.length} data beasiswa
            </span>
          </div>
        </div>
      )}

      {/* Modal Tambah Pengeluaran / Pemasukan - Multi-item */}
      {showAddModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header Modal */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{activeTab === "pemasukan" ? "Tambah Pemasukan" : "Tambah Pengeluaran"}</h2>
                <p className="text-[11px] text-gray-500 mt-1">
                  {activeTab === "pemasukan"
                    ? `Catat ${formItems.length > 1 ? `${formItems.length} transaksi` : 'transaksi'} pemasukan dana sekolah.`
                    : `Catat ${formItems.length > 1 ? `${formItems.length} transaksi` : 'transaksi'} pengeluaran operasional sekolah.`}
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-xl transition-colors border-none cursor-pointer"
              >
                <IconX />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-5">
              {formItems.map((item, itemIndex) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-2xl p-4 relative bg-gray-50/40"
                  style={{ borderLeft: '4px solid #1A3D63' }}
                >
                  {/* Item Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#1A3D63] bg-blue-50 px-3 py-1 rounded-full">
                      {activeTab === "pemasukan" ? "Pemasukan" : "Pengeluaran"} #{itemIndex + 1}
                    </span>
                    {formItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl p-1.5 cursor-pointer transition-colors"
                        title="Hapus item ini"
                      >
                        <IconX />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Row 1: Tanggal + Kategori */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          {activeTab === "pemasukan" ? "Tanggal Pemasukan" : "Tanggal Pengeluaran"} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={item.tanggal}
                          onChange={(e) => handleItemChange(item.id, 'tanggal', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] font-medium text-gray-700 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          {activeTab === "pemasukan" ? "Kategori Pemasukan" : "Kategori Pengeluaran"} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={item.kategori}
                            onChange={(e) => handleItemChange(item.id, 'kategori', e.target.value)}
                            className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] appearance-none font-medium text-gray-700 bg-white"
                          >
                            <option value="">Pilih kategori...</option>
                            {activeTab === "pemasukan" ? (
                              <>
                                <option value="Dana BOS">Dana BOS</option>
                                <option value="Donasi">Donasi</option>
                                <option value="Hibah/Bantuan">Hibah/Bantuan</option>
                                <option value="Lainnya">Lainnya</option>
                              </>
                            ) : (
                              <>
                                <option value="Listrik">Listrik</option>
                                <option value="Air">Air</option>
                                <option value="Internet">Internet</option>
                                <option value="ATK">ATK</option>
                                <option value="Kebersihan">Kebersihan</option>
                                <option value="Perawatan Gedung">Perawatan Gedung</option>
                                <option value="Peralatan Sekolah">Peralatan Sekolah</option>
                                <option value="Transportasi">Transportasi</option>
                                <option value="Kegiatan Sekolah">Kegiatan Sekolah</option>
                                <option value="Lain-lain">Lain-lain</option>
                              </>
                            )}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <IconChevronDown />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Nama */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        {activeTab === "pemasukan" ? "Nama Pemasukan" : "Nama Pengeluaran"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={item.nama}
                        onChange={(e) => handleItemChange(item.id, 'nama', e.target.value)}
                        placeholder={activeTab === "pemasukan" ? "Misal: Penerimaan BOS Tahap 1" : "Misal: Pembayaran Listrik Bulan Juni"}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] font-medium text-gray-700 placeholder-gray-400 bg-white"
                      />
                    </div>

                    {/* Row 3: Nominal + Sumber Dana */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          {activeTab === "pemasukan" ? "Nominal Pemasukan" : "Nominal Pengeluaran"} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 font-bold text-xs">Rp</span>
                          </div>
                          <input
                            type="text"
                            value={item.nominal}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              handleItemChange(item.id, 'nominal', val ? new Intl.NumberFormat('id-ID').format(val) : '');
                            }}
                            placeholder="0"
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] font-medium text-gray-700 bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Sumber Dana <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={item.sumberDana}
                            onChange={(e) => handleItemChange(item.id, 'sumberDana', e.target.value)}
                            className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] appearance-none font-medium text-gray-700 bg-white"
                          >
                            <option value="">Pilih sumber...</option>
                            {activeTab === "pemasukan" ? (
                              <>
                                <option value="Pemerintah Pusat">Pemerintah Pusat</option>
                                <option value="Donatur">Donatur</option>
                                <option value="Yayasan">Yayasan</option>
                                <option value="Lainnya">Lainnya</option>
                              </>
                            ) : (
                              <>
                                <option value="Dana BOS">Dana BOS</option>
                                <option value="Dana Donatur">Dana Donatur</option>
                                <option value="Lainnya">Lainnya</option>
                              </>
                            )}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <IconChevronDown />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Row 4: Upload Bukti */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Upload Bukti Transaksi <span className="text-red-500">*</span>
                      </label>
                      <label className="border-2 border-dashed border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all text-center bg-white">
                        <div className="text-gray-400 mb-1">
                          <IconUpload />
                        </div>
                        <span className="text-[11px] font-bold text-[#1A3D63]">Klik untuk upload file</span>
                        <span className="text-[10px] text-gray-400 mt-0.5">Maks. 2MB per file (JPG, PNG, PDF)</span>
                        <input
                          type="file"
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.pdf"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            if (files.length > 0) {
                              handleItemFileChange(item.id, files);
                            }
                            e.target.value = '';
                          }}
                        />
                      </label>
                      {item.fileUploadError && (
                        <p className="mt-1.5 text-[11px] text-red-600 font-medium">{item.fileUploadError}</p>
                      )}
                      {item.uploadedFiles.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {item.uploadedFiles.map((file, fIdx) => (
                            <div key={fIdx} className="flex items-center justify-between bg-white border border-gray-200 p-2.5 rounded-xl hover:border-blue-300 transition-colors">
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <div
                                  className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 overflow-hidden cursor-pointer border border-blue-100 hover:opacity-80 transition-opacity"
                                  onClick={() => { setSelectedPreviewFile(file); setShowPreviewModal(true); }}
                                  title="Klik untuk melihat pratinjau"
                                >
                                  {file.type?.includes('image') && file.preview ? (
                                    <img src={file.preview} alt="Thumb" className="w-full h-full object-cover rounded-lg" />
                                  ) : (
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                    </svg>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[11px] font-bold text-gray-700 truncate">{file.name}</p>
                                  <p className="text-[10px] text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveItemFile(item.id, fIdx)}
                                className="text-red-400 hover:text-red-600 bg-red-50 border border-red-100 cursor-pointer p-1 rounded-lg hover:bg-red-100 transition-colors shrink-0"
                                title="Hapus File"
                              >
                                <IconX />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Row 5: Keterangan */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Keterangan (Opsional)</label>
                      <textarea
                        rows="2"
                        value={item.keterangan}
                        onChange={(e) => handleItemChange(item.id, 'keterangan', e.target.value)}
                        placeholder="Catatan tambahan..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] font-medium text-gray-700 placeholder-gray-400 bg-white"
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}

              {/* Tombol Tambah Item */}
              <button
                type="button"
                onClick={handleAddItem}
                className="w-full py-3 border-2 border-dashed border-[#1A3D63]/30 rounded-2xl text-xs font-bold text-[#1A3D63] hover:bg-blue-50 hover:border-[#1A3D63]/60 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <IconPlus />
                Tambah {activeTab === "pemasukan" ? "Pemasukan" : "Pengeluaran"} Lainnya
              </button>
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-gray-50/50 shrink-0">
              <span className="text-[11px] text-gray-500 font-medium">
                {formItems.length} item {activeTab === "pemasukan" ? "pemasukan" : "pengeluaran"} akan disimpan
              </span>
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#1A3D63] text-white rounded-xl text-xs font-bold hover:bg-[#122A44] transition-colors shadow-sm cursor-pointer border-none disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Menyimpan...
                    </>
                  ) : (
                    formItems.length > 1
                      ? `Simpan ${formItems.length} ${activeTab === "pemasukan" ? "Pemasukan" : "Pengeluaran"}`
                      : (activeTab === "pemasukan" ? "Simpan Pemasukan" : "Simpan Pengeluaran")
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Batal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col text-center">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Batalkan Pengisian?</h3>
              <p className="text-sm text-gray-500">Data yang sudah Anda masukkan akan hilang dan tidak dapat dikembalikan.</p>
            </div>
            <div className="p-4 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Kembali Mengisi
              </button>
              <button 
                onClick={handleConfirmCancel}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors cursor-pointer border-none shadow-sm"
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Pengeluaran */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{activeTab === "pemasukan" ? "Detail Pemasukan" : "Detail Pengeluaran"}</h2>
                <p className="text-[11px] text-gray-500 mt-1">Informasi lengkap transaksi arus kas.</p>
              </div>
              <button 
                onClick={() => setSelectedDetailItem(null)}
                className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-2 rounded-xl transition-colors border border-gray-200 cursor-pointer"
              >
                <IconX />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Tanggal</div>
                  <div className="text-sm font-semibold text-gray-800">{formatTanggal(selectedDetailItem.tanggal)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Kategori</div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs">{selectedDetailItem.kategori}</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">{activeTab === "pemasukan" ? "Nama Pemasukan" : "Nama Pengeluaran"}</div>
                <div className="text-sm font-bold text-gray-800">{selectedDetailItem.nama}</div>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Nominal</div>
                  <div className="text-lg font-black text-emerald-600">Rp {Number(selectedDetailItem.nominal).toLocaleString('id-ID')}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Sumber Dana</div>
                  <div className="text-sm font-semibold text-gray-700">{selectedDetailItem.sumber_dana || selectedDetailItem.sumberDana || "-"}</div>
                </div>
              </div>

              {selectedDetailItem.kategori !== 'Beasiswa' && (
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">Bukti Transaksi</div>
                  {selectedDetailItem.bukti && selectedDetailItem.bukti.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDetailItem.bukti.map((file, idx) => (
                        <div key={idx} className="rounded-xl border border-gray-100 overflow-hidden bg-gray-50">
                          {(file.startsWith('data:image') || file.match(/\.(jpg|jpeg|png|gif)$/i)) ? (
                            <div>
                              <img
                                src={file}
                                alt={`Bukti ${idx + 1}`}
                                className="w-full max-h-48 object-contain bg-white cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => { setSelectedPreviewFile(file); setShowPreviewModal(true); }}
                                title="Klik untuk memperbesar"
                              />
                              <div className="px-3 py-2 flex items-center justify-between">
                                <span className="text-[10px] text-gray-500 font-medium">Bukti Transaksi {idx + 1}</span>
                                <button
                                  onClick={() => { setSelectedPreviewFile(file); setShowPreviewModal(true); }}
                                  className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer border-none bg-transparent"
                                >Lihat Penuh</button>
                              </div>
                            </div>
                          ) : file.startsWith('data:application/pdf') ? (
                            <div className="p-3 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                                <svg width="18" height="18" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-gray-800">Dokumen PDF {idx + 1}</div>
                                <a
                                  href={file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-blue-600 font-bold hover:underline"
                                >Buka PDF di tab baru</a>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 text-xs text-gray-500">Bukti Transaksi {idx + 1}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 italic bg-gray-50 rounded-xl p-3 border border-gray-100">Tidak ada bukti transaksi yang dilampirkan.</div>
                  )}
                </div>
              )}

              {selectedDetailItem.penerima && selectedDetailItem.penerima.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Daftar Penerima Beasiswa</div>
                  <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 max-h-[140px] overflow-y-auto">
                    <ul className="list-disc pl-4 space-y-1">
                      {selectedDetailItem.penerima.map((p, i) => (
                        <li key={i}>
                          <span className="font-bold text-gray-800">{p.siswa_nama}</span> 
                          <span className="text-gray-500"> ({p.nama_kelas})</span>
                          <span className="text-emerald-600 font-semibold ml-2">Rp {Number(p.nominal || selectedDetailItem.nominal/selectedDetailItem.penerima.length).toLocaleString('id-ID')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Keterangan</div>
                <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 min-h-[60px]">
                  {selectedDetailItem.keterangan || "Tidak ada keterangan."}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50/50">
              <button 
                onClick={() => setSelectedDetailItem(null)}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer border-none"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col text-center">
            <div className="p-6">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-gray-800 mb-2">Hapus Data?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Anda akan menghapus <span className="font-bold text-gray-800">{selectedItems.length} data</span> pengeluaran. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="p-4 bg-gray-50 flex gap-3 border-t border-gray-100">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
              >
                Batal
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors cursor-pointer border-none shadow-sm"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview Bukti Transaksi */}
      {showPreviewModal && selectedPreviewFile && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-gray-800 truncate max-w-[200px] sm:max-w-[300px]">
                    {typeof selectedPreviewFile === 'string' 
                      ? (selectedPreviewFile.startsWith('data:') ? 'Bukti Transaksi' : selectedPreviewFile) 
                      : selectedPreviewFile?.name}
                  </h3>
                  <p className="text-[10px] text-gray-500">Pratinjau Dokumen</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowPreviewModal(false);
                  setSelectedPreviewFile(null);
                }}
                className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-2 rounded-xl transition-colors border border-gray-200 cursor-pointer shrink-0"
              >
                <IconX />
              </button>
            </div>
            
            <div className="bg-gray-100 p-4 sm:p-8 flex flex-col items-center justify-center min-h-[300px]">
              {selectedPreviewFile && typeof selectedPreviewFile !== 'string' && selectedPreviewFile.type?.includes('image') ? (
                <img src={selectedPreviewFile.preview || URL.createObjectURL(selectedPreviewFile)} alt="Preview Bukti" className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm" />
              ) : selectedPreviewFile && typeof selectedPreviewFile === 'string' && (selectedPreviewFile.match(/\.(jpg|jpeg|png|gif)$/i) || selectedPreviewFile.startsWith('data:image')) ? (
                <img src={selectedPreviewFile} alt="Preview Bukti" className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm" />
              ) : (
                <>
                  <div className="w-24 h-24 mb-4 text-gray-300">
                    <svg fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-gray-400 text-center max-w-[80%] break-words">Menampilkan Pratinjau: {typeof selectedPreviewFile === 'string' ? selectedPreviewFile : selectedPreviewFile?.name}</p>
                  <p className="text-xs text-gray-400 mt-2 text-center">Pratinjau khusus untuk file gambar (JPG/PNG). Dokumen PDF akan dapat dilihat saat diunduh.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PengeluaranOperasionalTab;
