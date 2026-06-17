import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import {
  approvePayroll,
  transferPayroll,
  getKomponenGaji,
  createKomponenGaji,
  updateKomponenGaji,
  deleteKomponenGaji,
  getTagihan,
  generateTagihanBulanan,
  getBeasiswa,
  createBeasiswa,
  updateBeasiswa,
  deleteBeasiswa,
  getKomponenSpp,
  createKomponenSpp,
  updateKomponenSpp,
  deleteKomponenSpp,
} from "../../api/finance";
import { getSiswa } from "../../api/academic";
import Profile from "../Profile";

// Icons Components
const IconReceipt = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

const IconWallet = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
  </svg>
);

const IconAlertCircle = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
  </svg>
);

const IconCheckCircle = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const IconX = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconClock = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const IconDollar = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879-.659c1.546-1.16 3.86-1.16 5.405 0l.879.66M8.25 12h7.5m-8.25-2.818.879-.66c1.546-1.159 3.86-1.159 5.405 0l.879.66" />
  </svg>
);

const IconChevronDown = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const IconTrendUp = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 0 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
  </svg>
);

const IconTrendDown = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.306-4.307a11.95 11.95 0 0 1 5.814 5.519l2.74 1.22m0 0-5.94 2.28m5.94-2.28-2.28-5.941" />
  </svg>
);

const IconPlus = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const IconSearch = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const IconPrinter = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.617 0-1.11-.5-1.12-1.129L6.34 18m11.32 0a3 3 0 0 0 0-6M6.34 18a3 3 0 0 1 0-6m0 0a3 3 0 0 1 3-3h5.32a3 3 0 0 1 3 3m0 0v1.125m-6.32-6h6.32m-6.32 0a3 3 0 0 0-3 3v1.125m-6-2.25h16.5a1.5 1.5 0 0 1 1.5 1.5V15a1.5 1.5 0 0 1-1.5 1.5H3.75A1.5 1.5 0 0 1 2.25 15V11.25a1.5 1.5 0 0 1 1.5-1.5Z" />
  </svg>
);

const IconSend = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
  </svg>
);

// Charts Mock Data
const sppRecapData = [
  { name: "Jan", Lunas: 28, Belum: 6 },
  { name: "Feb", Lunas: 30, Belum: 4 },
  { name: "Mar", Lunas: 31, Belum: 3 },
  { name: "Apr", Lunas: 29, Belum: 5 },
  { name: "Mei", Lunas: 24, Belum: 10 }
];

const sppDonutData = [
  { name: "Lunas SPP", value: 24, fill: "#22c55e" },
  { name: "Belum Bayar", value: 10, fill: "#ef4444" }
];

// Tables Mock Data
const initialPayments = [
  { id: 1, name: "Ahmad Fauzi", class: "Kelas VIIA", amount: "Rp 250.000", period: "Mei 2026", status: "Lunas" },
  { id: 2, name: "Aulia Rahma", class: "Kelas VIIB", amount: "Rp 250.000", period: "Mei 2026", status: "Lunas" },
  { id: 3, name: "Budi Wijaya", class: "Kelas VIIC", amount: "Rp 275.000", period: "Mei 2026", status: "Belum Bayar" },
  { id: 4, name: "Sinta Bella", class: "Kelas VIIIA", amount: "Rp 250.000", period: "Mei 2026", status: "Lunas" },
  { id: 5, name: "Deni Pratama", class: "Kelas VIIIB", amount: "Rp 250.000", period: "Mei 2026", status: "Cicilan" }
];

const payrollMockData = [
  { id: 1, name: "Andi Susanto, S.Pd", role: "Guru Matematika", salary: "Rp 4.105.500", status: "Sudah Transfer" },
  { id: 2, name: "Maya Putri, M.Pd", role: "Guru B. Indonesia", salary: "Rp 3.720.000", status: "Sudah Transfer" },
  { id: 3, name: "Hendro Wibowo", role: "Staff TU", salary: "Rp 3.150.000", status: "Pending" },
  { id: 4, name: "Dra. Sri Wahyuni", role: "Guru IPA", salary: "Rp 4.250.000", status: "Sudah Transfer" }
];

const BendaharaDashboard = ({ user, activeMenu, onViewChange }) => {
  const [sppPayments, setSppPayments] = useState(initialPayments);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedYear, setSelectedYear] = useState("2025/2026");
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showGenerateMonthModal, setShowGenerateMonthModal] = useState(false);
  
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showNotificationConfirm, setShowNotificationConfirm] = useState(false);
  const [selectedNotificationStudents, setSelectedNotificationStudents] = useState([]);

  const [studentsBill, setStudentsBill] = useState([]);
  const [billSearchQuery, setBillSearchQuery] = useState("");
  const [billClassFilter, setBillClassFilter] = useState("Semua");
  const [catatPembayaranFilter, setCatatPembayaranFilter] = useState("Semua");
  const [catatSearchQuery, setCatatSearchQuery] = useState("");

  const [riwayatKelas, setRiwayatKelas] = useState("Semua Kelas");
  const [riwayatBulan, setRiwayatBulan] = useState("Mei");
  const [expandedRiwayatId, setExpandedRiwayatId] = useState(null);

  // Form states for manually recording payments
  const [inputStudent, setInputStudent] = useState("");
  const [inputClass, setInputClass] = useState("Kelas VIIA");
  const [inputAmount, setInputAmount] = useState("Rp 250.000");
  const [inputPeriod, setInputPeriod] = useState("Mei 2026");
  const [inputStatus, setInputStatus] = useState("Lunas");

  // Form states for creating new bill
  const [billClass, setBillClass] = useState("Semua Kelas");
  const [billAmount, setBillAmount] = useState("250000");
  const [billDueDate, setBillDueDate] = useState("2026-06-10");

  // Beasiswa Modal State
  const [showAddPenerimaModal, setShowAddPenerimaModal] = useState(false);
  const [showDeleteBeasiswaModal, setShowDeleteBeasiswaModal] = useState(false);
  
  const [selectedProgramForView, setSelectedProgramForView] = useState(null);
  const [penerimaSearchQuery, setPenerimaSearchQuery] = useState('');
  const [penerimaStatusFilter, setPenerimaStatusFilter] = useState('Semua');


  // Actual Program State
  const [showAddProgramModal, setShowAddProgramModal] = useState(false);
  const [programList, setProgramList] = useState([]);
  const [newProgramForm, setNewProgramForm] = useState({
    nama: "",
    kategori: "",
    sumberDana: "",
    nominal: "",
    kuota: "",
    tahunAjaran: "2025/2026",
    tanggalMulaiDaftar: "",
    tanggalSelesaiDaftar: "",
    deskripsi: "",
    persyaratan: "",
    status: "Aktif"
  });
  const [isProgramFormDirty, setIsProgramFormDirty] = useState(false);
  const [showProgramCancelConfirm, setShowProgramCancelConfirm] = useState(false);
  const [showDeleteProgramConfirmModal, setShowDeleteProgramConfirmModal] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);

  const [beasiswaList, setBeasiswaList] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [selectedBeasiswa, setSelectedBeasiswa] = useState(null);
  const [beasiswaForm, setBeasiswaForm] = useState({
    siswaId: "",
    namaBeasiswa: "",
    nominal: "",
    periode: "2025/2026",
    status: "Aktif",
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalSelesai: ""
  });

  // Dana Beasiswa States
  const [danaBeasiswaList, setDanaBeasiswaList] = useState([]);
  const [showAddDanaModal, setShowAddDanaModal] = useState(false);
  const [showKelolaDanaModal, setShowKelolaDanaModal] = useState(false);
  const [newDanaForm, setNewDanaForm] = useState({
    sumber: "",
    nominal: "",
    tanggal: new Date().toISOString().split('T')[0],
    keterangan: ""
  });
  const [isDanaFormDirty, setIsDanaFormDirty] = useState(false);
  const [showDanaCancelConfirm, setShowDanaCancelConfirm] = useState(false);
  const [showDanaDatePicker, setShowDanaDatePicker] = useState(false);
  const [calendarBulan, setCalendarBulan] = useState(new Date().getMonth() + 1);
  const [calendarTahun, setCalendarTahun] = useState(new Date().getFullYear());


  // Pengaturan SPP states
  const [sppSettingTab, setSppSettingTab] = useState("nominal");
  const [sppList, setSppList] = useState([]);
  const [editingSppId, setEditingSppId] = useState(null);
  const [editSppAmount, setEditSppAmount] = useState("");
  const [editSppDenda, setEditSppDenda] = useState("");
  const [globalSppBerlaku, setGlobalSppBerlaku] = useState("2025-07-01");
  const [globalSppJatuhTempo, setGlobalSppJatuhTempo] = useState("2025-07-10");
  const [editGlobalSppBerlaku, setEditGlobalSppBerlaku] = useState("2025-07-01");
  const [editGlobalSppJatuhTempo, setEditGlobalSppJatuhTempo] = useState("2025-07-10");
  const [isEditingGlobalJadwal, setIsEditingGlobalJadwal] = useState(false);
  const [editSppGrade, setEditSppGrade] = useState("");
  const [editSppTa, setEditSppTa] = useState("");
  const [selectedCatatSiswa, setSelectedCatatSiswa] = useState(null);

  // Transaction Modal States
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionTab, setTransactionTab] = useState("Pemasukan");
  const [transactionCategory, setTransactionCategory] = useState("SPP"); // SPP for Pemasukan, Gaji/Operasional for Pengeluaran

  // Komponen Gaji Modal States
  const [showEditKomponenModal, setShowEditKomponenModal] = useState(false);
  const [showDeleteKomponenModal, setShowDeleteKomponenModal] = useState(false);
  const [selectedKomponen, setSelectedKomponen] = useState(null);
  const [editKomponenForm, setEditKomponenForm] = useState({ name: "", category: "Pendapatan", type: "Bulanan", nominal: "", status: "Aktif" });
  const [komponenGajiList, setKomponenGajiList] = useState([]);
  const [siswaSearchQuery, setSiswaSearchQuery] = useState("");
  const [showSiswaDropdown, setShowSiswaDropdown] = useState(false);

  // Initialize calendar when date picker opens
  useEffect(() => {
    if (showDanaDatePicker) {
      const [tahun, bulan] = (newDanaForm.tanggal || new Date().toISOString().split('T')[0]).split('-').slice(0, 2);
      setCalendarBulan(parseInt(bulan));
      setCalendarTahun(parseInt(tahun));
    }
  }, [showDanaDatePicker]);

  // Data Loaders
  const loadKomponenSpp = useCallback(async () => {
    try {
      const rows = await getKomponenSpp();
      if (Array.isArray(rows)) {
        setSppList(rows.map(r => ({
          id: r.id,
          grade: r.nama_kelas || r.nama,
          ta: "2025/2026",
          amount: `Rp ${Number(r.nominal).toLocaleString('id-ID')}`,
          amountNum: Number(r.nominal),
          denda: Number(r.denda || 0)
        })));
      }
    } catch (e) {
      console.error("loadKomponenSpp:", e);
    }
  }, []);

  const loadKomponenGaji = useCallback(async () => {
    try {
      const rows = await getKomponenGaji();
      setKomponenGajiList(Array.isArray(rows) ? rows : []);
    } catch (e) {
      console.error("loadKomponenGaji:", e);
    }
  }, []);

  const loadTagihan = useCallback(async (params = {}) => {
    try {
      const rows = await getTagihan(params);
      setStudentsBill(Array.isArray(rows) ? rows : []);
    } catch (e) {
      console.error("loadTagihan:", e);
    }
  }, []);

  const loadBeasiswa = useCallback(async () => {
    try {
      const rows = await getBeasiswa();
      setBeasiswaList(Array.isArray(rows) ? rows : []);
    } catch (e) {
      console.error("loadBeasiswa:", e);
    }
  }, []);

  const loadSiswa = useCallback(async () => {
    try {
      const rows = await getSiswa({ limit: 1000 }); // get all siswa
      setSiswaList(Array.isArray(rows) ? rows : []);
    } catch (e) {
      console.error("loadSiswa:", e);
    }
  }, []);

  const [generateForm, setGenerateForm] = useState({
    bulan: String(new Date().getMonth() + 1),
    tahun: String(new Date().getFullYear()),
    jatuh_tempo: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-10`
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadKomponenSpp();
    loadKomponenGaji();
    loadTagihan();
    loadBeasiswa();
    loadSiswa();
  }, [loadKomponenSpp, loadKomponenGaji, loadTagihan, loadBeasiswa, loadSiswa]);

  // Handlers
  const handleSaveKomponen = async () => {
    if (!editKomponenForm.name || !editKomponenForm.nominal) {
      triggerToast("Mohon lengkapi form", "error");
      return;
    }

    try {
      const payload = {
        nama: editKomponenForm.name,
        // tipe must be lowercase 'tunjangan' or 'potongan' based on DB constraint
        tipe: editKomponenForm.category === 'Pendapatan' ? 'tunjangan' : 'potongan',
        // kategori must be 'guru', 'staf', or 'umum'. UI doesn't specify, default to 'umum'
        kategori: 'umum',
        formula_tipe: editKomponenForm.type === 'Bulanan' ? 'flat' :
          editKomponenForm.type === 'Harian' ? 'per_hari_hadir' :
            editKomponenForm.type === 'Persentase' ? 'persen_gaji_pokok' : 'flat',
        nominal_default: editKomponenForm.type === 'Persentase' ? 0 : Number(editKomponenForm.nominal),
        nilai_satuan: editKomponenForm.type === 'Persentase' ? Number(editKomponenForm.nominal) : 0,
        is_aktif: editKomponenForm.status === 'Aktif'
      };

      if (selectedKomponen && selectedKomponen.id) {
        await updateKomponenGaji(selectedKomponen.id, payload);
        triggerToast("Komponen gaji berhasil diperbarui!");
      } else {
        await createKomponenGaji(payload);
        triggerToast("Komponen gaji berhasil ditambahkan!");
      }

      loadKomponenGaji();
      setShowEditKomponenModal(false);
      setSelectedKomponen(null);
    } catch (e) {
      console.error('Save Komponen Error:', e.response?.data || e.message);
      triggerToast(`Gagal menyimpan komponen: ${e.response?.data?.message || e.message}`, "error");
    }
  };

  const handleDeleteKomponen = async () => {
    if (!selectedKomponen || !selectedKomponen.id) return;
    try {
      await deleteKomponenGaji(selectedKomponen.id);
      triggerToast("Komponen gaji berhasil dihapus");
      loadKomponenGaji();
      setShowDeleteKomponenModal(false);
      setSelectedKomponen(null);
    } catch (e) {
      console.error(e);
      triggerToast("Gagal menghapus komponen", "error");
    }
  };

  const handleSaveProgram = () => {
    if(!newProgramForm.nama || !newProgramForm.kategori || !newProgramForm.sumberDana || !newProgramForm.nominal || !newProgramForm.tahunAjaran || !newProgramForm.tanggalMulaiDaftar || !newProgramForm.tanggalSelesaiDaftar) {
      triggerToast("Mohon isi seluruh field wajib bertanda *", "error");
      return;
    }
    const newProgram = {
      title: newProgramForm.nama,
      subtitle: newProgramForm.tahunAjaran,
      type: newProgramForm.kategori,
      sumberDana: newProgramForm.sumberDana,
      amount: "Rp " + newProgramForm.nominal,
      status: newProgramForm.status,
      typeColor: "blue",
      description: newProgramForm.deskripsi,
      quota: newProgramForm.kuota,
      requirements: newProgramForm.persyaratan,
      periodePendaftaran: `${newProgramForm.tanggalMulaiDaftar} s/d ${newProgramForm.tanggalSelesaiDaftar}`,
      penerima: []
    };
    setProgramList([newProgram, ...programList]);
    setShowAddProgramModal(false);
    setIsProgramFormDirty(false);
    triggerToast("Program berhasil ditambahkan!");
    setNewProgramForm({
      nama: "", kategori: "", sumberDana: "", nominal: "", kuota: "", tahunAjaran: "2025/2026", tanggalMulaiDaftar: "", tanggalSelesaiDaftar: "", deskripsi: "", persyaratan: "", status: "Aktif"
    });
  };

  const handleCancelProgram = () => {
    if (isProgramFormDirty) {
      setShowProgramCancelConfirm(true);
    } else {
      setShowAddProgramModal(false);
    }
  };

  const handleSaveDana = () => {
    if (!newDanaForm.nominal) {
      triggerToast("Mohon isi nominal dana beasiswa", "error");
      return;
    }
    const nominalNum = parseInt(String(newDanaForm.nominal).replace(/[^0-9]/g, ''), 10);
    const newDana = {
      id: Date.now(),
      sumber: newDanaForm.sumber,
      nominal: nominalNum,
      tanggal: newDanaForm.tanggal,
      keterangan: newDanaForm.keterangan
    };
    setDanaBeasiswaList([newDana, ...danaBeasiswaList]);
    setShowAddDanaModal(false);
    setIsDanaFormDirty(false);
    triggerToast("Dana Beasiswa berhasil ditambahkan!");
    setNewDanaForm({
      sumber: "",
      nominal: "",
      tanggal: new Date().toISOString().split('T')[0],
      keterangan: ""
    });
  };

  const handleCancelDana = () => {
    if (isDanaFormDirty) {
      setShowDanaCancelConfirm(true);
    } else {
      setShowAddDanaModal(false);
    }
  };

  const handleDeleteProgram = (title) => {
    setProgramToDelete(title);
    setShowDeleteProgramConfirmModal(true);
  };

  const executeDeleteProgram = () => {
    if (programToDelete) {
      setProgramList(programList.filter(p => p.title !== programToDelete));
      triggerToast("Program berhasil dihapus!");
      setProgramToDelete(null);
      setShowDeleteProgramConfirmModal(false);
    }
  };

  const handleSaveBeasiswa = async () => {
    if (!beasiswaForm.siswaId || !beasiswaForm.namaBeasiswa || !beasiswaForm.nominal || !beasiswaForm.periode || !beasiswaForm.tanggalMulai || !beasiswaForm.tanggalSelesai) {
      triggerToast("Mohon isi seluruh field wajib bertanda *", "error");
      return;
    }

    const btn = document.getElementById("btn-simpan-beasiswa");
    if(btn) {
      btn.innerHTML = '<svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Menyimpan...';
      btn.disabled = true;
    }

    const payload = {
      siswaId: beasiswaForm.siswaId,
      namaBeasiswa: beasiswaForm.namaBeasiswa,
      nominal: Number(beasiswaForm.nominal),
      periode: beasiswaForm.periode,
      status: beasiswaForm.status,
      tanggalMulai: beasiswaForm.tanggalMulai,
      tanggalSelesai: beasiswaForm.tanggalSelesai || null,
    };

    // Use a small timeout to show the saving state clearly for presentation
    setTimeout(async () => {
      try {
        if (selectedBeasiswa && selectedBeasiswa.id) {
          await updateBeasiswa(selectedBeasiswa.id, payload);
        } else {
          await createBeasiswa(payload);
        }
      } catch (e) {
        console.warn("API Error ignored for UI demonstration:", e);
      }

      // Also update local programList penerima so UI stays in sync
      const siswaData = siswaList.find(s => String(s.id) === String(beasiswaForm.siswaId));
      const newPenerima = {
        id: selectedBeasiswa?.id || Date.now(),
        siswa_id: beasiswaForm.siswaId,
        siswa_nama: siswaData?.nama_lengkap || "Siswa",
        nis: siswaData?.nis || "-",
        nama_kelas: siswaData?.nama_kelas || siswaData?.kelas || "-",
        nama_beasiswa: beasiswaForm.namaBeasiswa,
        nominal: Number(beasiswaForm.nominal),
        periode: beasiswaForm.periode,
        status: beasiswaForm.status,
        tanggal_mulai: beasiswaForm.tanggalMulai,
        tanggal_selesai: beasiswaForm.tanggalSelesai || null,
      };

      setProgramList(prev => prev.map(prog => {
        if (prog.title === beasiswaForm.namaBeasiswa) {
          let updatedPenerima;
          if (selectedBeasiswa && selectedBeasiswa.id) {
            // Edit existing
            updatedPenerima = (prog.penerima || []).map(p =>
              p.id === selectedBeasiswa.id ? newPenerima : p
            );
          } else {
            // Add new
            updatedPenerima = [...(prog.penerima || []), newPenerima];
          }
          return { ...prog, penerima: updatedPenerima };
        }
        // If editing and program changed, remove from old program
        if (selectedBeasiswa && prog.penerima?.some(p => p.id === selectedBeasiswa.id)) {
          return { ...prog, penerima: prog.penerima.filter(p => p.id !== selectedBeasiswa.id) };
        }
        return prog;
      }));
      
      if(btn) {
        btn.innerText = "Simpan Data";
        btn.disabled = false;
      }
      
      triggerToast(selectedBeasiswa ? "Penerima beasiswa berhasil diperbarui!" : "Penerima beasiswa berhasil ditambahkan!");
      loadBeasiswa();
      setShowAddPenerimaModal(false);
      setSelectedBeasiswa(null);
    }, 800);
  };

  const handleDeleteBeasiswa = async () => {
    if (!selectedBeasiswa || !selectedBeasiswa.id) return;
    try {
      await deleteBeasiswa(selectedBeasiswa.id);
    } catch (e) {
      console.warn("API Error ignored for UI demonstration:", e);
    }
    // Also remove from local programList penerima
    setProgramList(prev => prev.map(prog => {
      if (prog.penerima?.some(p => p.id === selectedBeasiswa.id)) {
        return { ...prog, penerima: prog.penerima.filter(p => p.id !== selectedBeasiswa.id) };
      }
      return prog;
    }));
    triggerToast("Penerima beasiswa berhasil dihapus");
    loadBeasiswa();
    setShowDeleteBeasiswaModal(false);
    setSelectedBeasiswa(null);
  };

  // Status Bayar Gaji Modal State
  const [selectedDetailGaji, setSelectedDetailGaji] = useState(null);
  const [showDetailGajiModal, setShowDetailGajiModal] = useState(false);

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleGenerateBilling = (e) => {
    e.preventDefault();
    setShowBillingModal(false);
    triggerToast(`Sukses membuat & mengirim tagihan SPP sebesar Rp ${Number(billAmount).toLocaleString("id-ID")} jatuh tempo ${billDueDate}!`);
  };

  const handleAddPayment = (e) => {
    e.preventDefault();
    if (!inputStudent) {
      triggerToast("Nama siswa tidak boleh kosong!");
      return;
    }
    const newPayment = {
      id: sppPayments.length + 1,
      name: inputStudent,
      class: inputClass,
      amount: inputAmount,
      period: inputPeriod,
      status: inputStatus,
      tanggal_bayar: new Date().toISOString()
    };
    setSppPayments([newPayment, ...sppPayments]);

    // Sinkronisasi otomatis ke daftar tagihan jika Lunas
    if (inputStatus === "Lunas" || inputStatus?.toLowerCase() === "lunas") {
      setStudentsBill(prev => prev.map(bill => {
        if ((bill.siswa_nama || bill.name) === inputStudent) {
          return { ...bill, status: "Lunas", tanggal_bayar: new Date().toISOString() };
        }
        return bill;
      }));
    }
    setInputStudent("");
    triggerToast("Sukses mencatat pembayaran siswa baru!");
  };

  const filteredBills = studentsBill.filter((row) => {
    const name = row.siswa_nama || row.name || '';
    const nis = row.nis || '';
    const kelas = row.nama_kelas || row.class || '';
    const kelasFormatted = kelas.replace(/^Kelas\s+/i, '').replace(/-/g, ' ').trim();
    
    const matchesSearch = name.toLowerCase().includes(billSearchQuery.toLowerCase()) ||
      nis.includes(billSearchQuery);

    if (billClassFilter === "Semua") return matchesSearch;
    
    const targetGrade = billClassFilter.replace("Kelas ", "").trim();
    const getGradePart = (k) => {
      const match = k.match(/^([IVX]+)/i);
      return match ? match[1].toUpperCase() : k;
    };
    const gradePart = getGradePart(kelasFormatted);
    const matchesClass = gradePart === targetGrade;
    
    return matchesSearch && matchesClass;
  });

  const formatBulan = (bulan, tahun) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    if (!bulan) return '';
    return `${months[(parseInt(bulan) - 1) % 12]} ${tahun || ''}`;
  };

  const formatTanggal = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return dateStr; }
  };

  // Helper function: Convert YYYY-MM-DD to DD/MM/YYYY
  const formatTanggalIndonesia = (dateStr) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch { return dateStr; }
  };

  // Helper function: Convert DD/MM/YYYY to YYYY-MM-DD
  const parseTanggalIndonesia = (dateStr) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return dateStr;
    } catch { return dateStr; }
  };

  // Rendering dashboard based on activeMenu selection
  const renderContent = () => {
    switch (activeMenu) {
      case "My Profile":
        return <Profile user={user} />;
      case "Dashboard":
      case "Overview":
        return (
          <div className="flex flex-col gap-6 animate-fadeIn font-sans">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-[26px] font-bold text-gray-800 tracking-tight">Dashboard Bendahara</h1>
                <p className="text-sm text-gray-500 mt-1">Monitor keuangan sekolah, SPP siswa, dan penggajian guru & staf.</p>
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
                    <option value="2024/2025">Tahun Ajaran: 2024/2025</option>
                    <option value="2023/2024">Tahun Ajaran: 2023/2024</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#1A3D63] transition-colors">
                    <IconChevronDown />
                  </div>
                </div>

                
              </div>
            </div>

            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {/* Card 1: Total SPP */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[110px]">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#10B981]" />
                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total SPP Terkumpul</div>
                  <div className="text-2xl font-black text-gray-800">Rp 16,1 Jt</div>
                  <div className="text-[11px] font-medium text-gray-400 mt-1">Bulan Mei 2026</div>
                </div>
              </div>

              {/* Card 2: Siswa Lunas */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[110px]">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#3B82F6]" />
                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Siswa Lunas SPP</div>
                  <div className="text-2xl font-black text-gray-800">24</div>
                  <div className="text-[11px] font-medium text-gray-400 mt-1">dari 34 siswa aktif</div>
                </div>
              </div>

              {/* Card 3: Tunggakan */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[110px]">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#EF4444]" />
                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tunggakan SPP</div>
                  <div className="text-2xl font-black text-gray-800">Rp 2,75 Jt</div>
                  <div className="text-[11px] font-medium text-gray-400 mt-1">10 siswa belum bayar</div>
                </div>
              </div>

              {/* Card 4: Penggajian */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[110px]">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#8B5CF6]" />
                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Penggajian Bulan Ini</div>
                  <div className="text-2xl font-black text-gray-800">Rp 13,5 Jt</div>
                  <div className="text-[11px] font-medium text-gray-400 mt-1">6 guru & staf</div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bar Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-800">Rekapitulasi SPP Per Bulan</h3>
                  <p className="text-[11px] text-gray-400">Jumlah siswa lunas vs belum bayar</p>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sppRecapData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 34]} ticks={[0, 8, 16, 24, 32, 34]} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="Lunas" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar dataKey="Belum" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Donut Chart */}
              <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="mb-2">
                  <h3 className="text-sm font-bold text-gray-800">Status SPP Siswa</h3>
                  <p className="text-[11px] text-gray-400">Distribusi pembayaran bulan ini</p>
                </div>
                <div className="h-[220px] relative flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sppDonutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {sppDonutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom Legend */}
                <div className="flex justify-center gap-6 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></div>
                    <span className="text-[10px] font-bold text-gray-500">Lunas SPP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></div>
                    <span className="text-[10px] font-bold text-gray-500">Belum Bayar</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Table 1: SPP Terbaru */}
              <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-sm font-bold text-gray-800">Pembayaran SPP Terbaru</h3>
                  <button onClick={() => onViewChange && onViewChange("Tagihan SPP")} className="text-[#2563EB] text-[11px] font-bold hover:underline bg-transparent border-none cursor-pointer">Lihat Semua →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <th className="pb-3 px-2">NAMA SISWA</th>
                        <th className="pb-3 px-2">KELAS</th>
                        <th className="pb-3 px-2">NOMINAL</th>
                        <th className="pb-3 px-2">PERIODE</th>
                        <th className="pb-3 px-2 text-right">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-[11px]">
                      {sppPayments.slice(0, 3).map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-2 font-bold text-gray-800">{row.name}</td>
                          <td className="py-4 px-2 text-gray-500 font-medium">{row.class?.replace('Kelas ', '')?.replace('-', ' ')}</td>
                          <td className="py-4 px-2 font-bold text-gray-700">{row.amount}</td>
                          <td className="py-4 px-2 text-gray-500">{row.period}</td>
                          <td className="py-4 px-2 text-right">
                            <span className={`px-2 py-0.5 rounded-md font-bold inline-block text-[9px] ${row.status === "Lunas" ? "bg-[#E6F4EA] text-[#137333]" :
                              row.status === "Cicilan" ? "bg-[#FEF7E0] text-[#B06000]" :
                                "bg-[#FCE8E6] text-[#C5221F]"
                              }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table 2: Status Penggajian */}
              <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-sm font-bold text-gray-800">Status Penggajian Guru & Staf</h3>
                  <button onClick={() => onViewChange && onViewChange("Status Bayar Gaji")} className="text-[#2563EB] text-[11px] font-bold hover:underline bg-transparent border-none cursor-pointer">Lihat Semua →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <th className="pb-3 px-2">NAMA</th>
                        <th className="pb-3 px-2">JABATAN</th>
                        <th className="pb-3 px-2">GAJI BERSIH</th>
                        <th className="pb-3 px-2 text-right">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-[11px]">
                      {payrollMockData.slice(0, 3).map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-2 font-bold text-gray-800">{row.name}</td>
                          <td className="py-4 px-2 text-gray-500 font-medium">{row.role}</td>
                          <td className="py-4 px-2 font-bold text-gray-700">{row.salary}</td>
                          <td className="py-4 px-2 text-right">
                            <span className={`px-2 py-0.5 rounded-md font-bold inline-block text-[9px] ${row.status === "Sudah Transfer" ? "bg-[#E6F4EA] text-[#137333]" :
                              "bg-[#FEF7E0] text-[#B06000]"
                              }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case "Tagihan SPP":
        const formatKelas = (kelasName) => {
          if (!kelasName) return "-";
          return kelasName.replace(/^Kelas\s+/i, '').replace(/-/g, ' ');
        };

        return (
          <>
            <div className="flex flex-col gap-6 animate-fadeIn font-sans">
              {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-[26px] font-bold text-gray-800 tracking-tight">Tagihan SPP Siswa</h1>
                <p className="text-sm text-gray-500 mt-1">Generate dan kelola tagihan SPP bulanan seluruh siswa.</p>
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
                    <option value="2024/2025">Tahun Ajaran: 2024/2025</option>
                    <option value="2023/2024">Tahun Ajaran: 2023/2024</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#1A3D63] transition-colors">
                    <IconChevronDown />
                  </div>
                </div>

                
              </div>
            </div>

            {/* Stat Cards Row */}
            {(() => {
              const totalSiswa = filteredBills.length;
              const lunasBills = filteredBills.filter(b => b.status === "Lunas" || b.status?.toLowerCase() === "lunas");
              const belumLunasBills = filteredBills.filter(b => b.status !== "Lunas" && b.status?.toLowerCase() !== "lunas");
              
              const totalTagihanNominal = filteredBills.reduce((acc, b) => acc + Number(b.nominal || 0), 0);
              const totalLunasNominal = lunasBills.reduce((acc, b) => acc + Number(b.nominal || 0), 0);
              const totalBelumLunasNominal = belumLunasBills.reduce((acc, b) => acc + Number(b.nominal || 0), 0);

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {/* Card 1: Total Tagihan */}
                  <div className="bg-[#1A3D63] rounded-xl p-5 shadow-sm">
                    <div className="text-2xl font-bold text-white">Rp {totalTagihanNominal.toLocaleString('id-ID')}</div>
                    <div className="text-[11px] text-blue-200 mt-1 font-semibold uppercase tracking-wider">Total Tagihan ({totalSiswa} Siswa)</div>
                  </div>

                  {/* Card 2: Sudah Terbayar */}
                  <div className="bg-[#1A3D63] rounded-xl p-5 shadow-sm">
                    <div className="text-2xl font-bold text-white">Rp {totalLunasNominal.toLocaleString('id-ID')}</div>
                    <div className="text-[11px] text-blue-200 mt-1 font-semibold uppercase tracking-wider">Sudah Terbayar ({lunasBills.length} Siswa)</div>
                  </div>

                  {/* Card 3: Belum Lunas */}
                  <div className="bg-[#1A3D63] rounded-xl p-5 shadow-sm">
                    <div className="text-2xl font-bold text-white">Rp {totalBelumLunasNominal.toLocaleString('id-ID')}</div>
                    <div className="text-[11px] text-blue-200 mt-1 font-semibold uppercase tracking-wider">Belum Lunas ({belumLunasBills.length} Siswa)</div>
                  </div>
                </div>
              );
            })()}

            {/* Filter and Table Container */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={billSearchQuery}
                    onChange={(e) => setBillSearchQuery(e.target.value)}
                    placeholder="Cari nama atau NIS..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#1A3D63] font-medium"
                  />
                  <span className="absolute left-3.5 top-3.5 text-gray-400">
                    <IconSearch />
                  </span>
                </div>

                {/* Tabs Filter and Export */}
                <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
                  <div className="flex bg-gray-50 border border-gray-100 p-1 rounded-xl">
                    {["Semua", "Kelas VII", "Kelas VIII", "Kelas IX"].map((tab) => {
                      const isActive = billClassFilter === tab;
                      return (
                        <button
                          key={tab}
                          onClick={() => setBillClassFilter(tab)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-none ${isActive
                            ? "bg-[#1A3D63] text-white shadow-sm"
                            : "text-gray-500 hover:text-gray-900 bg-transparent"
                            }`}
                        >
                          {tab}
                        </button>
                      );
                    })}
                  </div>

                  {/* Kirim Notifikasi Button */}
                  <button
                    onClick={() => {
                      setSelectedNotificationStudents([]);
                      setShowNotificationModal(true);
                    }}
                    className="flex items-center justify-center bg-[#1A3D63] hover:bg-blue-900 text-white border-none rounded-xl px-5 py-2 text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-sm"
                  >
                    Kirim Notifikasi
                  </button>

                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="pb-3 px-3 w-10">NO</th>
                      <th className="pb-3 px-3">NIS</th>
                      <th className="pb-3 px-3">NAMA SISWA</th>
                      <th className="pb-3 px-3">KELAS</th>
                      <th className="pb-3 px-3">NOMINAL SPP</th>
                      <th className="pb-3 px-3">BULAN</th>
                      <th className="pb-3 px-3">JATUH TEMPO</th>
                      <th className="pb-3 px-3">STATUS</th>
                      <th className="pb-3 px-3 text-right">TGL BAYAR</th>
                    </tr>
                  </thead>
                              <tbody className="divide-y divide-gray-50 text-xs">
                                {filteredBills.length === 0 ? (
                                  <tr>
                                    <td colSpan="8" className="py-8 text-center text-gray-400 font-medium">Belum ada data tagihan.</td>
                                  </tr>
                                ) : (
                                  filteredBills.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                      <td className="py-4 px-3 text-gray-500 font-bold">{idx + 1}.</td>
                                      <td className="py-4 px-3 text-gray-500 font-medium">{row.nis || "-"}</td>
                                      <td className="py-4 px-3 font-bold text-gray-800">{row.siswa_nama || row.name || "-"}</td>
                                      <td className="py-4 px-3 text-gray-500 font-medium">{formatKelas(row.nama_kelas || row.class)}</td>
                                      <td className="py-4 px-3 font-bold text-emerald-600">
                                        Rp {Number(row.nominal || 0).toLocaleString('id-ID')}
                                      </td>
                                      <td className="py-4 px-3 font-semibold text-gray-700">{formatBulan(row.bulan, row.tahun) || "-"}</td>
                                      <td className="py-4 px-3 text-gray-500">{formatTanggal(row.jatuh_tempo) || "-"}</td>
                                      <td className="py-4 px-3">
                                        <span className={`px-2.5 py-1 rounded-md font-bold inline-block text-[10px] no-underline ${
                                          (row.status === "Lunas" || row.status?.toLowerCase() === "lunas") ? "bg-emerald-50 text-emerald-600" :
                                          "bg-red-50 text-red-500"
                                        }`}>
                                          {row.status || "Belum Lunas"}
                                        </span>
                                      </td>
                                      <td className="py-4 px-3 text-right text-gray-500 font-medium">
                                        {(row.status === "Lunas" || row.status?.toLowerCase() === "lunas") 
                                          ? formatTanggal(row.tanggal_bayar || new Date().toISOString()) 
                                          : (formatTanggal(row.tanggal_bayar) || "-")}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                </table>
              </div>
            </div>
          </div>

            {/* MODAL KIRIM NOTIFIKASI */}
            {showNotificationModal && (() => {
              const belumLunasList = filteredBills.filter(b => b.status !== "Lunas" && b.status?.toLowerCase() !== "lunas");
              const allSelected = belumLunasList.length > 0 && selectedNotificationStudents.length === belumLunasList.length;

              const handleSelectAll = () => {
                if (allSelected) {
                  setSelectedNotificationStudents([]);
                } else {
                  setSelectedNotificationStudents(belumLunasList.map(b => b.id || b.nis || b.siswa_nama || b.name));
                }
              };

              const handleSelectStudent = (id) => {
                if (selectedNotificationStudents.includes(id)) {
                  setSelectedNotificationStudents(prev => prev.filter(studentId => studentId !== id));
                } else {
                  setSelectedNotificationStudents(prev => [...prev, id]);
                }
              };

              return (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Kirim Notifikasi Tagihan SPP</h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Tahun Ajaran: {selectedYear} | Kelas: {billClassFilter}</p>
                      </div>
                      <button onClick={() => { setShowNotificationModal(false); setSelectedNotificationStudents([]); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors border-none bg-transparent cursor-pointer">
                        <IconX />
                      </button>
                    </div>
                    
                    <div className="p-5 sm:p-6 flex-1 overflow-y-auto bg-gray-50/50">
                      {belumLunasList.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 mb-4">
                            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">Semua Lunas!</h3>
                          <p className="text-gray-500 text-sm mt-2">Tidak ada siswa yang menunggak sesuai filter aktif.</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {/* Control Bar */}
                          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={allSelected} 
                                onChange={handleSelectAll}
                                className="w-5 h-5 rounded border-gray-300 text-[#1A3D63] focus:ring-[#1A3D63] cursor-pointer"
                              />
                              <span className="text-sm font-bold text-gray-800">Pilih Semua Siswa</span>
                            </label>
                            <span className="text-sm font-bold text-[#1A3D63] bg-blue-50 px-3 py-1 rounded-lg">
                              {selectedNotificationStudents.length} Siswa Terpilih
                            </span>
                          </div>

                          {/* Student List */}
                          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                              <thead className="bg-gray-50/80">
                                <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                  <th className="py-3 px-4 w-12 text-center">PILIH</th>
                                  <th className="py-3 px-4">Nama Siswa</th>
                                  <th className="py-3 px-4">Kelas</th>
                                  <th className="py-3 px-4">Periode</th>
                                  <th className="py-3 px-4 text-right">Nominal Tagihan</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 text-sm">
                                {belumLunasList.map((row, idx) => {
                                  const rowId = row.id || row.nis || row.siswa_nama || row.name;
                                  const isSelected = selectedNotificationStudents.includes(rowId);
                                  return (
                                    <tr key={idx} className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50/50' : ''}`} onClick={() => handleSelectStudent(rowId)}>
                                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                        <input 
                                          type="checkbox" 
                                          checked={isSelected}
                                          onChange={() => handleSelectStudent(rowId)}
                                          className="w-4 h-4 rounded border-gray-300 text-[#1A3D63] focus:ring-[#1A3D63] cursor-pointer"
                                        />
                                      </td>
                                      <td className="py-3 px-4 font-bold text-gray-800">{row.siswa_nama || row.name || "-"}</td>
                                      <td className="py-3 px-4 text-gray-600">{formatKelas(row.nama_kelas || row.class)}</td>
                                      <td className="py-3 px-4 text-gray-600 font-medium">{formatBulan(row.bulan, row.tahun) || "-"}</td>
                                      <td className="py-3 px-4 text-right font-bold text-emerald-600">Rp {Number(row.nominal || 0).toLocaleString('id-ID')}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-5 sm:p-6 border-t border-gray-100 flex items-center justify-end bg-white sticky bottom-0 z-10">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => { setShowNotificationModal(false); setSelectedNotificationStudents([]); }}
                          className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 border-none cursor-pointer transition-colors text-[13px]"
                        >
                          Batal
                        </button>
                        <button 
                          disabled={selectedNotificationStudents.length === 0 || belumLunasList.length === 0}
                          onClick={() => setShowNotificationConfirm(true)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-[#1A3D63] hover:bg-blue-900 border-none cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1A3D63] text-[13px] shadow-sm"
                        >
                          Kirim Sekarang ({selectedNotificationStudents.length})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* MODAL KONFIRMASI KIRIM NOTIFIKASI */}
            {showNotificationConfirm && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1A3D63] flex items-center justify-center mb-4">
                      <IconAlertCircle />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Pengiriman</h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Apakah Anda yakin ingin mengirim notifikasi tagihan SPP ke <span className="font-bold text-gray-800">{selectedNotificationStudents.length} siswa</span> terpilih? Notifikasi akan dikirimkan ke WhatsApp orang tua/wali siswa.
                    </p>
                    <div className="flex gap-3 w-full">
                      <button 
                        onClick={() => setShowNotificationConfirm(false)}
                        className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 border-none cursor-pointer transition-colors"
                      >
                        Batal
                      </button>
                      <button 
                        onClick={() => {
                          triggerToast(`Berhasil mengirim notifikasi ke ${selectedNotificationStudents.length} siswa!`);
                          setShowNotificationConfirm(false);
                          setShowNotificationModal(false);
                          setSelectedNotificationStudents([]);
                        }}
                        className="flex-1 py-3 rounded-xl font-bold text-white bg-[#1A3D63] hover:bg-blue-900 border-none cursor-pointer transition-all shadow-sm"
                      >
                        Ya, Kirim
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        );

      case "Pengaturan SPP":
        return (
          <div className="flex flex-col gap-6 animate-fadeIn font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-[26px] font-bold text-gray-800 tracking-tight">Pengaturan SPP</h1>
                <p className="text-sm text-gray-500 mt-1">Atur nominal SPP, diskon, dan jadwal pembayaran per kelas (Kelas VII, VIII, IX).</p>
              </div>
              <div className="flex gap-2 sm:gap-3 items-center flex-wrap sm:ml-auto">
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
                    <option value="2024/2025">Tahun Ajaran: 2024/2025</option>
                    <option value="2023/2024">Tahun Ajaran: 2023/2024</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#1A3D63] transition-colors">
                    <IconChevronDown />
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl border border-gray-100 p-1 flex gap-1 shadow-sm">
              {[
                { key: "nominal", label: "Nominal SPP per Kelas" },
                { key: "kalender", label: "Kalender Pembayaran" }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSppSettingTab(tab.key)}
                  className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer border-none ${sppSettingTab === tab.key ? "bg-[#1A3D63] text-white shadow-sm" : "text-gray-500 hover:text-gray-800 bg-transparent"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Nominal SPP per Kelas */}
            {sppSettingTab === "nominal" && (
              <div className="flex flex-col gap-5">
                {/* 3 Quick View Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sppList.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{item.grade}</div>
                        <div className="text-3xl font-black text-gray-800 mb-2">{item.amount}</div>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-2">Berlaku: {formatTanggal(globalSppBerlaku)} · Jatuh tempo: {formatTanggal(globalSppJatuhTempo)}</div>
                    </div>
                  ))}
                </div>

                {/* Daftar Pengaturan SPP */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-bold text-gray-800">Daftar Pengaturan SPP</h3>
                  </div>

                  <div className="flex flex-col gap-3">
                    {sppList.map((item) => {
                      const isEditing = editingSppId === item.id;
                      return (
                        <div
                          key={item.id}
                          className={`border rounded-xl transition-all duration-200 ${isEditing ? "border-[#1A3D63] shadow-[0_0_0_3px_rgba(26,61,99,0.1)] p-5" : "border-gray-100 hover:bg-gray-50/50 p-4"}`}
                        >
                          {/* Header row (always visible) */}
                          <div className="flex items-center gap-4">
                            {/* Icon */}


                            {/* Info */}
                            <div className="flex-1">
                              <div className="text-sm font-bold text-gray-800">
                                {item.grade.replace('-', ' ')}
                                <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded ml-2">TA {item.ta}</span>
                              </div>
                              {!isEditing && (
                                <div className="text-[11px] text-gray-400 mt-0.5">
                                  Berlaku: {formatTanggal(globalSppBerlaku)} · Jatuh tempo: {formatTanggal(globalSppJatuhTempo)}
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            {isEditing ? (
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  onClick={() => setEditingSppId(null)}
                                  className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border-solid"
                                >
                                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Batal
                                </button>
                                <button
                                  onClick={async () => {
                                    if (!editSppAmount) {
                                      triggerToast("Nominal wajib diisi", "error");
                                      return;
                                    }
                                    try {
                                      const payload = {
                                        nominal: Number(editSppAmount),
                                        denda: Number(editSppDenda)
                                      };
                                      await updateKomponenSpp(item.id, payload);
                                      triggerToast(`Nominal ${editSppGrade} berhasil diperbarui!`);
                                      setEditingSppId(null);
                                      loadKomponenSpp();
                                    } catch (e) {
                                      triggerToast("Gagal menyimpan pengaturan SPP", "error");
                                      console.error(e);
                                    }
                                  }}
                                  className="flex items-center gap-1.5 bg-[#1A3D63] hover:bg-[#122A44] text-white border-none px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95"
                                >
                                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" />
                                  </svg>
                                  Simpan
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center flex-shrink-0 ml-auto">
                                <button
                                  onClick={() => {
                                    setEditingSppId(item.id);
                                    setEditSppAmount(String(item.amountNum));
                                    setEditSppDenda(String(item.denda));
                                    setEditSppGrade(item.grade);
                                    setEditSppTa(item.ta);
                                  }}
                                  className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border-solid"
                                >
                                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                                  </svg>
                                  Edit
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Inline Expand Edit Form */}
                          {isEditing && (
                            <div className="mt-5 pt-5 border-t border-gray-100">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Tahun Ajaran</label>
                                  <div className="relative">
                                    <select
                                      value={editSppTa}
                                      onChange={(e) => setEditSppTa(e.target.value)}
                                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#1A3D63] transition-colors appearance-none bg-white cursor-pointer"
                                    >
                                      <option value="2025/2026">2025/2026</option>
                                    </select>
                                    <span className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                                      <IconChevronDown />
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Nominal SPP (Rp)</label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-sm font-bold text-gray-500 pointer-events-none select-none">Rp</span>
                                    <input
                                      type="text"
                                      value={editSppAmount ? Number(editSppAmount.toString().replace(/\D/g, '')).toLocaleString('id-ID') : ''}
                                      onChange={(e) => {
                                        const rawValue = e.target.value.replace(/\D/g, '');
                                        setEditSppAmount(rawValue);
                                      }}
                                      className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#1A3D63] transition-colors"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Warning Banner */}
                  
                </div>
              </div>
            )}

            {/* Tab: Kalender Pembayaran */}
            {sppSettingTab === "kalender" && (
              <div className="flex flex-col gap-6">
                {/* Card 1: Pengaturan Jadwal SPP */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className={`rounded-2xl border transition-all ${isEditingGlobalJadwal ? "bg-blue-50/30 border-blue-100 p-5 sm:p-6 shadow-sm" : "bg-transparent border-gray-100 p-5"}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">Pengaturan Jadwal SPP</h3>
                        {!isEditingGlobalJadwal && (
                          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Berlaku:</span>
                              <span className="text-xs font-semibold text-gray-700">{formatTanggal(globalSppBerlaku)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Jatuh Tempo:</span>
                              <span className="text-xs font-semibold text-gray-700">{formatTanggal(globalSppJatuhTempo)}</span>
                            </div>
                          </div>
                        )}
                        {isEditingGlobalJadwal && (
                          <p className="text-[11px] text-gray-500 mt-1">Ubah tanggal berlaku dan jatuh tempo bulanan untuk seluruh tagihan kelas.</p>
                        )}
                      </div>

                      {!isEditingGlobalJadwal && (
                        <button
                          onClick={() => {
                            setEditGlobalSppBerlaku(globalSppBerlaku);
                            setEditGlobalSppJatuhTempo(globalSppJatuhTempo);
                            setIsEditingGlobalJadwal(true);
                          }}
                          className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border-solid shadow-sm"
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                          </svg>
                          Edit Jadwal
                        </button>
                      )}
                    </div>

                    {isEditingGlobalJadwal && (
                      <div className="mt-5 pt-5 border-t border-blue-100/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Tanggal Berlaku</label>
                            <div className="relative">
                              <input
                                type="date"
                                value={editGlobalSppBerlaku}
                                onChange={(e) => setEditGlobalSppBerlaku(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#1A3D63] transition-colors"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Jatuh Tempo Bulanan</label>
                            <div className="relative">
                              <input
                                type="date"
                                value={editGlobalSppJatuhTempo}
                                onChange={(e) => setEditGlobalSppJatuhTempo(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#1A3D63] transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-2 pt-5 border-t border-gray-200/60">
                          <button
                            onClick={() => {
                              setEditGlobalSppBerlaku(globalSppBerlaku);
                              setEditGlobalSppJatuhTempo(globalSppJatuhTempo);
                              setIsEditingGlobalJadwal(false);
                              triggerToast("Perubahan dibatalkan.");
                            }}
                            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-solid shadow-sm"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => {
                              setGlobalSppBerlaku(editGlobalSppBerlaku);
                              setGlobalSppJatuhTempo(editGlobalSppJatuhTempo);
                              setIsEditingGlobalJadwal(false);
                              triggerToast("Jadwal SPP berhasil disimpan!");
                            }}
                            className="flex items-center gap-1.5 bg-[#1A3D63] hover:bg-[#122A44] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 border-none cursor-pointer"
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" />
                            </svg>
                            Simpan
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card 2: Kalender Tagihan SPP */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-800">Kalender Tagihan SPP Tahun Ajaran 2025/2026</h3>
                    <p className="text-[11px] text-gray-400 mt-1">Periode penagihan SPP Juli 2025 — Juni 2026</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { month: "Juli 2025", active: false, hasDetails: true },
                      { month: "Agustus 2025", active: false, hasDetails: true },
                      { month: "September 2025", active: false, hasDetails: true },
                      { month: "Oktober 2025", active: false, hasDetails: true },
                      { month: "November 2025", active: false, hasDetails: true },
                      { month: "Desember 2025", active: false, hasDetails: true },
                      { month: "Januari 2026", active: false, hasDetails: true },
                      { month: "Februari 2026", active: false, hasDetails: true },
                      { month: "Maret 2026", active: false, hasDetails: true },
                      { month: "April 2026", active: false, hasDetails: true },
                      { month: "Mei 2026", active: true, hasDetails: true },
                      { month: "Juni 2026", active: false, hasDetails: false }
                    ].map((item, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-xl border ${item.active
                          ? "border-blue-500 bg-blue-50/30"
                          : "border-gray-100 bg-white"
                          } h-[84px] flex flex-col justify-center`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${item.active
                            ? "font-bold text-blue-700"
                            : item.hasDetails
                              ? "font-bold text-gray-700"
                              : "font-semibold text-gray-400"
                            }`}>
                            {item.month}
                          </span>
                          {item.active && (
                            <span className="bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Aktif</span>
                          )}
                        </div>

                        {item.hasDetails && (
                          <div className={`text-[10px] mt-1 ${item.active ? "text-blue-500/80" : "text-gray-400"}`}>
                            Jatuh tempo tgl 10 · Kelas VII-IX
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "Riwayat Pembayaran":
        const mockRiwayat = [
          { id: 1, name: "Ahmad Fauzi", kelas: "VII A", date: "09.14 WIB", amount: "Rp 250.000", method: "Transfer Bank", month: "Mei" },
          { id: 2, name: "Aulia Rahma", kelas: "VII B", date: "09.02 WIB", amount: "Rp 250.000", method: "Transfer Bank", month: "Mei" },
          { id: 3, name: "Eka Putri", kelas: "IX A", date: "08.45 WIB", amount: "Rp 300.000", method: "Transfer Bank", month: "Mei" },
          { id: 4, name: "Budi Santoso", kelas: "VIII A", date: "10.00 WIB", amount: "Rp 275.000", method: "Transfer Bank", month: "Januari" },
          { id: 5, name: "Siti Aminah", kelas: "VIII B", date: "11.30 WIB", amount: "Rp 275.000", method: "Transfer Bank", month: "Januari" },
          { id: 6, name: "Lina Marlina", kelas: "VII C", date: "08.20 WIB", amount: "Rp 250.000", method: "Transfer Bank", month: "Januari" }
        ];

        let filteredRiwayat = riwayatBulan === "Semua Bulan" 
          ? mockRiwayat 
          : mockRiwayat.filter(r => r.month === riwayatBulan);
          
        const classGroups = riwayatKelas === "Semua Kelas" ? ["Kelas VII", "Kelas VIII", "Kelas IX"] : [riwayatKelas];

        return (
          <div className="animate-fadeIn font-sans">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-[26px] font-bold text-gray-800 tracking-tight">Riwayat Pembayaran</h2>
                <p className="text-sm text-gray-500 mt-1">Daftar transaksi pembayaran SPP siswa yang telah masuk.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
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
                    <option value="2024/2025">Tahun Ajaran: 2024/2025</option>
                    <option value="2023/2024">Tahun Ajaran: 2023/2024</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#1A3D63] transition-colors">
                    <IconChevronDown />
                  </div>
                </div>
                
                <div className="relative">
                  <select
                    value={riwayatKelas}
                    onChange={(e) => setRiwayatKelas(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-[13px] font-semibold text-gray-700 cursor-pointer appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] transition-all hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                  >
                    <option value="Semua Kelas">Semua Kelas</option>
                    <option value="Kelas VII">Kelas VII</option>
                    <option value="Kelas VIII">Kelas VIII</option>
                    <option value="Kelas IX">Kelas IX</option>
                  </select>
                  <span className="absolute right-3 top-3.5 text-gray-400 pointer-events-none transition-colors">
                    <IconChevronDown />
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={riwayatBulan}
                    onChange={(e) => setRiwayatBulan(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-[13px] font-semibold text-gray-700 cursor-pointer appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] transition-all hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                  >
                    <option value="Semua Bulan">Semua Bulan</option>
                    <option value="Januari">Januari</option>
                    <option value="Februari">Februari</option>
                    <option value="Maret">Maret</option>
                    <option value="April">April</option>
                    <option value="Mei">Mei</option>
                    <option value="Juni">Juni</option>
                    <option value="Juli">Juli</option>
                    <option value="Agustus">Agustus</option>
                    <option value="September">September</option>
                    <option value="Oktober">Oktober</option>
                    <option value="November">November</option>
                    <option value="Desember">Desember</option>
                  </select>
                  <span className="absolute right-3 top-3.5 text-gray-400 pointer-events-none transition-colors">
                    <IconChevronDown />
                  </span>
                </div>
              </div>
            </div>

            <div className={`grid grid-cols-1 ${classGroups.length > 1 ? 'xl:grid-cols-3' : ''} gap-6`}>
              {classGroups.map(group => {
                const groupPrefix = group.replace("Kelas ", "");
                const groupData = filteredRiwayat.filter(r => r.kelas.startsWith(groupPrefix));

                return (
                  <div key={group} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col">
                    <h3 className="text-sm font-bold text-[#1A3D63] mb-4 pb-3 border-b border-gray-100 flex items-center justify-between">
                      {group}
                      <span className="bg-[#EBF3FA] text-[#1A3D63] px-2.5 py-0.5 rounded-md text-[10px] font-bold">{groupData.length} Siswa</span>
                    </h3>
                    
                    <div className="flex flex-col gap-4">
                      {groupData.length > 0 ? groupData.map((item, idx) => {
                        const isExpanded = expandedRiwayatId === item.id;
                        return (
                        <React.Fragment key={item.id}>
                          <div className={`flex flex-col gap-3 transition-all ${isExpanded ? 'bg-gray-50/50 p-3.5 rounded-xl border border-gray-200' : ''}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#EBF3FA] flex items-center justify-center text-[10px] font-bold text-[#1A3D63] flex-shrink-0 shadow-sm">
                                  {idx + 1}
                                </div>
                                <div>
                                  <div className="text-[13px] font-bold text-gray-800">{item.name}</div>
                                  <div className="text-[10px] font-semibold text-gray-400 mt-0.5">{item.kelas} • {item.month}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setExpandedRiwayatId(isExpanded ? null : item.id)}
                                  className={`bg-white hover:bg-gray-50 border ${isExpanded ? 'border-[#EF4444] text-[#EF4444] hover:bg-red-50' : 'border-gray-200 text-[#1A3D63]'} px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all shadow-sm active:scale-95`}
                                >
                                  {isExpanded ? 'Tutup' : 'Detail'}
                                </button>
                              </div>
                            </div>

                            {/* Expanded Detail Section */}
                            {isExpanded && (
                              <div className="mt-2 pt-3 border-t border-gray-200 animate-fadeIn grid grid-cols-2 gap-3">
                                <div>
                                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Nominal</div>
                                  <div className="text-xs font-bold text-[#0F9D58] mt-0.5">{item.amount}</div>
                                </div>
                                <div>
                                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Bulan Tagihan</div>
                                  <div className="text-xs font-semibold text-gray-700 mt-0.5">{item.month} 2026</div>
                                </div>
                                <div>
                                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Metode</div>
                                  <div className="text-xs font-semibold text-gray-700 mt-0.5">{item.method}</div>
                                </div>
                                <div>
                                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Waktu Bayar</div>
                                  <div className="text-xs font-semibold text-gray-700 mt-0.5">{item.date}</div>
                                </div>
                              </div>
                            )}
                          </div>
                          {idx < groupData.length - 1 && !isExpanded && <div className="w-full h-px bg-gray-50"></div>}
                        </React.Fragment>
                      )}) : (
                        <div className="text-center py-6 text-gray-400 text-[11px] font-medium border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                          Tidak ada data di {group}.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "Beasiswa":
        return (
          <div className="animate-fadeIn">
            {!selectedProgramForView ? (
              <>
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Beasiswa</h2>
                <p className="text-sm text-gray-500 mt-1">Kelola program beasiswa dan potongan SPP siswa.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    onChange={(e) => setSelectedYear(e.target.value)}
                    value={selectedYear}
                    className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 text-xs sm:text-[13px] font-bold text-gray-700 cursor-pointer appearance-none pr-8 focus:outline-none"
                  >
                    <option value="2025/2026">Tahun Ajaran: 2025/2026</option>
                  </select>
                  <span className="absolute right-3 top-3.5 text-gray-400 pointer-events-none">
                    <IconChevronDown />
                  </span>
                </div>
                <button
                  onClick={() => setShowKelolaDanaModal(true)}
                  className="bg-[#1A3D63] text-white font-bold text-sm px-4 py-2.5 rounded-xl cursor-pointer border-none hover:bg-[#122A44] transition-all flex items-center shadow-sm"
                >
                  Kelola Dana
                </button>
                <button
                  onClick={() => { setIsProgramFormDirty(false); setShowAddProgramModal(true); }}
                  className="bg-[#1A3D63] text-white font-bold text-sm px-4 py-2.5 rounded-xl cursor-pointer border-none hover:bg-[#122A44] transition-all flex items-center shadow-sm"
                >
                  Tambah Program
                </button>
                <button
                  onClick={() => {
                    setSelectedBeasiswa(null);
                    setBeasiswaForm({
                      siswaId: "",
                      namaBeasiswa: "",
                      nominal: "",
                      periode: "2025/2026",
                      status: "Aktif",
                      tanggalMulai: new Date().toISOString().split('T')[0],
                      tanggalSelesai: ""
                    });
                    setShowAddPenerimaModal(true);
                  }}
                  className="bg-[#1A3D63] text-white font-bold text-sm px-4 py-2.5 rounded-xl cursor-pointer border-none hover:bg-[#122A44] transition-all flex items-center shadow-sm"
                >
                  Tambah Penerima
                </button>
              </div>
            </div>

            {/* Stats */}
            {(() => {
              let programAktif = 0;
              let totalPenerimaAktif = 0;
              let danaTerpakai = 0;

              // Calculate Total Dana Beasiswa
              const totalDanaBeasiswa = danaBeasiswaList.reduce((sum, d) => sum + (Number(d.nominal) || 0), 0);

              programList.forEach(p => {
                if (p.status === 'Aktif') {
                  programAktif++;
                  totalPenerimaAktif += (p.penerima?.length || 0);
                  
                  const amountStr = String(p.amount || "0").replace(/[^0-9]/g, '');
                  const amountNum = parseInt(amountStr, 10) || 0;
                  
                  const disalurkan = (p.penerima || []).reduce((s, r) => {
                    const rNominal = r.nominal ? parseInt(String(r.nominal).replace(/[^0-9]/g, ''), 10) : amountNum;
                    return s + (rNominal || 0);
                  }, 0);
                  
                  danaTerpakai += disalurkan;
                }
              });

              const sisaDana = totalDanaBeasiswa - danaTerpakai;

              const formatRupiahPenuh = (val) => {
                return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
              };

              return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#1A3D63] rounded-xl p-5 shadow-sm">
                <div className="text-2xl font-bold text-white">{programAktif}</div>
                <div className="text-[11px] text-blue-200 mt-1 font-semibold uppercase tracking-wider">Program Beasiswa Aktif</div>
              </div>
              <div className="bg-[#1A3D63] rounded-xl p-5 shadow-sm">
                <div className="text-2xl font-bold text-white">{totalPenerimaAktif} Siswa</div>
                <div className="text-[11px] text-blue-200 mt-1 font-semibold uppercase tracking-wider">Total Penerima Beasiswa</div>
              </div>
              <div className="bg-[#1A3D63] rounded-xl p-5 shadow-sm">
                <div className="text-xl font-bold text-white">{formatRupiahPenuh(totalDanaBeasiswa)}</div>
                <div className="text-[11px] text-blue-200 mt-1 font-semibold uppercase tracking-wider">Total Dana Beasiswa</div>
              </div>
              <div className="bg-[#1A3D63] rounded-xl p-5 shadow-sm">
                <div className="text-xl font-bold text-white">{formatRupiahPenuh(sisaDana)}</div>
                <div className="text-[11px] text-blue-200 mt-1 font-semibold uppercase tracking-wider">Sisa Dana</div>
              </div>
            </div>
              );
            })()}

            {/* Tabs */}
            {/* Tab Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {programList.map((item, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#EBF3FA] flex items-center justify-center text-[13px] font-bold text-[#1A3D63] shrink-0 shadow-sm">
                          {i + 1}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800">{item.title}</div>
                          <div className="text-[11px] text-gray-400 mt-1">{item.subtitle}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setSelectedProgramForView(item.title)} className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-blue-500 transition-colors cursor-pointer">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                        </button>
                        <button onClick={() => handleDeleteProgram(item.title)} className="w-8 h-8 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors cursor-pointer">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mt-2">

                      <span className="flex items-center gap-1 text-[11px] text-gray-500 font-medium ml-2">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                        {(item.penerima?.length || 0)} siswa
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              </>
            ) : (
              (() => {
                const activeProgram = programList.find(p => p.title === selectedProgramForView) || {
                  title: selectedProgramForView,
                  subtitle: "2025/2026",
                  type: "Beasiswa",
                  amount: "-",
                  status: "Aktif",
                  description: "Belum ada deskripsi detail untuk program beasiswa ini.",
                  quota: "Tidak dibatasi",
                  requirements: "Belum ada persyaratan khusus yang ditambahkan."
                };

                return (
                  <div className="flex flex-col gap-4 animate-fadeIn">
                    <div className="flex items-center gap-3 mb-4">
                      <button onClick={() => setSelectedProgramForView(null)} className="w-9 h-9 flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer border-none shrink-0">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                      </button>
                      <h2 className="text-xl font-bold text-gray-800 tracking-tight">Detail Program Beasiswa</h2>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                      {/* Left Column: Program Info */}
                      {(() => {
                        const amtStr = String(activeProgram.amount || "0").replace(/[^0-9]/g, '');
                        const amtNum = parseInt(amtStr, 10) || 0;
                        const qNum = parseInt(activeProgram.quota, 10) || 0;
                        const disalurkan = (activeProgram.penerima || []).reduce((s, r) => {
                          const rNominal = r.nominal ? parseInt(String(r.nominal).replace(/[^0-9]/g, ''), 10) : amtNum;
                          return s + (rNominal || 0);
                        }, 0);
                        const anggaran = qNum > 0 ? (amtNum * qNum) : disalurkan;
                        const sisaDana = anggaran - disalurkan;
                        const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
                        
                        return (
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm xl:sticky xl:top-6 flex flex-col">
                        {/* Header Section */}
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-gray-800 leading-tight pr-4">{activeProgram.title}</h3>
                            <span className={`inline-flex shrink-0 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${activeProgram.status === 'Aktif' ? 'bg-[#E6F4EA] text-[#059669]' : 'bg-gray-100 text-gray-500'}`}>
                              {activeProgram.status || 'Aktif'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 font-medium">Periode {activeProgram.subtitle}</p>
                        </div>

                        {/* Details Grid */}
                        <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4 border-b border-gray-100">
                          <div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Nominal Bantuan</div>
                            <div className="text-sm font-bold text-gray-800">{activeProgram.amount}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Kategori</div>
                            <div className="text-sm font-bold text-gray-800">{activeProgram.type}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Sumber Dana</div>
                            <div className="text-sm font-bold text-gray-800">{activeProgram.sumberDana || '-'}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Kuota Tersedia</div>
                            <div className="text-sm font-bold text-gray-800">
                              {activeProgram.quota ? `${activeProgram.quota} Siswa` : 'Tidak Dibatasi'}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Total Penerima</div>
                            <div className="text-sm font-bold text-[#1A3D63]">{(activeProgram.penerima?.length || 0)} Siswa</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Dana Tersalurkan</div>
                            <div className="text-sm font-bold text-emerald-600">{formatRupiah(disalurkan)}</div>
                          </div>
                          <div className="col-span-2 pt-2 border-t border-gray-50">
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Sisa Dana Program</div>
                            <div className="text-base font-bold text-gray-800">{formatRupiah(sisaDana)}</div>
                          </div>
                        </div>

                        {/* Description & Requirements */}
                        <div className="p-6 flex flex-col gap-6">
                          <div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Deskripsi Program</div>
                            <p className="text-[13px] text-gray-600 leading-relaxed">
                              {activeProgram.description || "Belum ada deskripsi spesifik untuk program beasiswa ini."}
                            </p>
                          </div>
                          <div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Persyaratan</div>
                            <div className="text-[13px] text-gray-600 leading-relaxed">
                              {activeProgram.requirements ? (
                                <div className="whitespace-pre-line">{activeProgram.requirements}</div>
                              ) : (
                                <span className="italic opacity-80">Belum ada persyaratan khusus.</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      );
                    })()}

                      {/* Right Column: Table */}
                      <div className="xl:col-span-2 flex flex-col gap-4">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                          {/* Card Header inside the card for cleaner layout */}
                          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">Daftar Penerima Beasiswa</h3>
                              <p className="text-xs text-gray-400 mt-1">Siswa yang terdaftar dalam program {activeProgram.title}.</p>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                              <div className="relative w-full sm:w-48">
                                <span className="absolute left-3 top-2.5 text-gray-400">
                                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" /></svg>
                                </span>
                                <input
                                  type="text"
                                  value={penerimaSearchQuery}
                                  onChange={(e) => setPenerimaSearchQuery(e.target.value)}
                                  placeholder="Cari Nama / NIS..."
                                  className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20"
                                />
                              </div>
                              <select
                                value={penerimaStatusFilter}
                                onChange={(e) => setPenerimaStatusFilter(e.target.value)}
                                className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#1A3D63] text-gray-600 bg-white"
                              >
                                <option value="Semua">Semua Status</option>
                                <option value="Aktif">Aktif</option>
                                <option value="Non-Aktif">Non-Aktif</option>
                              </select>
                            </div>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-white text-gray-400 font-bold text-[10px] tracking-wider border-b border-gray-100">
                                  <th className="py-4 px-5">NAMA SISWA</th>
                                  <th className="py-4 px-4 text-center">NIS</th>
                                  <th className="py-4 px-4 text-center">KELAS</th>
                                  <th className="py-4 px-5">PROGRAM BEASISWA</th>
                                  <th className="py-4 px-5">NOMINAL BANTUAN</th>
                                  <th className="py-4 px-4 text-center">PERIODE</th>
                                  <th className="py-4 px-4 text-center">STATUS</th>
                                  <th className="py-4 px-5 text-right">AKSI</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50 text-xs">
                                {(activeProgram.penerima?.length || 0) > 0 ? (
                                  (activeProgram.penerima || []).map((row, idx) => (
                                    <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                                      <td className="py-4 px-4 text-center text-gray-400 font-semibold text-xs">{idx + 1}</td>
                                      <td className="py-4 px-6 font-bold text-gray-800">{row.siswa_nama}</td>
                                      <td className="py-4 px-6">
                                        <span className="text-blue-500 bg-blue-50 px-2.5 py-1 rounded-md text-[10px] font-bold">{row.nama_kelas}</span>
                                      </td>
                                      <td className="py-4 px-6">
                                        <span className="text-[#137333] bg-[#E6F4EA] px-2.5 py-1 rounded-md text-[10px] font-bold">
                                          Rp {Number(row.nominal).toLocaleString('id-ID')}
                                        </span>
                                      </td>
                                      <td className="py-4 px-6 text-gray-600 font-medium">
                                        {row.periode}
                                      </td>
                                      <td className="py-4 px-6">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${row.status === 'Aktif' ? 'bg-[#E8FDF5] text-[#059669] border border-[#A7F3D0]' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                          {row.status}
                                        </span>
                                      </td>
                                      <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                          <button
                                            onClick={() => {
                                              setSelectedBeasiswa(row);
                                              setBeasiswaForm({
                                                siswaId: row.siswa_id,
                                                namaBeasiswa: row.nama_beasiswa,
                                                nominal: row.nominal,
                                                periode: row.periode || "2025/2026",
                                                status: row.status,
                                                tanggalMulai: row.tanggal_mulai ? new Date(row.tanggal_mulai).toISOString().split('T')[0] : "",
                                                tanggalSelesai: row.tanggal_selesai ? new Date(row.tanggal_selesai).toISOString().split('T')[0] : ""
                                              });
                                              setShowAddPenerimaModal(true);
                                            }}
                                            className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-blue-500 transition-colors cursor-pointer"
                                          >
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>
                                          </button>
                                          <button
                                            onClick={() => {
                                              setSelectedBeasiswa(row);
                                              setShowDeleteBeasiswaModal(true);
                                            }}
                                            className="w-8 h-8 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors cursor-pointer"
                                          >
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="6" className="py-16 text-center">
                                      <div className="text-sm font-semibold text-gray-400">Belum Ada Penerima Beasiswa</div>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}

          </div>
        );


      case "Monitor Tunggakan":
        return (
          <div className="flex flex-col gap-6 animate-fadeIn font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-[26px] font-bold text-gray-800 tracking-tight">Monitoring Tunggakan SPP</h1>
                <p className="text-sm text-gray-500 mt-1">Identifikasi siswa yang belum melunasi kewajiban pembayaran dan kirim tagihan ke Orang Tua.</p>
              </div>
              <div className="flex items-center gap-3">
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
                    <option value="2024/2025">Tahun Ajaran: 2024/2025</option>
                    <option value="2023/2024">Tahun Ajaran: 2023/2024</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#1A3D63] transition-colors">
                    <IconChevronDown />
                  </div>
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {[
                {
                  title: "Total Siswa Menunggak",
                  value: "6",
                  desc: "Mei 2026",
                  color: "border-l-4 border-l-[#EF4444]"
                },
                {
                  title: "Total Nominal Tunggakan",
                  value: "Rp 2.7 Jt",
                  desc: "Akumulasi",
                  color: "border-l-4 border-l-[#EF4444]"
                },
                {
                  title: "Sudah Ditagih",
                  value: "0/6",
                  desc: "Notifikasi terkirim",
                  color: "border-l-4 border-l-[#10B981]"
                },
                {
                  title: "Rata-rata Keterlambatan",
                  value: "1,5 Bln",
                  desc: "Per siswa",
                  color: "border-l-4 border-l-[#F59E0B]"
                }
              ].map((card, idx) => (
                <div key={idx} className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-sm ${card.color}`}>
                  <div className="text-[11px] font-bold text-gray-400 mb-2">{card.title}</div>
                  <div className="text-2xl sm:text-3xl font-black text-gray-800 mb-1">{card.value}</div>
                  <div className="text-xs text-gray-400 font-medium">{card.desc}</div>
                </div>
              ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  <div className="relative w-full sm:w-[280px]">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <IconSearch />
                    </div>
                    <input
                      type="text"
                      placeholder="Cari nama atau kelas..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] transition-all"
                    />
                  </div>
                  <div className="flex bg-gray-50 border border-gray-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                    {["Semua", "Kritikal", "Menengah", "Ringan"].map((tab, idx) => (
                      <button
                        key={tab}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-none whitespace-nowrap ${idx === 0
                          ? "bg-[#1A3D63] text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-900 bg-transparent"
                          }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => triggerToast("Mengekspor data tunggakan...")}
                  className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all w-full sm:w-auto"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  Export Data
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="p-4 pl-5">NAMA SISWA</th>
                      <th className="p-4">KELAS</th>
                      <th className="p-4">JML BULAN</th>
                      <th className="p-4">TOTAL TUNGGAKAN</th>
                      <th className="p-4">STATUS</th>
                      <th className="p-4 pr-5">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {[
                      { id: "T-001", name: "Budi Prasetyo", class: "Kelas VIIIA", months: "2 Bulan", total: "Rp 550.000", status: "Kritikal" },
                      { id: "T-002", name: "Danu Pratama", class: "Kelas IXA", months: "1 Bulan", total: "Rp 300.000", status: "Menengah" },
                      { id: "T-003", name: "Rizky Ramadhan", class: "Kelas VIIB", months: "3 Bulan", total: "Rp 750.000", status: "Kritikal" },
                      { id: "T-004", name: "Siti Sarah", class: "Kelas VIIA", months: "1 Bulan", total: "Rp 250.000", status: "Ringan" },
                      { id: "T-005", name: "Gani Wijaya", class: "Kelas VIIIB", months: "2 Bulan", total: "Rp 550.000", status: "Menengah" },
                      { id: "T-006", name: "Maya Sari", class: "Kelas IXB", months: "1 Bulan", total: "Rp 300.000", status: "Ringan" }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 pl-5">
                          <div className="font-bold text-gray-800">{row.name}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">ID: {row.id}</div>
                        </td>
                        <td className="p-4">
                          <span className="bg-[#EFF6FF] text-[#3B82F6] font-bold px-2.5 py-1 rounded-md text-[10px]">
                            {row.class?.replace('Kelas ', '')?.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                            {row.months}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-[#EF4444]">{row.total}</td>
                        <td className="p-4">
                          <span className={`font-bold px-2.5 py-1 rounded-md text-[10px] inline-block ${row.status === 'Kritikal' ? 'bg-[#FEE2E2] text-[#EF4444]' :
                            row.status === 'Menengah' ? 'bg-[#FEF3C7] text-[#D97706]' :
                              'bg-gray-100 text-gray-500'
                            }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="p-4 pr-5">
                          <button
                            onClick={() => triggerToast(`Mengirim tagihan ke ${row.name}...`)}
                            className="bg-[#1A3D63] hover:bg-[#122A44] text-white font-bold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer border-none flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                          >
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
                            Tagih
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "Komponen Gaji":
        return (
          <div className="flex flex-col gap-6 animate-fadeIn font-sans">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-[26px] font-bold text-gray-800 tracking-tight">Kelola Komponen Gaji</h1>
                <p className="text-sm text-gray-500 mt-1">Konfigurasi pendapatan, tunjangan, dan potongan gaji pegawai.</p>
              </div>
              <div className="flex items-center gap-3">
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
                    <option value="2024/2025">Tahun Ajaran: 2024/2025</option>
                    <option value="2023/2024">Tahun Ajaran: 2023/2024</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#1A3D63] transition-colors">
                    <IconChevronDown />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedKomponen(null);
                    setEditKomponenForm({ name: "", category: "Pendapatan", type: "Bulanan", nominal: "", status: "Aktif" });
                    setShowEditKomponenModal(true);
                  }}
                  className="flex items-center gap-1.5 bg-[#1A3D63] hover:bg-[#122A44] text-white border-none rounded-xl px-4 sm:px-5 py-2.5 text-xs sm:text-[13px] font-bold cursor-pointer transition-all shadow-sm active:scale-95"
                >
                  <IconPlus /> Tambah Komponen
                </button>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Card Pendapatan */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-[#10B981] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center font-bold text-xl">
                  +
                </div>
                <div>
                  <div className="text-[11px] font-bold text-gray-400 mb-1 uppercase tracking-wide">Total Pendapatan</div>
                  <div className="text-xl sm:text-2xl font-black text-gray-800">12 Komponen</div>
                </div>
              </div>

              {/* Card Potongan */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-[#EF4444] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-1.624 11.368A2.25 2.25 0 0 1 15.648 21H8.352a2.25 2.25 0 0 1-2.228-1.382L4.5 8.25M14.25 12v4.5m-4.5-4.5v4.5M10.5 4.5h3m-6 0a2.25 2.25 0 0 1 2.25-2.25h1.5A2.25 2.25 0 0 1 13.5 4.5m-6 0h9" /></svg>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-gray-400 mb-1 uppercase tracking-wide">Total Potongan</div>
                  <div className="text-xl sm:text-2xl font-black text-gray-800">5 Komponen</div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="relative w-full sm:w-[320px]">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <IconSearch />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari nama komponen..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs sm:text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] transition-all"
                  />
                </div>

                <button
                  onClick={() => triggerToast("Membuka pengaturan rumus gaji...")}
                  className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all w-full sm:w-auto"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.99l1.005.828c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  Rumus Gaji
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="p-4 pl-5">NAMA KOMPONEN</th>
                      <th className="p-4">KATEGORI</th>
                      <th className="p-4">TIPE</th>
                      <th className="p-4">NOMINAL STANDAR</th>
                      <th className="p-4">STATUS</th>
                      <th className="p-4 pr-5 text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {komponenGajiList.length > 0 ? (
                      komponenGajiList.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 pl-5 flex items-center gap-3">
                            <div className="text-gray-400">
                              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>
                            </div>
                            <span className="font-bold text-gray-800">{row.nama}</span>
                          </td>
                          <td className="p-4">
                            <span className={`font-bold px-2.5 py-1 rounded-md text-[10px] inline-block ${row.tipe !== 'potongan' ? 'bg-[#E6F4EA] text-[#10B981]' : 'bg-[#FEE2E2] text-[#EF4444]'
                              }`}>
                              {row.tipe !== 'potongan' ? 'Pendapatan' : 'Potongan'}
                            </span>
                          </td>
                          <td className="p-4 text-gray-500 font-medium">
                            {row.formula_tipe === 'flat' ? 'Bulanan' :
                              row.formula_tipe === 'per_hari_hadir' ? 'Harian' :
                                row.formula_tipe === 'persen_gaji_pokok' ? 'Persentase' : row.formula_tipe}
                          </td>
                          <td className="p-4 font-bold text-gray-800">
                            {row.formula_tipe === 'persen_gaji_pokok' ? `${row.nilai_satuan}%` :
                              row.nominal_default > 0 ? `Rp ${parseInt(row.nominal_default).toLocaleString('id-ID')}` : 'Varies'}
                          </td>
                          <td className="p-4">
                            <span className="text-[#3B82F6] font-bold text-[11px]">{row.is_aktif ? "Aktif" : "Non-Aktif"}</span>
                          </td>
                          <td className="p-4 pr-5">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedKomponen(row);
                                  setEditKomponenForm({
                                    name: row.nama,
                                    category: row.tipe !== 'potongan' ? 'Pendapatan' : 'Potongan',
                                    type: row.formula_tipe === 'flat' ? 'Bulanan' :
                                      row.formula_tipe === 'per_hari_hadir' ? 'Harian' :
                                        row.formula_tipe === 'persen_gaji_pokok' ? 'Persentase' : 'Bulanan',
                                    nominal: row.formula_tipe === 'persen_gaji_pokok' ? row.nilai_satuan : row.nominal_default,
                                    status: row.is_aktif ? "Aktif" : "Non-Aktif"
                                  });
                                  setShowEditKomponenModal(true);
                                }}
                                className="text-[#3B82F6] hover:bg-blue-50 p-1.5 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                                title="Edit Komponen"
                              >
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedKomponen({ ...row, name: row.nama, category: row.tipe !== 'potongan' ? 'Pendapatan' : 'Potongan', nominal: row.formula_tipe === 'persen_gaji_pokok' ? `${row.nilai_satuan}%` : `Rp ${parseInt(row.nominal_default).toLocaleString('id-ID')}` });
                                  setShowDeleteKomponenModal(true);
                                }}
                                className="text-[#EF4444] hover:bg-red-50 p-1.5 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                                title="Hapus Komponen"
                              >
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-gray-400 font-medium">Belum ada komponen gaji</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "Generate Slip Gaji":
        return (
          <div className="flex flex-col gap-6 animate-fadeIn font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-[26px] font-bold text-gray-800 tracking-tight">Generate Slip Gaji</h1>
                <p className="text-sm text-gray-500 mt-1">Generate dan kelola slip gaji bulanan guru &amp; karyawan.</p>
              </div>
              <button
                onClick={() => triggerToast("Generate masal seluruh slip gaji Guru & Karyawan...")}
                className="flex items-center gap-1.5 bg-[#1A3D63] hover:bg-[#122A44] text-white border-none rounded-xl px-4 sm:px-5 py-2.5 text-xs sm:text-[13px] font-bold cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                <IconPlus /> Generate Semua Slip
              </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Pegawai", value: "6", accent: "border-l-4 border-l-[#6366F1]", iconBg: "bg-indigo-50 text-indigo-500" },
                { label: "Slip Sudah Generate", value: "4", accent: "border-l-4 border-l-[#10B981]", iconBg: "bg-green-50 text-green-500" },
                { label: "Belum Generate", value: "2", accent: "border-l-4 border-l-[#EF4444]", iconBg: "bg-red-50 text-red-500" },
                { label: "Total Payroll", value: "Rp 20.335.000", accent: "border-l-4 border-l-[#3B82F6]", iconBg: "bg-blue-50 text-blue-500" }
              ].map((card, idx) => (
                <div key={idx} className={`bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm ${card.accent} flex items-center gap-3`}>
                  <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0 text-lg font-bold`}>
                    {idx === 0 && <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
                    {idx === 1 && <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
                    {idx === 2 && <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>}
                    {idx === 3 && <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>}
                  </div>
                  <div>
                    <div className="text-[20px] sm:text-2xl font-black text-gray-800 leading-none">{card.value}</div>
                    <div className="text-[11px] text-gray-400 font-medium mt-0.5">{card.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">Periode Gaji:</span>
                  <div className="relative">
                    <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none appearance-none pr-7 font-semibold">
                      <option>Mei 2026</option>
                      <option>April 2026</option>
                      <option>Maret 2026</option>
                    </select>
                    <span className="absolute right-2 top-2 text-gray-400 pointer-events-none"><IconChevronDown /></span>
                  </div>
                </div>
                <span className="bg-[#E6F4EA] text-[#059669] font-bold px-3 py-1 rounded-full text-[11px]">3 sudah transfer</span>
                <span className="bg-[#FEF3C7] text-[#D97706] font-bold px-3 py-1 rounded-full text-[11px]">1 pending</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/60 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="p-4 pl-5">NIP</th>
                      <th className="p-4">NAMA PEGAWAI</th>
                      <th className="p-4">JABATAN</th>
                      <th className="p-4">GAJI BERSIH</th>
                      <th className="p-4">STATUS SLIP</th>
                      <th className="p-4">STATUS BAYAR</th>
                      <th className="p-4 pr-5 text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {[
                      { nip: "1980001", name: "Andi Susanto, S.Pd", role: "Guru Matematika", salary: "Rp 4.105.500", slipStatus: "Sudah Generate", payStatus: "Sudah Transfer" },
                      { nip: "1985002", name: "Maya Putri, M.Pd", role: "Guru B. Indonesia", salary: "Rp 3.720.000", slipStatus: "Sudah Generate", payStatus: "Sudah Transfer" },
                      { nip: "1990003", name: "Hendro Wibowo", role: "Staff TU", salary: "Rp 2.408.500", slipStatus: "Sudah Generate", payStatus: "Pending" },
                      { nip: "1982004", name: "Lina Sari, S.Kom", role: "Guru TIK", salary: "Rp 3.085.000", slipStatus: "Belum Generate", payStatus: "none" },
                      { nip: "1978005", name: "Rini Astuti, S.Si", role: "Guru Kimia", salary: "Rp 4.320.000", slipStatus: "Sudah Generate", payStatus: "Sudah Transfer" },
                      { nip: "1995006", name: "Doni Prasetya", role: "Guru Olahraga", salary: "Rp 2.696.000", slipStatus: "Belum Generate", payStatus: "none" }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 pl-5 font-mono text-gray-400 text-[11px]">{row.nip}</td>
                        <td className="p-4 font-bold text-gray-800">{row.name}</td>
                        <td className="p-4 text-gray-500">{row.role}</td>
                        <td className="p-4 font-bold text-[#1A3D63]">{row.salary}</td>
                        <td className="p-4">
                          <span className={`font-bold px-2.5 py-1 rounded-md text-[10px] inline-block ${row.slipStatus === "Sudah Generate" ? "bg-[#E6F4EA] text-[#059669]" : "bg-[#FEE2E2] text-[#EF4444]"}`}>
                            {row.slipStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          {row.payStatus === "none" ? (
                            <span className="text-gray-300 font-bold text-base">â€”</span>
                          ) : (
                            <span className={`font-bold px-2.5 py-1 rounded-md text-[10px] inline-block ${row.payStatus === "Sudah Transfer" ? "bg-[#E6F4EA] text-[#059669]" : "bg-[#FEF3C7] text-[#D97706]"}`}>
                              {row.payStatus}
                            </span>
                          )}
                        </td>
                        <td className="p-4 pr-5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => triggerToast(`Preview slip gaji ${row.name}`)} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-lg border-none bg-transparent cursor-pointer transition-colors" title="Preview">
                              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                            </button>
                            <button onClick={() => triggerToast(`Mengunduh slip gaji ${row.name}...`)} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-lg border-none bg-transparent cursor-pointer transition-colors" title="Download">
                              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                            </button>
                            {row.slipStatus === "Belum Generate" && (
                              <button onClick={() => triggerToast(`Generate slip gaji ${row.name}...`)} className="bg-[#1A3D63] hover:bg-[#122A44] text-white p-1.5 rounded-lg border-none cursor-pointer transition-all active:scale-95 shadow-sm" title="Generate Slip">
                                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "Status Bayar Gaji":
        const statusBayarData = [
          { name: "Andi Susanto, S.Pd", role: "Guru Matematika", salary: "Rp 4.250.000", status: "Sudah Dibayar", date: "25 Mei 2026", bank: "BCA" },
          { name: "Maya Putri, M.Pd", role: "Guru Bahasa Indo", salary: "Rp 3.800.000", status: "Sudah Dibayar", date: "25 Mei 2026", bank: "Mandiri" },
          { name: "Hendro Wibowo", role: "Staff TU", salary: "Rp 2.500.000", status: "Proses Transfer", date: "â€”", bank: "BCA" },
          { name: "Lina Sari, S.Kom", role: "Guru TIK", salary: "Rp 3.200.000", status: "Belum Diproses", date: "â€”", bank: "BRI" },
          { name: "Dr. Hendra Wijaya", role: "Kepala Sekolah", salary: "Rp 7.500.000", status: "Sudah Dibayar", date: "24 Mei 2026", bank: "BCA" }
        ];

        return (
          <div className="flex flex-col gap-6 animate-fadeIn font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-[26px] font-bold text-gray-800 tracking-tight">Status Pembayaran Gaji</h1>
                <p className="text-sm text-gray-500 mt-1">Monitoring status real-time pembayaran gaji guru dan karyawan.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative group w-full sm:w-auto">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#1A3D63] transition-colors">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" /></svg>
                  </div>
                  <select
                    className="w-full flex items-center gap-2 bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-[13px] font-bold text-gray-700 cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all"
                  >
                    <option value="2025/2026">Tahun Ajaran: 2025/2026</option>
                    <option value="2024/2025">Tahun Ajaran: 2024/2025</option>
                    <option value="2023/2024">Tahun Ajaran: 2023/2024</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#1A3D63] transition-colors">
                    <IconChevronDown />
                  </div>
                </div>
                <button
                  onClick={() => triggerToast("Review semua pembayaran...")}
                  className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 rounded-xl px-4 py-2.5 text-xs sm:text-[13px] font-bold cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <IconPlus /> Review Semua
                </button>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "TOTAL PEGAWAI", value: "87", accent: "border-t-[#1A3D63]", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>, iconColor: "text-gray-400" },
                { label: "SUDAH TERBAYAR", value: "62", accent: "border-t-[#10B981]", icon: <IconCheckCircle />, iconColor: "text-[#10B981]" },
                { label: "PROSES TRANSFER", value: "15", accent: "border-t-[#3B82F6]", icon: <IconClock />, iconColor: "text-[#3B82F6]" },
                { label: "BELUM DIPROSES", value: "10", accent: "border-t-[#EF4444]", icon: <IconAlertCircle />, iconColor: "text-[#EF4444]" }
              ].map((card, idx) => (
                <div key={idx} className={`bg-white rounded-[20px] border border-gray-100 p-5 shadow-sm border-t-[3px] ${card.accent} flex flex-col justify-between h-[104px]`}>
                  <div className="flex justify-between items-start">
                    <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{card.label}</div>
                    <div className={`${card.iconColor}`}>{card.icon}</div>
                  </div>
                  <div className="text-3xl font-black text-gray-800 leading-none">{card.value}</div>
                </div>
              ))}
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="relative w-full sm:w-[320px]">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <IconSearch />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari nama pegawai..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-xs sm:text-[13px] focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20 transition-all font-medium"
                  />
                </div>
                <button
                  onClick={() => triggerToast("Mencetak daftar pembayaran...")}
                  className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <IconPrinter /> Cetak Daftar
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="py-4 px-4 font-semibold bg-gray-50/50 rounded-tl-xl">NAMA PEGAWAI</th>
                      <th className="py-4 px-4 font-semibold bg-gray-50/50">JABATAN</th>
                      <th className="py-4 px-4 font-semibold bg-gray-50/50">TOTAL GAJI</th>
                      <th className="py-4 px-4 font-semibold bg-gray-50/50">STATUS</th>
                      <th className="py-4 px-4 font-semibold bg-gray-50/50">TGL BAYAR</th>
                      <th className="py-4 px-4 font-semibold bg-gray-50/50">BANK</th>
                      <th className="py-4 px-4 font-semibold bg-gray-50/50 rounded-tr-xl text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {statusBayarData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-gray-800">{row.name}</td>
                        <td className="py-4 px-4 text-gray-500 font-medium">{row.role}</td>
                        <td className="py-4 px-4 font-bold text-gray-800">{row.salary}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${row.status === 'Sudah Dibayar' ? 'bg-[#E6F4EA] text-[#059669]' :
                            row.status === 'Proses Transfer' ? 'bg-blue-50 text-blue-600' :
                              'bg-[#FEE2E2] text-[#EF4444]'
                            }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-500 font-medium">{row.date}</td>
                        <td className="py-4 px-4 text-gray-500 font-medium">{row.bank}</td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedDetailGaji(row);
                              setShowDetailGajiModal(true);
                            }}
                            className="inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-700 font-bold bg-transparent border-none cursor-pointer text-[11px] sm:text-xs transition-colors"
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "Transfer Gaji":
        return (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Gerbang Transfer Gaji Host-to-Host (H2H)</h2>
            <p className="text-sm text-gray-500 mb-6">Integrasi API Bank untuk transfer dana gaji massal secara instan sekali klik.</p>

            <div className="border border-yellow-100 rounded-xl p-5 bg-yellow-50/30 mb-6">
              <h3 className="text-xs font-bold text-yellow-700 uppercase mb-2">Verifikasi Transaksi</h3>
              <p className="text-xs text-yellow-600 leading-relaxed mb-4">
                Terdapat <strong>1 staf/guru</strong> yang status gajinya masih "Pending" (belum dikirim) senilai total <strong>Rp 3.150.000</strong>.
              </p>
              <button
                onClick={() => triggerToast("Mengirimkan instruksi transfer massal via API H2H Bank...")}
                className="bg-[#1A3D63] hover:bg-[#122A44] text-white px-5 py-2.5 rounded-lg border-none font-bold text-xs cursor-pointer transition-all shadow-md active:scale-95"
              >
                Eksekusi Transfer Massal Sekarang (API Bank)
              </button>
            </div>

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Konektivitas Bank Partner</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 border border-gray-100 rounded-xl flex items-center justify-between">
                <span className="font-bold text-gray-700">Bank Mandiri H2H</span>
                <span className="text-green-500 font-bold">Terhubung</span>
              </div>
              <div className="p-4 border border-gray-100 rounded-xl flex items-center justify-between">
                <span className="font-bold text-gray-700">BCA Enterprise API</span>
                <span className="text-green-500 font-bold">Terhubung</span>
              </div>
              <div className="p-4 border border-gray-100 rounded-xl flex items-center justify-between">
                <span className="font-bold text-gray-700">BNI Direct Connect</span>
                <span className="text-gray-400 font-bold">Tidak Terhubung</span>
              </div>
            </div>
          </div>
        );

      case "Cetak Laporan Keuangan":
        return (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Cetak Laporan Keuangan &amp; Akuntansi</h2>
            <p className="text-sm text-gray-500 mb-6">Pilih jenis laporan dan periode pembukuan untuk dicetak atau diekspor.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">Jenis Laporan</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
                    <option>Laporan Buku Jurnal Kas Masuk (SPP)</option>
                    <option>Laporan Pengeluaran Operasional Sekolah</option>
                    <option>Laporan Arus Kas (Cash Flow)</option>
                    <option>Laporan Laba Rugi Sekolah</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">Periode</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
                    <option>Mei 2026 (Berjalan)</option>
                    <option>April 2026</option>
                    <option>Triwulan I 2026</option>
                    <option>Tahunan 2025</option>
                  </select>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xs font-bold text-gray-700 mb-2">Ringkasan Pratinjau</h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Mencakup ringkasan data transaksi kas terkumpul sebesar <strong>Rp 16,1 Jt</strong> dari modul SPP, serta total pengeluaran payroll gaji senilai <strong>Rp 13,5 Jt</strong>.
                  </p>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => triggerToast("Mengirimkan file cetak ke printer partner...")}
                    className="flex-1 bg-[#1A3D63] hover:bg-[#122A44] text-white py-2 rounded-lg font-bold text-xs border-none cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <IconPrinter /> Cetak Fisik
                  </button>
                  <button
                    onClick={() => triggerToast("Mengunduh ekspor laporan PDF...")}
                    className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white py-2 rounded-lg font-bold text-xs border-none cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        // Default Overview Dashboard Bendahara
        return (
          <div className="flex flex-col gap-5 sm:gap-6 pb-10 animate-fadeIn">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-[26px] font-bold text-gray-800 tracking-tight">Dashboard Bendahara</h1>
                <p className="text-sm text-gray-500 mt-1">Monitor keuangan sekolah, SPP siswa, dan penggajian guru & staf.</p>
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
                    <option value="2024/2025">Tahun Ajaran: 2024/2025</option>
                    <option value="2023/2024">Tahun Ajaran: 2023/2024</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#1A3D63] transition-colors">
                    <IconChevronDown />
                  </div>
                </div>

                
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {[
                {
                  title: "Total SPP Terkumpul",
                  value: "Rp 16,1 Jt",
                  subText: "Bulan Mei 2026",
                  trend: "+8.5% vs bulan lalu",
                  trendUp: true,
                  bgIcon: "bg-green-50 text-green-600",
                  icon: <IconDollar />
                },
                {
                  title: "Siswa Lunas SPP",
                  value: "24",
                  subText: "dari 34 siswa aktif",
                  trend: "70.6% tingkat pembayaran",
                  trendUp: true,
                  bgIcon: "bg-blue-50 text-blue-600",
                  icon: <IconCheckCircle />
                },
                {
                  title: "Tunggakan SPP",
                  value: "Rp 2,75 Jt",
                  subText: "10 siswa belum bayar",
                  trend: "-5.2% vs bulan lalu",
                  trendUp: false,
                  bgIcon: "bg-red-50 text-red-600",
                  icon: <IconAlertCircle />
                },
                {
                  title: "Penggajian Bulan Ini",
                  value: "Rp 13,5 Jt",
                  subText: "6 guru & staf",
                  trend: "83% sudah transfer",
                  trendUp: true,
                  bgIcon: "bg-purple-50 text-purple-600",
                  icon: <IconClock />
                }
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-[20px] border border-gray-50 p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{card.title}</span>
                    <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${card.bgIcon}`}>
                      {card.icon}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-[28px] font-black text-gray-800 leading-none mb-2">{card.value}</div>
                    <div className="text-[11px] font-bold text-gray-400 mb-3">{card.subText}</div>
                    <div className={`flex items-center gap-1 text-[11px] font-bold ${card.trendUp ? "text-green-500" : "text-red-500"}`}>
                      {card.trendUp ? <IconTrendUp /> : <IconTrendDown />}
                      <span>{card.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left Bar Chart */}
              <div className="lg:col-span-2 bg-white rounded-[24px] border border-gray-50 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Rekapitulasi SPP Per Bulan</h3>
                    <p className="text-[11px] text-gray-400">Jumlah siswa lunas vs belum bayar</p>
                  </div>
                  <button
                    onClick={() => triggerToast("Mengunduh detil rekapitulasi iuran bulanan...")}
                    className="text-xs font-bold text-[#1A3D63] hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Selengkapnya
                  </button>
                </div>
                <div className="h-[230px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sppRecapData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} domain={[0, 34]} ticks={[0, 10, 20, 34]} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                      <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                      <Bar dataKey="Lunas" fill="#1A3D63" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar dataKey="Belum" fill="#FF8E8D" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Donut Chart */}
              <div className="lg:col-span-1 bg-white rounded-[24px] border border-gray-50 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-0.5">Status SPP Siswa</h3>
                  <p className="text-[11px] text-gray-400">Distribusi pembayaran bulan ini</p>
                </div>

                <div className="relative flex items-center justify-center h-[160px] my-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sppDonutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {sppDonutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-gray-800">70.6%</span>
                    <span className="text-[10px] font-bold text-gray-400">Lunas</span>
                  </div>
                </div>

                <div className="flex justify-center gap-4 text-[10px] font-bold text-gray-500">
                  {sppDonutData.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: d.fill }} />
                      <span>{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left Table: Pembayaran SPP Terbaru */}
              <div className="bg-white rounded-[24px] border border-gray-50 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-sm font-bold text-gray-800">Pembayaran SPP Terbaru</h3>
                  <button
                    onClick={() => triggerToast("Membuka riwayat lengkap pembayaran SPP...")}
                    className="text-xs font-bold text-[#1A3D63] hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1"
                  >
                    Lihat Semua <span className="font-bold">→</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                        <th className="pb-3">NAMA SISWA</th>
                        <th className="pb-3">KELAS</th>
                        <th className="pb-3">NOMINAL</th>
                        <th className="pb-3">PERIODE</th>
                        <th className="pb-3 text-right">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs">
                      {sppPayments.slice(0, 3).map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 font-bold text-gray-800">{row.name}</td>
                          <td className="py-3 text-gray-500">{row.class?.replace('Kelas ', '')?.replace('-', ' ')}</td>
                          <td className="py-3 font-bold text-gray-700">{row.amount}</td>
                          <td className="py-3 text-gray-400">{row.period}</td>
                          <td className="py-3 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold inline-block ${row.status === "Lunas" ? "bg-green-50 text-green-600" :
                              row.status === "Cicilan" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                              }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Table: Status Penggajian Guru & Staf */}
              <div className="bg-white rounded-[24px] border border-gray-50 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-sm font-bold text-gray-800">Status Penggajian Guru &amp; Staf</h3>
                  <button
                    onClick={() => triggerToast("Mengarahkan ke modul Generate Slip Gaji...")}
                    className="text-xs font-bold text-[#1A3D63] hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1"
                  >
                    Generate Slip <span className="font-bold">→</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                        <th className="pb-3">NAMA</th>
                        <th className="pb-3">JABATAN</th>
                        <th className="pb-3">GAJI BERSIH</th>
                        <th className="pb-3 text-right">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs">
                      {payrollMockData.slice(0, 3).map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 font-bold text-gray-800">{row.name}</td>
                          <td className="py-3 text-gray-500">{row.role}</td>
                          <td className="py-3 font-bold text-gray-700">{row.salary}</td>
                          <td className="py-3 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold inline-block ${row.status === "Sudah Transfer" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
                              }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#F3F4F6] min-h-screen relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 z-[999] bg-[#1A3D63] text-white px-5 py-3 rounded-xl shadow-lg border border-white/10 font-sans text-xs font-semibold flex items-center gap-2 animate-slideIn">
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Render Submenu or Main Dashboard */}
      {renderContent()}

      {/* Billing Modal Dialog */}
      {showBillingModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowBillingModal(false)}
          />
          {/* Content */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full relative z-10 shadow-2xl animate-scaleUp border border-gray-100 font-sans">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Generate Tagihan SPP Massal</h3>
            <p className="text-xs text-gray-400 mb-6">Pilih target kelas dan isikan parameter jatuh tempo tagihan.</p>

            <form onSubmit={handleGenerateBilling} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">Sasaran Kelas</label>
                <select
                  value={billClass}
                  onChange={(e) => setBillClass(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none"
                >
                  <option>Semua Kelas (Aktif)</option>
                  <option>Tingkat 7 (Siswa Baru)</option>
                  <option>Tingkat 8</option>
                  <option>Tingkat 9</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">Nominal Tagihan (Rupiah)</label>
                <input
                  type="number"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-[#1A3D63]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">Batas Jatuh Tempo</label>
                <input
                  type="date"
                  value={billDueDate}
                  onChange={(e) => setBillDueDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-[#1A3D63]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBillingModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-xs font-bold cursor-pointer border-none"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#1A3D63] hover:bg-[#122A44] text-white py-3 rounded-xl text-xs font-bold cursor-pointer border-none shadow-md transition-all active:scale-[0.98]"
                >
                  Rilis Tagihan SPP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit SPP - handled inline, no modal needed */}

      {/* Generate Month Modal Dialog */}
      {showGenerateMonthModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowGenerateMonthModal(false)}
          />
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-[480px] w-full relative z-10 shadow-2xl animate-scaleUp font-sans">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#1e293b]">Generate Tagihan SPP</h3>
              <p className="text-[13px] text-gray-400 mt-1">Buat tagihan SPP bulanan untuk semua siswa</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Bulan</label>
                <select
                  value={generateForm.bulan}
                  onChange={(e) => setGenerateForm({ ...generateForm, bulan: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] text-gray-700 focus:outline-none focus:border-[#1A3D63] appearance-none"
                >
                  {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((m, i) => (
                    <option key={i + 1} value={String(i + 1)}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Tahun</label>
                <input
                  type="number"
                  value={generateForm.tahun}
                  onChange={(e) => setGenerateForm({ ...generateForm, tahun: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] text-gray-800 focus:outline-none focus:border-[#1A3D63]"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Jatuh Tempo</label>
              <input
                type="date"
                value={generateForm.jatuh_tempo}
                onChange={(e) => setGenerateForm({ ...generateForm, jatuh_tempo: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] text-gray-800 focus:outline-none focus:border-[#1A3D63]"
              />
            </div>

            <div className="bg-[#FFFDF5] border border-[#FEF3C7] rounded-xl p-4 flex gap-3 mb-6">
              <div className="text-[#F59E0B] flex-shrink-0 mt-0.5">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-[13px] text-[#B45309] leading-relaxed">
                Sistem akan membuat tagihan untuk <strong>semua siswa aktif</strong>. Tagihan yang sudah ada di bulan yang sama akan dilewati (skip).
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowGenerateMonthModal(false)}
                disabled={isGenerating}
                className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 py-3 rounded-xl text-[13px] font-bold cursor-pointer transition-all"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  if (!generateForm.bulan || !generateForm.tahun) {
                    triggerToast('Bulan dan tahun wajib diisi');
                    return;
                  }
                  setIsGenerating(true);
                  try {
                    const result = await generateTagihanBulanan({
                      bulan: parseInt(generateForm.bulan),
                      tahun: parseInt(generateForm.tahun),
                      jatuh_tempo: generateForm.jatuh_tempo
                    });
                    setShowGenerateMonthModal(false);
                    triggerToast(`Berhasil generate ${result.generated ?? ''} tagihan SPP!`);
                    loadTagihan();
                  } catch (e) {
                    console.error(e);
                    const msg = e?.response?.data?.message || 'Gagal generate tagihan';
                    triggerToast(msg);
                  } finally {
                    setIsGenerating(false);
                  }
                }}
                disabled={isGenerating}
                className="flex-1 bg-[#1e293b] hover:bg-[#0f172a] text-white py-3 rounded-xl text-[13px] font-bold cursor-pointer border-none shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                    Generating...
                  </>
                ) : 'Konfirmasi Generate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddProgramModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 md:p-10">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCancelProgram} />
          <div className="bg-white rounded-[24px] p-5 sm:p-6 max-w-2xl w-full relative z-10 shadow-2xl animate-scaleUp font-sans border border-gray-100 flex flex-col max-h-[calc(100vh-100px)]">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h2 className="text-lg font-bold text-gray-800">Tambah Program Baru</h2>
              <button onClick={handleCancelProgram} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer border-none">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="overflow-y-auto overflow-x-hidden pr-2 flex-1 scrollbar-hide">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Program <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newProgramForm.nama}
                      onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, nama: e.target.value }) }}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400"
                      placeholder="Contoh: Beasiswa Prestasi"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Kategori Beasiswa <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        value={newProgramForm.kategori}
                        onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, kategori: e.target.value }) }}
                        className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 appearance-none transition-all cursor-pointer"
                      >
                        <option value="" disabled>Pilih Kategori</option>
                        <option value="Dhuafa/Kurang Mampu">Dhuafa/Kurang Mampu</option>
                        <option value="Yatim/Piatu">Yatim/Piatu</option>
                        <option value="Prestasi Akademik">Prestasi Akademik</option>
                        <option value="Prestasi Non-Akademik">Prestasi Non-Akademik</option>
                        <option value="Tahfidz">Tahfidz</option>
                        <option value="Beasiswa Khusus">Beasiswa Khusus</option>
                      </select>
                      <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"><IconChevronDown /></span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sumber Dana <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        value={newProgramForm.sumberDana}
                        onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, sumberDana: e.target.value }) }}
                        className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 appearance-none transition-all cursor-pointer"
                      >
                        <option value="" disabled>Pilih Sumber</option>
                        <option value="Lazismu">Lazismu</option>
                        <option value="Sekolah">Sekolah</option>
                        <option value="Donatur">Donatur</option>
                        <option value="Alumni">Alumni</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                      <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"><IconChevronDown /></span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nominal Bantuan <span className="text-red-500">*</span></label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-gray-500 font-bold text-sm pointer-events-none">Rp</span>
                      <input
                        type="text"
                        value={newProgramForm.nominal}
                        onChange={(e) => { 
                          setIsProgramFormDirty(true); 
                          setIsDanaFormDirty(true);
                        let val = e.target.value.replace(/[^0-9]/g, '');
                          if (val) val = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(val);
                          setNewProgramForm({ ...newProgramForm, nominal: val });
                        }}
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400"
                        placeholder="250.000"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Kuota Penerima</label>
                    <input
                      type="number"
                      value={newProgramForm.kuota}
                      onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, kuota: e.target.value }) }}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400"
                      placeholder="Contoh: 50"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tahun Ajaran <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        value={newProgramForm.tahunAjaran}
                        onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, tahunAjaran: e.target.value }) }}
                        className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 appearance-none transition-all cursor-pointer"
                      >
                        <option value="2025/2026">2025/2026</option>
                        <option value="2024/2025">2024/2025</option>
                      </select>
                      <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"><IconChevronDown /></span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Periode Pendaftaran <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={newProgramForm.tanggalMulaiDaftar}
                        onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, tanggalMulaiDaftar: e.target.value }) }}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all"
                      />
                      <span className="text-gray-400 text-sm font-bold">-</span>
                      <input
                        type="date"
                        value={newProgramForm.tanggalSelesaiDaftar}
                        onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, tanggalSelesaiDaftar: e.target.value }) }}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Status Program</label>
                    <div className="relative">
                      <select
                        value={newProgramForm.status}
                        onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, status: e.target.value }) }}
                        className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 appearance-none transition-all cursor-pointer"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Nonaktif">Nonaktif</option>
                      </select>
                      <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"><IconChevronDown /></span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Deskripsi Program</label>
                  <textarea
                    value={newProgramForm.deskripsi}
                    onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, deskripsi: e.target.value }) }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400 resize-none min-h-[80px]"
                    placeholder="Contoh: Program beasiswa ini ditujukan untuk siswa berprestasi yang berasal dari keluarga kurang mampu guna meringankan biaya pendidikan."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Persyaratan Khusus</label>
                  <textarea
                    value={newProgramForm.persyaratan}
                    onChange={(e) => { setIsProgramFormDirty(true); setNewProgramForm({ ...newProgramForm, persyaratan: e.target.value }) }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400 resize-none min-h-[80px]"
                    placeholder="Contoh: siswa aktif MBS Prambanan, berasal dari keluarga kurang mampu, melampirkan surat keterangan tidak mampu atau dokumen pendukung, tidak memiliki pelanggaran disiplin berat, dan bersedia mengikuti proses verifikasi sekolah."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-gray-100 flex justify-end gap-3 shrink-0">
              <button onClick={handleCancelProgram} className="px-5 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent">Batal</button>
              <button onClick={handleSaveProgram} className="bg-[#1A3D63] hover:bg-[#122A44] text-white py-2 px-6 rounded-xl text-sm font-bold cursor-pointer border-none shadow-md transition-all active:scale-95 flex items-center gap-2">
                Simpan Program
              </button>
            </div>
          </div>
        </div>
      )}

      
      {showDeleteProgramConfirmModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteProgramConfirmModal(false)} />
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-xl animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-4">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Program Beasiswa?</h3>
            <p className="text-sm text-gray-600 mb-6">Apakah Anda yakin ingin menghapus program beasiswa ini? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteProgramConfirmModal(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors">Batal</button>
              <button onClick={executeDeleteProgram} className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm">Ya, Hapus Program</button>
            </div>
          </div>
        </div>
      )}
{showProgramCancelConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowProgramCancelConfirm(false)} />
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-xl animate-scaleUp">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Batalkan Perubahan?</h3>
            <p className="text-sm text-gray-600 mb-6">Data yang sudah Anda isi belum disimpan dan akan hilang. Apakah Anda yakin ingin membatalkan?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowProgramCancelConfirm(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors">Lanjutkan Mengisi</button>
              <button onClick={() => { setShowProgramCancelConfirm(false); setShowAddProgramModal(false); setIsProgramFormDirty(false); }} className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm">Ya, Batalkan</button>
            </div>
          </div>
        </div>
      )}

      {showKelolaDanaModal && (
        <div className="fixed inset-0 z-[998] flex items-center justify-center p-4 md:p-6 lg:p-10">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowKelolaDanaModal(false)} />
          <div className="bg-white rounded-[24px] p-0 w-full max-w-4xl relative z-10 shadow-2xl animate-scaleUp font-sans border border-gray-100 flex flex-col overflow-hidden max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 shrink-0 bg-white">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Kelola Dana Beasiswa</h2>
                <p className="text-xs text-gray-500 mt-0.5">Riwayat dana beasiswa yang masuk</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setIsDanaFormDirty(false); setShowAddDanaModal(true); }}
                  className="bg-[#1A3D63] text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer border-none hover:bg-[#122A44] transition-all flex items-center shadow-sm"
                >
                  Tambah Dana Beasiswa
                </button>
                <button onClick={() => setShowKelolaDanaModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer border-none">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50/30 p-6">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        <th className="py-3 px-4 w-[120px]">TANGGAL</th>
                        <th className="py-3 px-4 w-[130px]">SUMBER</th>
                        <th className="py-3 px-4">KETERANGAN</th>
                        <th className="py-3 px-4 text-right w-[140px]">NOMINAL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-[11px]">
                      {danaBeasiswaList.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="py-10 text-center text-gray-400 font-medium">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879-.659c1.546-1.16 3.86-1.16 5.405 0l.879.66M8.25 12h7.5m-8.25-2.818.879-.66c1.546-1.159 3.86-1.159 5.405 0l.879.66" /></svg>
                              Belum ada riwayat dana masuk.
                            </div>
                          </td>
                        </tr>
                      ) : (
                        danaBeasiswaList.map((dana, idx) => (
                          <tr key={dana.id || idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-4 font-semibold text-gray-600">{formatTanggal(dana.tanggal)}</td>
                            <td className="py-4 px-4">
                              <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 rounded-md text-[10px] font-bold">
                                {dana.sumber}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-600 truncate max-w-[200px]" title={dana.keterangan}>
                              {dana.keterangan || "-"}
                            </td>
                            <td className="py-4 px-4 font-bold text-emerald-600 text-right">
                              Rp {Number(dana.nominal).toLocaleString('id-ID')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddDanaModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 md:p-10">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCancelDana} />
          <div className="bg-white rounded-[24px] p-5 sm:p-6 max-w-lg w-full relative z-10 shadow-2xl animate-scaleUp font-sans border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-lg font-bold text-gray-800">Tambah Dana Masuk</h2>
              <button onClick={handleCancelDana} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer border-none">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="overflow-y-auto pr-2 flex-1 scrollbar-hide">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sumber Dana <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      value={newDanaForm.sumber}
                      onChange={(e) => { setIsDanaFormDirty(true); setNewDanaForm({ ...newDanaForm, sumber: e.target.value }) }}
                      className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 appearance-none transition-all cursor-pointer"
                    >
                      <option value="" disabled>Pilih Sumber</option>
                      <option value="Lazismu">Lazismu</option>
                      <option value="Sekolah">Sekolah</option>
                      <option value="Donatur">Donatur</option>
                      <option value="Alumni">Alumni</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    <span className="absolute right-3 top-3 text-gray-400 pointer-events-none"><IconChevronDown /></span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nominal Dana <span className="text-red-500">*</span></label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-500 font-bold text-sm pointer-events-none">Rp</span>
                    <input
                      type="text"
                      value={newDanaForm.nominal}
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^0-9]/g, '');
                        if (val) val = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(val);
                        setNewDanaForm({ ...newDanaForm, nominal: val });
                      }}
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400"
                      placeholder="50.000.000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tanggal Dana Masuk <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowDanaDatePicker(!showDanaDatePicker)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all flex items-center justify-between hover:border-[#1A3D63]"
                    >
                      <span>
                        {newDanaForm.tanggal 
                          ? (() => {
                              const [tahun, bulan, tanggal] = newDanaForm.tanggal.split('-');
                              const namaBulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][parseInt(bulan) - 1];
                              return `${tanggal} ${namaBulan} ${tahun}`;
                            })()
                          : 'Pilih tanggal'
                        }
                      </span>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>

                    {/* Calendar Popover */}
                    {showDanaDatePicker && (() => {
                      const [tahun, bulan, tanggal] = (newDanaForm.tanggal || new Date().toISOString().split('T')[0]).split('-');
                      
                      // Generate calendar dates
                      const firstDay = new Date(calendarTahun, calendarBulan - 1, 1);
                      const lastDay = new Date(calendarTahun, calendarBulan, 0);
                      const daysInMonth = lastDay.getDate();
                      const startingDayOfWeek = firstDay.getDay();
                      
                      const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                      const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
                      
                      const handleSelectDate = (day) => {
                        const newDate = `${calendarTahun}-${String(calendarBulan).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        setNewDanaForm({ ...newDanaForm, tanggal: newDate });
                        setShowDanaDatePicker(false);
                        setIsDanaFormDirty(true);
                      };
                      
                      const handleToday = () => {
                        const today = new Date();
                        const newDate = today.toISOString().split('T')[0];
                        setNewDanaForm({ ...newDanaForm, tanggal: newDate });
                        setCalendarBulan(today.getMonth() + 1);
                        setCalendarTahun(today.getFullYear());
                        setShowDanaDatePicker(false);
                        setIsDanaFormDirty(true);
                      };
                      
                      const handleClear = () => {
                        setNewDanaForm({ ...newDanaForm, tanggal: '' });
                        setShowDanaDatePicker(false);
                        setIsDanaFormDirty(true);
                      };
                      
                      const calendarDays = [];
                      for (let i = 0; i < startingDayOfWeek; i++) {
                        calendarDays.push(null);
                      }
                      for (let i = 1; i <= daysInMonth; i++) {
                        calendarDays.push(i);
                      }
                      
                      return (
                        <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-72">
                          {/* Month and Year Selectors */}
                          <div className="flex gap-2 mb-3">
                            <div className="flex-1">
                              <label className="text-xs font-semibold text-gray-600 mb-1 block">Bulan</label>
                              <div className="relative">
                                <select
                                  value={calendarBulan}
                                  onChange={(e) => setCalendarBulan(parseInt(e.target.value))}
                                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20 bg-white text-gray-700 appearance-none cursor-pointer pr-6 font-medium"
                                >
                                  {namaBulan.map((m, i) => (
                                    <option key={i} value={i + 1}>{m}</option>
                                  ))}
                                </select>
                                <span className="absolute right-1.5 top-2 text-gray-400 pointer-events-none text-xs"><IconChevronDown /></span>
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <label className="text-xs font-semibold text-gray-600 mb-1 block">Tahun</label>
                              <div className="relative">
                                <select
                                  value={calendarTahun}
                                  onChange={(e) => setCalendarTahun(parseInt(e.target.value))}
                                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20 bg-white text-gray-700 appearance-none cursor-pointer pr-6 font-medium"
                                >
                                  {Array.from({length: 10}, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
                                    <option key={y} value={y}>{y}</option>
                                  ))}
                                </select>
                                <span className="absolute right-1.5 top-2 text-gray-400 pointer-events-none text-xs"><IconChevronDown /></span>
                              </div>
                            </div>
                          </div>

                          {/* Days of week */}
                          <div className="grid grid-cols-7 gap-1 mb-2">
                            {daysOfWeek.map(day => (
                              <div key={day} className="text-center text-xs font-bold text-gray-600 py-1.5 uppercase tracking-tight">
                                {day}
                              </div>
                            ))}
                          </div>

                          {/* Calendar grid */}
                          <div className="grid grid-cols-7 gap-1 mb-3">
                            {calendarDays.map((day, idx) => {
                              const isToday = new Date().toISOString().split('T')[0] === `${calendarTahun}-${String(calendarBulan).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                              const isSelected = parseInt(tanggal) === day && parseInt(bulan) === calendarBulan && parseInt(tahun) === calendarTahun;
                              
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => day && handleSelectDate(day)}
                                  disabled={!day}
                                  className={`
                                    w-full py-1.5 flex items-center justify-center text-xs font-semibold rounded transition-all
                                    ${!day ? 'text-gray-200 cursor-default bg-transparent' : 'cursor-pointer hover:bg-gray-100'}
                                    ${isSelected ? 'bg-[#1A3D63] text-white shadow-sm hover:bg-[#122A44]' : ''}
                                    ${isToday && !isSelected ? 'border border-[#1A3D63] text-[#1A3D63] bg-blue-50' : ''}
                                    ${!isSelected && !isToday && day ? 'text-gray-700' : ''}
                                  `}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>

                          {/* Footer buttons */}
                          <div className="border-t border-gray-200 pt-2 flex justify-between gap-2">
                            <button
                              type="button"
                              onClick={handleClear}
                              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors bg-transparent border-none cursor-pointer px-2 py-1 rounded hover:bg-blue-50"
                            >
                              Clear
                            </button>
                            <button
                              type="button"
                              onClick={handleToday}
                              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors bg-transparent border-none cursor-pointer px-2 py-1 rounded hover:bg-blue-50"
                            >
                              Today
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Keterangan Tambahan</label>
                  <textarea
                    value={newDanaForm.keterangan}
                    onChange={(e) => { setIsDanaFormDirty(true); setNewDanaForm({ ...newDanaForm, keterangan: e.target.value }) }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 bg-white text-gray-700 transition-all placeholder-gray-400 resize-none min-h-[80px]"
                    placeholder="Opsional: Keterangan tentang penggunaan atau peruntukan dana..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 flex justify-end items-center gap-4 shrink-0">
              <button onClick={handleCancelDana} className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer border-none bg-transparent">Batal</button>
              <button onClick={handleSaveDana} className="bg-[#1A3D63] hover:bg-[#122A44] text-white py-2.5 px-6 rounded-xl text-sm font-bold cursor-pointer border-none shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Simpan Dana
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Penerima */}
      {showAddPenerimaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddPenerimaModal(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative animate-scaleIn z-10">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{selectedBeasiswa ? "Edit Penerima Beasiswa" : "Tambah Penerima Beasiswa"}</h2>
              <button
                onClick={() => setShowAddPenerimaModal(false)}
                className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Siswa <span className="text-red-500">*</span></label>
                  <div className="relative" onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      setTimeout(() => setShowSiswaDropdown(false), 200);
                    }
                  }}>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-gray-400">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                      </span>
                      <input
                        type="text"
                        placeholder="Ketik nama atau NIS siswa..."
                        value={siswaSearchQuery || (beasiswaForm.siswaId ? (siswaList.find(s => String(s.id) === String(beasiswaForm.siswaId))?.nama_lengkap || "") : "")}
                        onChange={(e) => {
                          setSiswaSearchQuery(e.target.value);
                          setBeasiswaForm({ ...beasiswaForm, siswaId: "" });
                          setShowSiswaDropdown(true);
                        }}
                        onFocus={() => setShowSiswaDropdown(true)}
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20 bg-white text-gray-800"
                      />
                    </div>
                    {showSiswaDropdown && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] max-h-[200px] flex flex-col overflow-y-auto custom-scrollbar">
                        <div className="p-1">
                          {siswaList.filter(s => s.nama_lengkap.toLowerCase().includes(siswaSearchQuery.toLowerCase()) || s.nis.includes(siswaSearchQuery)).length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-400">Siswa tidak ditemukan</div>
                          ) : (
                            siswaList.filter(s => s.nama_lengkap.toLowerCase().includes(siswaSearchQuery.toLowerCase()) || s.nis.includes(siswaSearchQuery)).map(s => (
                              <div
                                key={s.id}
                                className={"px-4 py-2.5 text-sm cursor-pointer rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-between " + (String(beasiswaForm.siswaId) === String(s.id) ? "bg-blue-50/50" : "")}
                                onClick={() => {
                                  setBeasiswaForm({ ...beasiswaForm, siswaId: s.id });
                                  setSiswaSearchQuery(s.nama_lengkap);
                                  setShowSiswaDropdown(false);
                                }}
                              >
                                <div>
                                  <div className={"font-medium " + (String(beasiswaForm.siswaId) === String(s.id) ? "text-[#1A3D63]" : "text-gray-700")}>{s.nama_lengkap}</div>
                                  <div className="text-[11px] text-gray-400 mt-0.5">NIS: {s.nis}</div>
                                </div>
                                {String(beasiswaForm.siswaId) === String(s.id) && (
                                  <svg width="16" height="16" fill="none" stroke="#1A3D63" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Program Beasiswa <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        value={beasiswaForm.namaBeasiswa}
                        onChange={(e) => setBeasiswaForm({ ...beasiswaForm, namaBeasiswa: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700 appearance-none pr-10"
                      >
                        <option value="" disabled>-- Pilih Program --</option>
                        {programList.map((prog, idx) => (
                          <option key={idx} value={prog.title}>{prog.title}</option>
                        ))}
                      </select>
                      <span className="absolute right-4 top-3.5 text-gray-400 pointer-events-none">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nominal Potongan (Rp) <span className="text-red-500">*</span></label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-gray-500 font-semibold text-sm">Rp</span>
                      <input
                        type="number"
                        value={beasiswaForm.nominal}
                        onChange={(e) => setBeasiswaForm({ ...beasiswaForm, nominal: e.target.value })}
                        placeholder="250000"
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Periode <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        value={beasiswaForm.periode}
                        onChange={(e) => setBeasiswaForm({ ...beasiswaForm, periode: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700 appearance-none pr-10"
                      >
                        <option value="2025/2026">2025/2026</option>
                      </select>
                      <span className="absolute right-4 top-3.5 text-gray-400 pointer-events-none">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status <span className="text-red-500">*</span></label>
                    <select
                      value={beasiswaForm.status}
                      onChange={(e) => setBeasiswaForm({ ...beasiswaForm, status: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700 h-[46px]"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Non-Aktif">Non-Aktif</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Mulai <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={beasiswaForm.tanggalMulai}
                      onChange={(e) => setBeasiswaForm({ ...beasiswaForm, tanggalMulai: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Selesai <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={beasiswaForm.tanggalSelesai}
                      onChange={(e) => setBeasiswaForm({ ...beasiswaForm, tanggalSelesai: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setShowAddPenerimaModal(false)}
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 px-8 rounded-xl text-sm font-bold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                id="btn-simpan-beasiswa"
                onClick={handleSaveBeasiswa}
                className="bg-[#1A3D63] hover:bg-[#122A44] text-white py-3 px-8 rounded-xl text-sm font-bold cursor-pointer border-none shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait min-w-[140px]"
              >
                Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hapus Beasiswa */}
      {showDeleteBeasiswaModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteBeasiswaModal(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative animate-scaleIn z-10 overflow-hidden">
            <div className="p-6 pb-0 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Hapus Penerima Beasiswa?</h2>
              <p className="text-sm text-gray-500 mb-6">
                Anda yakin ingin menghapus data beasiswa untuk <b>{selectedBeasiswa?.siswa_nama}</b>? Data yang dihapus tidak dapat dikembalikan.
              </p>
            </div>
            <div className="p-6 pt-4 bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowDeleteBeasiswaModal(false)}
                className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 py-3 rounded-xl text-sm font-bold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteBeasiswa}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-bold cursor-pointer border-none shadow-sm transition-all active:scale-[0.98]"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal Dialog */}
      {showTransactionModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowTransactionModal(false)}
          />
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative animate-scaleIn z-10 flex flex-col font-sans">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">Catatan Transaksi</h2>
                <p className="text-[13px] text-gray-400 mt-1">Tambah catatan pengeluaran atau pemasukan</p>
              </div>
              <button
                onClick={() => setShowTransactionModal(false)}
                className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-1 transition-colors rounded-full hover:bg-gray-50"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 overflow-y-auto">
              {/* Tabs */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => { setTransactionTab("Pemasukan"); setTransactionCategory("SPP"); }}
                  className={`py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all border cursor-pointer ${transactionTab === "Pemasukan"
                    ? "bg-[#E6F4EA] border-[#10B981] text-[#10B981]"
                    : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50"
                    }`}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                  Pemasukan
                </button>
                <button
                  onClick={() => { setTransactionTab("Pengeluaran"); setTransactionCategory("Operasional"); }}
                  className={`py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all border cursor-pointer ${transactionTab === "Pengeluaran"
                    ? "bg-[#FEE2E2] border-[#EF4444] text-[#EF4444]"
                    : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50"
                    }`}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" /></svg>
                  Pengeluaran
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Kategori */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-2">Kategori</label>
                  <div className="flex gap-2">
                    {transactionTab === "Pemasukan" ? (
                      <button className="bg-[#1A3D63] text-white px-4 py-2 rounded-lg text-[13px] font-bold border-none">SPP</button>
                    ) : (
                      <>
                        <button
                          onClick={() => setTransactionCategory("Gaji")}
                          className={`px-4 py-2 rounded-lg text-[13px] font-bold border ${transactionCategory === "Gaji" ? "bg-[#1A3D63] text-white border-[#1A3D63]" : "bg-white text-gray-600 border-gray-200"
                            }`}
                        >
                          Gaji
                        </button>
                        <button
                          onClick={() => setTransactionCategory("Operasional")}
                          className={`px-4 py-2 rounded-lg text-[13px] font-bold border ${transactionCategory === "Operasional" ? "bg-[#1A3D63] text-white border-[#1A3D63]" : "bg-white text-gray-600 border-gray-200"
                            }`}
                        >
                          Operasional
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Nama */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">{transactionTab === "Pemasukan" ? "Nama Pembayar" : "Nama / Penerima"}</label>
                  <input
                    type="text"
                    placeholder={transactionTab === "Pemasukan" ? "Nama siswa atau sumber pemasukan" : "Nama penerima atau keterangan"}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] text-gray-800 focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20 transition-all placeholder:text-gray-300"
                  />
                </div>

                {/* Keterangan */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Keterangan</label>
                  <input
                    type="text"
                    placeholder="Contoh: SPP Kelas VIIIA - Mei 2026"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] text-gray-800 focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20 transition-all placeholder:text-gray-300"
                  />
                </div>

                {/* Nominal */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Nominal (Rp)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 275.000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] text-gray-800 focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20 transition-all placeholder:text-gray-300 font-medium"
                  />
                </div>

                {/* Tanggal */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Tanggal</label>
                  <input
                    type="text"
                    defaultValue="25 Mei 2026"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] text-gray-800 focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-50 flex gap-3">
              <button
                onClick={() => setShowTransactionModal(false)}
                className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-3.5 rounded-xl text-[13px] font-bold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowTransactionModal(false);
                  triggerToast("Catatan transaksi berhasil disimpan!");
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-400 py-3.5 rounded-xl text-[13px] font-bold cursor-pointer border-none flex items-center justify-center gap-2 transition-colors"
              >
                <IconPlus /> Simpan Catatan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Komponen Gaji Confirmation Modal */}
      {showDeleteKomponenModal && selectedKomponen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteKomponenModal(false)} />
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 font-sans">
            <div className="p-6 pb-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">Hapus Komponen Gaji</h2>
                <p className="text-[13px] text-gray-400 mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
              </div>
              <button onClick={() => setShowDeleteKomponenModal(false)} className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-gray-50 transition-colors">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-2xl border border-red-100 mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                </div>
                <div>
                  <div className="font-bold text-red-700 text-sm mb-1">Konfirmasi Penghapusan</div>
                  <p className="text-red-600 text-xs leading-relaxed">
                    Anda akan menghapus komponen <span className="font-bold">"{selectedKomponen.name}"</span>. Data ini akan dihapus permanen dan tidak dapat dipulihkan kembali.
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Nama Komponen</span>
                  <span className="font-bold text-gray-800">{selectedKomponen.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Kategori</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${selectedKomponen.category === 'Pendapatan' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                    }`}>{selectedKomponen.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Nominal Standar</span>
                  <span className="font-bold text-gray-800">{selectedKomponen.nominal}</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-50 flex gap-3">
              <button
                onClick={() => setShowDeleteKomponenModal(false)}
                className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 rounded-xl text-[13px] font-bold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteKomponen}
                className="flex-1 bg-[#EF4444] hover:bg-[#DC2626] text-white py-3 rounded-xl text-[13px] font-bold cursor-pointer border-none transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                Ya, Hapus Komponen
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Detail Gaji Modal */}
      {showDetailGajiModal && selectedDetailGaji && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDetailGajiModal(false)} />
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 font-sans overflow-hidden">
            {/* Header */}
            <div className="bg-[#1A3D63] p-6 pb-5 flex justify-between items-start text-white">
              <div>
                <div className="text-[10px] text-blue-200/80 uppercase tracking-widest font-bold mb-1">DETAIL PEMBAYARAN GAJI</div>
                <h2 className="text-lg font-bold tracking-tight">{selectedDetailGaji.name}</h2>
                <p className="text-[13px] text-blue-200 mt-0.5">{selectedDetailGaji.role}</p>
              </div>
              <button onClick={() => setShowDetailGajiModal(false)} className="text-blue-200 hover:text-white bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-white/10 transition-colors">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 pb-4">
              {/* Status Badge */}
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100 border-dashed">
                <span className="text-sm font-medium text-gray-500">Status Pembayaran</span>
                <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${selectedDetailGaji.status === 'Sudah Dibayar' ? 'bg-[#E6F4EA] text-[#059669]' :
                  selectedDetailGaji.status === 'Proses Transfer' ? 'bg-blue-50 text-blue-600' :
                    'bg-[#FEE2E2] text-[#EF4444]'
                  }`}>
                  {selectedDetailGaji.status}
                </span>
              </div>

              {/* Info List */}
              <div className="space-y-3.5 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">ID Transaksi</span>
                  <span className="font-bold text-gray-800">G-101</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Tanggal Bayar</span>
                  <span className="font-bold text-gray-800">{selectedDetailGaji.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Metode</span>
                  <span className="font-bold text-gray-800">Transfer Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Bank Tujuan</span>
                  <span className="font-bold text-gray-800">{selectedDetailGaji.bank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">No. Rekening</span>
                  <span className="font-bold text-gray-800">8821-****-9901</span>
                </div>
              </div>

              {/* Rincian Gaji */}
              <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 mb-2">
                <div className="text-[10px] font-bold text-gray-400 mb-3 tracking-wider uppercase">RINCIAN GAJI</div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Gaji Pokok</span>
                    <span className="font-bold text-gray-800">Rp 3.500.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#059669] font-medium">+ Tunjangan</span>
                    <span className="font-bold text-[#059669]">+Rp 1.000.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#EF4444] font-medium">- Potongan</span>
                    <span className="font-bold text-[#EF4444]">-Rp 394.500</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-200 my-4"></div>

                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Gaji Bersih</span>
                  <span className="text-xl font-black text-[#059669]">{selectedDetailGaji.salary}</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => setShowDetailGajiModal(false)}
                className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-3.5 rounded-xl text-[13px] font-bold cursor-pointer transition-colors shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Tambah / Edit Komponen Gaji ──────────────────────────────── */}
      {showEditKomponenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-800">
                  {selectedKomponen ? 'Edit Komponen Gaji' : 'Tambah Komponen Gaji'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Isi data komponen dengan lengkap</p>
              </div>
              <button
                onClick={() => { setShowEditKomponenModal(false); setSelectedKomponen(null); }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Nama Komponen */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Nama Komponen <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={editKomponenForm.name}
                  onChange={(e) => setEditKomponenForm({ ...editKomponenForm, name: e.target.value })}
                  placeholder="cth: Tunjangan Makan, Potongan BPJS..."
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] transition-all"
                />
              </div>

              {/* Kategori & Tipe */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Kategori</label>
                  <select
                    value={editKomponenForm.category}
                    onChange={(e) => setEditKomponenForm({ ...editKomponenForm, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] transition-all appearance-none bg-white cursor-pointer"
                  >
                    <option value="Pendapatan">Pendapatan</option>
                    <option value="Potongan">Potongan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Formula</label>
                  <select
                    value={editKomponenForm.type}
                    onChange={(e) => setEditKomponenForm({ ...editKomponenForm, type: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] transition-all appearance-none bg-white cursor-pointer"
                  >
                    <option value="Bulanan">Bulanan (flat)</option>
                    <option value="Harian">Per Hari Hadir</option>
                    <option value="Persentase">Persentase Gaji Pokok</option>
                  </select>
                </div>
              </div>

              {/* Nominal */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  {editKomponenForm.type === 'Persentase' ? 'Persentase (%)' : 'Nominal (Rp)'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-400 text-sm font-medium">
                    {editKomponenForm.type === 'Persentase' ? '%' : 'Rp'}
                  </span>
                  <input
                    type="number"
                    value={editKomponenForm.nominal}
                    onChange={(e) => setEditKomponenForm({ ...editKomponenForm, nominal: e.target.value })}
                    placeholder={editKomponenForm.type === 'Persentase' ? '5' : '500000'}
                    className="w-full border border-gray-200 rounded-xl pl-8 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/20 focus:border-[#1A3D63] transition-all"
                  />
                </div>
                {editKomponenForm.type === 'Bulanan' && editKomponenForm.nominal && (
                  <p className="text-[11px] text-gray-400 mt-1">= Rp {Number(editKomponenForm.nominal).toLocaleString('id-ID')}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Status</label>
                <div className="flex gap-2">
                  {['Aktif', 'Non-Aktif'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setEditKomponenForm({ ...editKomponenForm, status: s })}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${editKomponenForm.status === s
                        ? s === 'Aktif'
                          ? 'bg-[#E6F4EA] text-[#059669] border-[#A7F3D0]'
                          : 'bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]'
                        : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => { setShowEditKomponenModal(false); setSelectedKomponen(null); }}
                className="flex-1 py-3 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer bg-white"
              >
                Batal
              </button>
              <button
                onClick={handleSaveKomponen}
                className="flex-1 py-3 bg-[#1A3D63] hover:bg-[#122A44] text-white text-sm font-bold rounded-xl transition-colors cursor-pointer border-none active:scale-95"
              >
                {selectedKomponen ? 'Simpan Perubahan' : 'Tambah Komponen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Hapus Komponen Gaji ────────────────────────────────────────── */}
      {showDeleteKomponenModal && selectedKomponen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" fill="none" stroke="#EF4444" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-1">Hapus Komponen Gaji?</h3>
              <p className="text-sm text-gray-500 mb-1">
                <span className="font-bold text-gray-700">{selectedKomponen.nama || selectedKomponen.name}</span>
              </p>
              <p className="text-xs text-gray-400 mb-6">Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteKomponenModal(false); setSelectedKomponen(null); }}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer bg-white"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteKomponen}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer border-none active:scale-95"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDanaCancelConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDanaCancelConfirm(false)} />
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-xl animate-scaleUp">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Batalkan Perubahan?</h3>
            <p className="text-sm text-gray-600 mb-6">Data dana yang sudah Anda isi belum disimpan dan akan hilang. Apakah Anda yakin ingin membatalkan?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDanaCancelConfirm(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent">Lanjutkan Mengisi</button>
              <button onClick={() => { setShowDanaCancelConfirm(false); setShowAddDanaModal(false); setIsDanaFormDirty(false); }} className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm cursor-pointer border-none">Ya, Batalkan</button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default BendaharaDashboard;




