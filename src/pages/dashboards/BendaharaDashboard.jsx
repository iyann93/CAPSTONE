import React, { useState } from "react";
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
  { name: "Cicilan", value: 6, fill: "#f59e0b" },
  { name: "Belum Bayar", value: 4, fill: "#ef4444" }
];

// Tables Mock Data
const initialPayments = [
  { id: 1, name: "Ahmad Fauzi", class: "Kelas 7A", amount: "Rp 250.000", period: "Mei 2026", status: "Lunas" },
  { id: 2, name: "Aulia Rahma", class: "Kelas 7B", amount: "Rp 250.000", period: "Mei 2026", status: "Lunas" },
  { id: 3, name: "Budi Wijaya", class: "Kelas 7C", amount: "Rp 275.000", period: "Mei 2026", status: "Belum Bayar" },
  { id: 4, name: "Sinta Bella", class: "Kelas 8A", amount: "Rp 250.000", period: "Mei 2026", status: "Lunas" },
  { id: 5, name: "Deni Pratama", class: "Kelas 8B", amount: "Rp 250.000", period: "Mei 2026", status: "Cicilan" }
];

const payrollMockData = [
  { id: 1, name: "Andi Susanto, S.Pd", role: "Guru Matematika", salary: "Rp 4.105.500", status: "Sudah Transfer" },
  { id: 2, name: "Maya Putri, M.Pd", role: "Guru B. Indonesia", salary: "Rp 3.720.000", status: "Sudah Transfer" },
  { id: 3, name: "Hendro Wibowo", role: "Staff TU", salary: "Rp 3.150.000", status: "Pending" },
  { id: 4, name: "Dra. Sri Wahyuni", role: "Guru IPA", salary: "Rp 4.250.000", status: "Sudah Transfer" }
];

const BendaharaDashboard = ({ user, activeMenu }) => {
  const [sppPayments, setSppPayments] = useState(initialPayments);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedYear, setSelectedYear] = useState("2023/2024");
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showGenerateMonthModal, setShowGenerateMonthModal] = useState(false);

  const [studentsBill, setStudentsBill] = useState([
    { nis: "2024001", name: "Ahmad Fauzi", class: "Kelas 7A", amount: "Rp 250.000", month: "Mei 2026", dueDate: "10 Mei 2026", status: "Lunas", payDate: "08 Mei 2026" },
    { nis: "2024002", name: "Aulia Rahma", class: "Kelas 7B", amount: "Rp 250.000", month: "Mei 2026", dueDate: "10 Mei 2026", status: "Lunas", payDate: "07 Mei 2026" },
    { nis: "2024003", name: "Budi Prasetyo", class: "Kelas 8A", amount: "Rp 275.000", month: "Mei 2026", dueDate: "10 Mei 2026", status: "Belum Bayar", payDate: "—" },
    { nis: "2024004", name: "Citra Dewi", class: "Kelas 8B", amount: "Rp 275.000", month: "Mei 2026", dueDate: "10 Mei 2026", status: "Cicilan", payDate: "11 Mei 2026" },
    { nis: "2024005", name: "Danu Pratama", class: "Kelas 9A", amount: "Rp 300.000", month: "Mei 2026", dueDate: "10 Mei 2026", status: "Belum Bayar", payDate: "—" },
    { nis: "2024006", name: "Eka Putri", class: "Kelas 9A", amount: "Rp 300.000", month: "Mei 2026", dueDate: "10 Mei 2026", status: "Lunas", payDate: "05 Mei 2026" },
    { nis: "2024007", name: "Fajar Ramadhan", class: "Kelas 7C", amount: "Rp 250.000", month: "Mei 2026", dueDate: "10 Mei 2026", status: "Lunas", payDate: "09 Mei 2026" },
    { nis: "2024008", name: "Gita Maharani", class: "Kelas 8C", amount: "Rp 275.000", month: "Mei 2026", dueDate: "10 Mei 2026", status: "Belum Bayar", payDate: "—" },
    { nis: "2024009", name: "Hendra Kusuma", class: "Kelas 9B", amount: "Rp 300.000", month: "Mei 2026", dueDate: "10 Mei 2026", status: "Lunas", payDate: "03 Mei 2026" },
    { nis: "2024010", name: "Indah Permata", class: "Kelas 7A", amount: "Rp 250.000", month: "Mei 2026", dueDate: "10 Mei 2026", status: "Cicilan", payDate: "10 Mei 2026" }
  ]);
  const [billSearchQuery, setBillSearchQuery] = useState("");
  const [billClassFilter, setBillClassFilter] = useState("Semua");

  // Form states for manually recording payments
  const [inputStudent, setInputStudent] = useState("");
  const [inputClass, setInputClass] = useState("Kelas 7A");
  const [inputAmount, setInputAmount] = useState("Rp 250.000");
  const [inputPeriod, setInputPeriod] = useState("Mei 2026");
  const [inputStatus, setInputStatus] = useState("Lunas");

  // Form states for creating new bill
  const [billClass, setBillClass] = useState("Semua Kelas");
  const [billAmount, setBillAmount] = useState("250000");
  const [billDueDate, setBillDueDate] = useState("2026-06-10");
  
  // Beasiswa Modal State
  const [showAddProgramModal, setShowAddProgramModal] = useState(false);
  const [beasiswaTab, setBeasiswaTab] = useState("program");

  // Pengaturan SPP states
  const [sppSettingTab, setSppSettingTab] = useState("nominal");
  const [sppList, setSppList] = useState([
    { id: 1, grade: "Kelas 7 SMP", ta: "2024/2025", amount: "Rp 250.000", amountNum: 250000, denda: 15000, jatuhTempo: 10, catatan: "Berlaku mulai Juli 2024" },
    { id: 2, grade: "Kelas 8 SMP", ta: "2024/2025", amount: "Rp 275.000", amountNum: 275000, denda: 15000, jatuhTempo: 10, catatan: "Berlaku mulai Juli 2024" },
    { id: 3, grade: "Kelas 9 SMP", ta: "2024/2025", amount: "Rp 300.000", amountNum: 300000, denda: 15000, jatuhTempo: 10, catatan: "Berlaku mulai Juli 2024" }
  ]);
  const [editingSppId, setEditingSppId] = useState(null);
  const [editSppAmount, setEditSppAmount] = useState("");
  const [editSppDenda, setEditSppDenda] = useState("");
  const [editSppJatuhTempo, setEditSppJatuhTempo] = useState("");
  const [editSppCatatan, setEditSppCatatan] = useState("");
  const [editSppGrade, setEditSppGrade] = useState("");
  const [editSppTa, setEditSppTa] = useState("");

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
      status: inputStatus
    };
    setSppPayments([newPayment, ...sppPayments]);
    setInputStudent("");
    triggerToast("Sukses mencatat pembayaran siswa baru!");
  };

  const filteredBills = studentsBill.filter((row) => {
    const matchesSearch = row.name.toLowerCase().includes(billSearchQuery.toLowerCase()) || 
                          row.nis.includes(billSearchQuery);
    
    if (billClassFilter === "Semua") return matchesSearch;
    const targetGrade = billClassFilter.replace("Kelas ", "");
    const matchesClass = row.class.includes(`Kelas ${targetGrade}`);
    return matchesSearch && matchesClass;
  });

  // Rendering dashboard based on activeMenu selection
  const renderContent = () => {
    switch (activeMenu) {
      case "Tagihan SPP":
        return (
          <div className="flex flex-col gap-6 animate-fadeIn font-sans">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-[26px] font-bold text-gray-800 tracking-tight">Tagihan SPP Siswa</h1>
                <p className="text-sm text-gray-500 mt-1">Generate dan kelola tagihan SPP bulanan seluruh siswa.</p>
              </div>
              <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
                <div className="relative">
                  <select 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 text-xs sm:text-[13px] font-semibold text-gray-700 cursor-pointer appearance-none pr-8 focus:outline-none"
                  >
                    <option value="2023/2024">Tahun Ajaran: 2023/2024</option>
                    <option value="2024/2025">Tahun Ajaran: 2024/2025</option>
                  </select>
                  <span className="absolute right-3 top-3.5 text-gray-400 pointer-events-none">
                    <IconChevronDown />
                  </span>
                </div>
                
                <button 
                  onClick={() => setShowGenerateMonthModal(true)}
                  className="flex items-center gap-1.5 bg-[#1A3D63] hover:bg-[#122A44] text-white border-none rounded-xl px-4 sm:px-5 py-2.5 text-xs sm:text-[13px] font-bold cursor-pointer transition-all active:scale-95 shadow-[0_10px_20px_-10px_rgba(26,61,99,0.3)]"
                >
                  <IconPlus /> Generate Tagihan Bulan Ini
                </button>
              </div>
            </div>

            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Total Tagihan */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1A3D63]" />
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500 flex-shrink-0">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Tagihan</div>
                  <div className="text-2xl font-black text-gray-800">Rp 2.725.000</div>
                  <div className="text-[11px] font-bold text-gray-400">10 siswa</div>
                </div>
              </div>

              {/* Card 2: Sudah Terbayar */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#10B981]" />
                <div className="w-12 h-12 bg-[#E8FDF5] rounded-2xl flex items-center justify-center text-[#059669] flex-shrink-0">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Sudah Terbayar</div>
                  <div className="text-2xl font-black text-gray-800">Rp 1.350.000</div>
                  <div className="text-[11px] font-bold text-gray-400">5 siswa lunas</div>
                </div>
              </div>

              {/* Card 3: Belum / Cicilan */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#EF4444]" />
                <div className="w-12 h-12 bg-[#FEE2E2] rounded-2xl flex items-center justify-center text-[#DC2626] flex-shrink-0">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Belum / Cicilan</div>
                  <div className="text-2xl font-black text-gray-800">Rp 1.375.000</div>
                  <div className="text-[11px] font-bold text-gray-400">5 perlu tindak lanjut</div>
                </div>
              </div>
            </div>

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
                    {["Semua", "Kelas 7", "Kelas 8", "Kelas 9"].map((tab) => {
                      const isActive = billClassFilter === tab;
                      return (
                        <button
                          key={tab}
                          onClick={() => setBillClassFilter(tab)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-none ${
                            isActive 
                              ? "bg-[#1A3D63] text-white shadow-sm" 
                              : "text-gray-500 hover:text-gray-900 bg-transparent"
                          }`}
                        >
                          {tab}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button 
                    onClick={() => triggerToast("Mengekspor data tagihan SPP ke file Excel...")}
                    className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all border-solid"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Export
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
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
                    {filteredBills.map((row) => (
                      <tr key={row.nis} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-3 text-gray-400 font-mono font-medium">{row.nis}</td>
                        <td className="py-4 px-3 font-bold text-gray-800">{row.name}</td>
                        <td className="py-4 px-3">
                          <span className="bg-blue-50 text-blue-600 font-semibold px-2.5 py-0.5 rounded-full text-[10px]">
                            {row.class}
                          </span>
                        </td>
                        <td className="py-4 px-3 font-bold text-gray-700">{row.amount}</td>
                        <td className="py-4 px-3 text-gray-400 font-medium">{row.month}</td>
                        <td className="py-4 px-3 text-gray-500">{row.dueDate}</td>
                        <td className="py-4 px-3">
                          {row.status === "Lunas" && (
                            <span className="bg-[#E8FDF5] text-[#059669] border border-[#A7F3D0] rounded-full px-2.5 py-0.5 flex items-center gap-1 font-bold text-[10px] w-fit border-solid">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5"><polyline points="20 6 9 17 4 12" /></svg>
                              Lunas
                            </span>
                          )}
                          {row.status === "Cicilan" && (
                            <span className="bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D] rounded-full px-2.5 py-0.5 flex items-center gap-1 font-bold text-[10px] w-fit border-solid">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                              Cicilan
                            </span>
                          )}
                          {row.status === "Belum Bayar" && (
                            <span className="bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] rounded-full px-2.5 py-0.5 flex items-center gap-1 font-bold text-[10px] w-fit border-solid">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                              Belum Bayar
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-3 text-right text-gray-500 font-medium">{row.payDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "Pengaturan SPP":
        return (
          <div className="flex flex-col gap-6 animate-fadeIn font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-[26px] font-bold text-gray-800 tracking-tight">Pengaturan SPP</h1>
                <p className="text-sm text-gray-500 mt-1">Atur nominal SPP, diskon, dan jadwal pembayaran per kelas (Kelas 7, 8, 9 SMP).</p>
              </div>
              <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-[13px] font-semibold text-gray-700 cursor-pointer appearance-none pr-8 focus:outline-none"
                  >
                    <option value="2023/2024">Tahun Ajaran: 2023/2024</option>
                    <option value="2024/2025">Tahun Ajaran: 2024/2025</option>
                  </select>
                  <span className="absolute right-3 top-3.5 text-gray-400 pointer-events-none">
                    <IconChevronDown />
                  </span>
                </div>
                <button
                  onClick={() => triggerToast("Semua pengaturan SPP berhasil disimpan!")}
                  className="flex items-center gap-1.5 bg-[#1A3D63] hover:bg-[#122A44] text-white border-none rounded-xl px-4 sm:px-5 py-2.5 text-xs sm:text-[13px] font-bold cursor-pointer transition-all active:scale-95 shadow-[0_10px_20px_-10px_rgba(26,61,99,0.3)]"
                >
                  <IconPlus /> Simpan Semua Pengaturan
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl border border-gray-100 p-1 flex gap-1 shadow-sm">
              {[
                { key: "nominal", icon: "$", label: "Nominal SPP per Kelas" },
                { key: "diskon", icon: "≡", label: "Kategori Diskon / Potongan" },
                { key: "kalender", icon: "📅", label: "Kalender Pembayaran" }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSppSettingTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer border-none ${
                    sppSettingTab === tab.key
                      ? "bg-[#1A3D63] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800 bg-transparent"
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
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
                    <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{item.grade}</div>
                      <div className="text-3xl font-black text-gray-800 mb-2">{item.amount}</div>
                      <div className="text-[11px] text-gray-400">Denda: Rp {item.denda.toLocaleString("id-ID")}/bln · Jatuh tempo tgl {item.jatuhTempo}</div>
                    </div>
                  ))}
                </div>

                {/* Daftar Pengaturan SPP */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-bold text-gray-800">Daftar Pengaturan SPP ({sppList.length} angkatan)</h3>
                    <button
                      onClick={() => triggerToast("Membuka form tambah angkatan SPP baru...")}
                      className="flex items-center gap-1.5 bg-[#1A3D63] hover:bg-[#122A44] text-white border-none rounded-xl px-4 py-2 text-xs font-bold cursor-pointer transition-all active:scale-95"
                    >
                      <IconPlus /> Tambah Angkatan SPP
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {sppList.map((item) => {
                      const isEditing = editingSppId === item.id;
                      return (
                        <div
                          key={item.id}
                          className={`border rounded-xl transition-all duration-200 ${
                            isEditing
                              ? "border-[#1A3D63] shadow-[0_0_0_3px_rgba(26,61,99,0.1)] p-5"
                              : "border-gray-100 hover:bg-gray-50/50 p-4"
                          }`}
                        >
                          {/* Header row (always visible) */}
                          <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                              isEditing ? "bg-[#1A3D63] text-white" : "bg-blue-50 text-blue-500"
                            }`}>
                              $
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                              <div className="text-sm font-bold text-gray-800">
                                {item.grade}
                                <span className="text-[11px] font-semibold text-gray-400 ml-2">TA {item.ta}</span>
                              </div>
                              {!isEditing && (
                                <div className="text-[11px] text-gray-400 mt-0.5">
                                  {item.amount}/bln · Denda Rp {item.denda.toLocaleString("id-ID")} · Jatuh tempo tgl {item.jatuhTempo}
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
                                  onClick={() => {
                                    setSppList(sppList.map(s => s.id === item.id ? {
                                      ...s,
                                      grade: editSppGrade,
                                      ta: editSppTa,
                                      amount: `Rp ${Number(editSppAmount).toLocaleString("id-ID")}`,
                                      amountNum: Number(editSppAmount),
                                      denda: Number(editSppDenda),
                                      jatuhTempo: Number(editSppJatuhTempo),
                                      catatan: editSppCatatan
                                    } : s));
                                    setEditingSppId(null);
                                    triggerToast(`Nominal ${editSppGrade} berhasil diperbarui!`);
                                  }}
                                  className="flex items-center gap-1.5 bg-[#1A3D63] hover:bg-[#122A44] text-white border-none px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95"
                                >
                                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                  Simpan
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  onClick={() => {
                                    setEditingSppId(item.id);
                                    setEditSppAmount(String(item.amountNum));
                                    setEditSppDenda(String(item.denda));
                                    setEditSppJatuhTempo(String(item.jatuhTempo));
                                    setEditSppCatatan(item.catatan);
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
                                <button
                                  onClick={() => {
                                    setSppList(sppList.filter(s => s.id !== item.id));
                                    triggerToast(`Pengaturan ${item.grade} berhasil dihapus!`);
                                  }}
                                  className="flex items-center gap-1.5 bg-white hover:bg-red-50 border border-red-200 text-red-500 hover:text-red-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border-solid"
                                >
                                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                  </svg>
                                  Hapus
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Inline Expand Edit Form */}
                          {isEditing && (
                            <div className="mt-5 pt-5 border-t border-gray-100">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Kelas</label>
                                  <input
                                    type="text"
                                    value={editSppGrade}
                                    onChange={(e) => setEditSppGrade(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#1A3D63] transition-colors"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Tahun Ajaran</label>
                                  <input
                                    type="text"
                                    value={editSppTa}
                                    onChange={(e) => setEditSppTa(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#1A3D63] transition-colors"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Nominal SPP (Rp)</label>
                                  <input
                                    type="number"
                                    value={editSppAmount}
                                    onChange={(e) => setEditSppAmount(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#1A3D63] transition-colors"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Jatuh Tempo (Tanggal)</label>
                                  <input
                                    type="number"
                                    value={editSppJatuhTempo}
                                    onChange={(e) => setEditSppJatuhTempo(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#1A3D63] transition-colors"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Denda Keterlambatan (Rp)</label>
                                  <input
                                    type="number"
                                    value={editSppDenda}
                                    onChange={(e) => setEditSppDenda(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#1A3D63] transition-colors"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Catatan</label>
                                  <input
                                    type="text"
                                    value={editSppCatatan}
                                    onChange={(e) => setEditSppCatatan(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#1A3D63] transition-colors"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Warning Banner */}
                  <div className="mt-5 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 border-solid">
                    <svg width="18" height="18" fill="none" stroke="#D97706" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      <strong>Perhatian:</strong> Perubahan nominal SPP akan diterapkan untuk tagihan bulan berikutnya. Tagihan bulan berjalan tidak akan berubah otomatis.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Kategori Diskon / Potongan */}
            {sppSettingTab === "diskon" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Kategori Diskon & Potongan SPP</h3>
                    <p className="text-[11px] text-gray-400 mt-1">Kelola jenis potongan SPP berdasarkan kategori siswa.</p>
                  </div>
                  <button onClick={() => triggerToast("Membuka form kategori diskon baru...")} className="flex items-center gap-1.5 bg-[#1A3D63] text-white border-none rounded-xl px-4 py-2 text-xs font-bold cursor-pointer hover:bg-[#122A44] transition-all">
                    <IconPlus /> Tambah Kategori
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                        <th className="py-3 px-4 rounded-tl-lg">NAMA KATEGORI</th>
                        <th className="py-3 px-4">POTONGAN SPP</th>
                        <th className="py-3 px-4">BERLAKU UNTUK</th>
                        <th className="py-3 px-4 rounded-tr-lg">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs">
                      {[
                        { name: "Beasiswa Prestasi", cut: "100% Gratis", cutColor: "green", target: "Semua Kelas" },
                        { name: "Kurang Mampu (KIP)", cut: "100% Gratis", cutColor: "green", target: "Semua Kelas" },
                        { name: "Anak Guru/Karyawan", cut: "50% Gratis", cutColor: "orange", target: "Semua Kelas" },
                        { name: "Diskon Saudara Kandung", cut: "25% Gratis", cutColor: "orange", target: "Semua Kelas" }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                          <td className="py-4 px-4 font-bold text-gray-700">{row.name}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold inline-block ${
                              row.cutColor === "green" ? "bg-[#E6F4EA] text-[#137333]" : "bg-[#FEF7E0] text-[#B06000]"
                            }`}>
                              {row.cut}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-500 font-medium">{row.target}</td>
                          <td className="py-4 px-4">
                            <button 
                              onClick={() => triggerToast(`Menghapus kategori ${row.name}`)}
                              className="flex items-center gap-1.5 bg-[#FCE8E6] hover:bg-[#FAD2CF] text-[#C5221F] border border-[#FAD2CF] px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                            >
                              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Kalender Pembayaran */}
            {sppSettingTab === "kalender" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-800">Kalender Tagihan SPP Tahun Ajaran 2024/2025</h3>
                  <p className="text-[11px] text-gray-400 mt-1">Periode penagihan SPP Juli 2024 — Juni 2025</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { month: "Januari 2025", active: false, hasDetails: false },
                    { month: "Februari 2025", active: false, hasDetails: false },
                    { month: "Maret 2025", active: false, hasDetails: false },
                    { month: "April 2025", active: false, hasDetails: false },
                    { month: "Mei 2025", active: false, hasDetails: false },
                    { month: "Juni 2025", active: false, hasDetails: false },
                    { month: "Juli 2024", active: false, hasDetails: true },
                    { month: "Agustus 2024", active: false, hasDetails: true },
                    { month: "September 2024", active: false, hasDetails: true },
                    { month: "Oktober 2024", active: false, hasDetails: true },
                    { month: "November 2024", active: true, hasDetails: true },
                    { month: "Desember 2024", active: false, hasDetails: true }
                  ].map((item, i) => (
                    <div 
                      key={i} 
                      className={`p-4 rounded-xl border ${
                        item.active 
                          ? "border-blue-500 bg-blue-50/30" 
                          : "border-gray-100 bg-white"
                      } h-[84px] flex flex-col justify-center`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${
                          item.active 
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
                          Jatuh tempo tgl 10 · Kelas 7-9
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "Catat Pembayaran":
        return (
          <div className="animate-fadeIn">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">Catat Pembayaran SPP</h2>
              <p className="text-sm text-gray-500 mt-1">Input dan konfirmasi pembayaran SPP siswa secara manual maupun online.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
              {/* Main Content: Cari Siswa & List */}
              <div className="flex flex-col gap-6">
                
                {/* Search & List */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Cari nama siswa atau NIS..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] focus:bg-white transition-colors"
                    />
                  </div>

                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Belum Lunas Bulan Ini</h3>
                  
                  <div className="flex flex-col gap-3">
                    {/* Budi Prasetyo - Selected */}
                    <div className="flex items-center justify-between p-4 rounded-xl border-2 border-blue-500 bg-white cursor-pointer hover:bg-gray-50/50 transition-colors shadow-sm">
                      <div>
                        <div className="text-sm font-bold text-gray-800">Budi Prasetyo</div>
                        <div className="text-[11px] text-gray-400 mt-1">XII IPA 3 · NIS: 2024/003</div>
                        <div className="text-[11px] font-medium text-red-500 mt-1">Tunggakan: 1 bulan</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-red-500">Rp 450.000</div>
                        <div className="text-[10px] text-red-400 font-bold mt-1">2 bln</div>
                      </div>
                    </div>

                    {/* Citra Dewi */}
                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white cursor-pointer hover:bg-gray-50/50 transition-colors">
                      <div>
                        <div className="text-sm font-bold text-gray-800">Citra Dewi</div>
                        <div className="text-[11px] text-gray-400 mt-1">XI IPS 2 · NIS: 2024/004</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-red-500">Rp 225.000</div>
                        <div className="text-[10px] text-red-400 font-bold mt-1">1 bln</div>
                      </div>
                    </div>

                    {/* Danu Pratama */}
                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white cursor-pointer hover:bg-gray-50/50 transition-colors">
                      <div>
                        <div className="text-sm font-bold text-gray-800">Danu Pratama</div>
                        <div className="text-[11px] text-gray-400 mt-1">X IPS 1 · NIS: 2024/005</div>
                        <div className="text-[11px] font-medium text-red-500 mt-1">Tunggakan: 2 bulan</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-red-500">Rp 1.350.000</div>
                        <div className="text-[10px] text-red-400 font-bold mt-1">3 bln</div>
                      </div>
                    </div>

                    {/* Putri Handayani */}
                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white cursor-pointer hover:bg-gray-50/50 transition-colors">
                      <div>
                        <div className="text-sm font-bold text-gray-800">Putri Handayani</div>
                        <div className="text-[11px] text-gray-400 mt-1">XI IPS 1 · NIS: 2024/008</div>
                        <div className="text-[11px] font-medium text-red-500 mt-1">Tunggakan: 3 bulan</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-red-500">Rp 1.800.000</div>
                        <div className="text-[10px] text-red-400 font-bold mt-1">4 bln</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Riwayat Pembayaran */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-5">Riwayat Pembayaran Hari Ini</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="mt-0.5 text-[#0F9D58]">
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800">Ahmad Fauzi — X IPA 1</div>
                          <div className="text-[11px] text-gray-400 mt-1">Mei 2026 · Transfer Bank · 09.14 WIB</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-[#0F9D58]">Rp 450.000</div>
                    </div>
                    
                    <div className="w-full h-px bg-gray-50"></div>

                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="mt-0.5 text-[#0F9D58]">
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800">Aulia Rahma — XII IPS 1</div>
                          <div className="text-[11px] text-gray-400 mt-1">Mei 2026 · Tunai · 09.02 WIB</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-[#0F9D58]">Rp 450.000</div>
                    </div>

                    <div className="w-full h-px bg-gray-50"></div>

                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="mt-0.5 text-[#0F9D58]">
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800">Eka Putri — XI IPA 2</div>
                          <div className="text-[11px] text-gray-400 mt-1">Mei 2026 · Transfer Bank · 08.45 WIB</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-[#0F9D58]">Rp 450.000</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Sidebar: Form Pembayaran */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-fit sticky top-6">
                <h3 className="text-sm font-bold text-gray-800 mb-5">Form Pembayaran</h3>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="text-sm font-bold text-gray-800">Budi Prasetyo</div>
                  <div className="text-[11px] text-gray-500 mt-1">XII IPA 3</div>
                </div>

                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Tagihan Bulan Ini</span>
                    <span className="font-bold text-gray-800">Rp 450.000</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Total Termasuk Tunggakan</span>
                    <span className="font-bold text-gray-800">Rp 450.000</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[11px] font-bold text-gray-500 mb-2">Metode Pembayaran</label>
                  <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F9D58]">
                    <option>Transfer Bank</option>
                    <option>Tunai</option>
                  </select>
                </div>

                <button 
                  onClick={() => triggerToast('Pembayaran berhasil dikonfirmasi!')}
                  className="w-full flex items-center justify-center gap-2 bg-[#0F9D58] hover:bg-[#0b8043] text-white py-3 rounded-xl text-xs font-bold transition-all active:scale-[0.98] border-none cursor-pointer"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  Konfirmasi Pembayaran
                </button>
              </div>

            </div>
          </div>
        );

      case "Beasiswa & Potongan SPP":
        return (
          <div className="animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Beasiswa & Potongan</h2>
                <p className="text-sm text-gray-500 mt-1">Kelola program beasiswa dan potongan SPP siswa.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm text-gray-600 shadow-sm">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                  Tahun Ajaran: 2023/2024
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                </div>
                <button 
                  onClick={() => setShowAddProgramModal(true)}
                  className="bg-[#1A3D63] text-white font-bold text-sm px-4 py-2.5 rounded-xl cursor-pointer border-none hover:bg-[#122A44] transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  Tambah Program
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-blue-500">
                <div className="text-2xl font-bold text-gray-800">5</div>
                <div className="text-[11px] text-gray-400 mt-1 font-semibold uppercase tracking-wider">Total Program Aktif</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-green-500">
                <div className="text-2xl font-bold text-gray-800">78 Siswa</div>
                <div className="text-[11px] text-gray-400 mt-1 font-semibold uppercase tracking-wider">Penerima Beasiswa</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-orange-500">
                <div className="text-2xl font-bold text-gray-800">Rp 28 Jt</div>
                <div className="text-[11px] text-gray-400 mt-1 font-semibold uppercase tracking-wider">Total Potongan/Bln</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-purple-500">
                <div className="text-2xl font-bold text-gray-800">Rp 142 Jt</div>
                <div className="text-[11px] text-gray-400 mt-1 font-semibold uppercase tracking-wider">Dana Beasiswa/Thn</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-6">
              <div 
                className={`text-sm font-bold pb-3 cursor-pointer ${beasiswaTab === "program" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                onClick={() => setBeasiswaTab("program")}
              >
                Daftar Program (6)
              </div>
              <div 
                className={`text-sm font-bold pb-3 cursor-pointer ${beasiswaTab === "penerima" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                onClick={() => setBeasiswaTab("penerima")}
              >
                Data Penerima
              </div>
            </div>

            {/* Tab Content */}
            {beasiswaTab === "program" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[
                  { title: "Beasiswa Prestasi Akademik", subtitle: "2024/2025", type: "Beasiswa", amount: "100%", status: "Aktif", users: "12 siswa", typeColor: "blue" },
                  { title: "Beasiswa Yayasan Peduli", subtitle: "2024/2025", type: "Beasiswa", amount: "50%", status: "Aktif", users: "24 siswa", typeColor: "blue" },
                  { title: "Potongan Anak Guru", subtitle: "Setiap Bulan", type: "Potongan", amount: "Rp 100.000", status: "Aktif", users: "8 siswa", typeColor: "orange" },
                  { title: "Potongan Kakak-Adik", subtitle: "Setiap Bulan", type: "Potongan", amount: "25%", status: "Aktif", users: "16 siswa", typeColor: "orange" },
                  { title: "Beasiswa Dhuafa", subtitle: "2024/2025", type: "Beasiswa", amount: "75%", status: "Aktif", users: "18 siswa", typeColor: "blue" },
                  { title: "Subsidi Bencana Alam", subtitle: "Jan-Mar 2025", type: "Potongan", amount: "Rp 150.000", status: "Non-Aktif", users: "3 siswa", typeColor: "orange" }
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          item.typeColor === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800">{item.title}</div>
                          <div className="text-[11px] text-gray-400 mt-1">{item.subtitle}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-blue-500 transition-colors cursor-pointer">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>
                        </button>
                        <button className="w-8 h-8 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors cursor-pointer">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        item.typeColor === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                      }`}>{item.type}</span>
                      
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#E6F4EA] text-[#137333]">
                        {item.amount}
                      </span>
                      
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        item.status === 'Aktif' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}>{item.status}</span>
                      
                      <span className="flex items-center gap-1 text-[11px] text-gray-500 font-medium ml-2">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                        {item.users}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 font-bold text-[10px] tracking-wider border-b border-gray-100">
                        <th className="py-3 px-5">NAMA SISWA</th>
                        <th className="py-3 px-5">KELAS</th>
                        <th className="py-3 px-5">PROGRAM</th>
                        <th className="py-3 px-5">POTONGAN</th>
                        <th className="py-3 px-5">SPP AWAL</th>
                        <th className="py-3 px-5">SPP AKHIR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs">
                      {[
                        { name: "Aulia Rahma", class: "Kelas 9A", program: "Beasiswa Prestasi Akademik", pot: "100%", awal: "Rp 300.000", akhir: "Rp 0" },
                        { name: "Bima Saputra", class: "Kelas 8B", program: "Beasiswa Yayasan Peduli", pot: "50%", awal: "Rp 275.000", akhir: "Rp 137.500" },
                        { name: "Citra Dewi", class: "Kelas 7A", program: "Potongan Anak Guru", pot: "Rp 100.000", awal: "Rp 250.000", akhir: "Rp 150.000" },
                        { name: "Danu Pratama", class: "Kelas 7B", program: "Potongan Kakak-Adik", pot: "25%", awal: "Rp 250.000", akhir: "Rp 187.500" }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-5 font-bold text-gray-800">{row.name}</td>
                          <td className="py-4 px-5">
                            <span className="text-blue-500 bg-blue-50 px-2 py-1 rounded-md text-[10px] font-bold">{row.class}</span>
                          </td>
                          <td className="py-4 px-5 text-gray-600">{row.program}</td>
                          <td className="py-4 px-5">
                            <span className="text-[#137333] bg-[#E6F4EA] px-2.5 py-1 rounded-md text-[10px] font-bold">{row.pot}</span>
                          </td>
                          <td className="py-4 px-5 text-gray-400 font-medium decoration-gray-300 relative">
                            {row.awal}
                            <div className="absolute top-1/2 left-5 w-14 h-px bg-gray-300"></div>
                          </td>
                          <td className="py-4 px-5 font-bold text-[#0F9D58]">{row.akhir}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        );

      case "Transaksi Pembayaran":
        return (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Buku Jurnal Kas Masuk SPP</h2>
                <p className="text-sm text-gray-500">Mutasi transaksi pembayaran iuran SPP siswa real-time.</p>
              </div>
              <button 
                onClick={() => triggerToast("Mengunduh ekspor laporan mutasi transaksi dalam bentuk Excel...")}
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer border-none transition-all"
              >
                Ekspor Jurnal (.XLSX)
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold text-[10px] tracking-wider border-b border-gray-100">
                    <th className="py-3 px-4">KODE REF</th>
                    <th className="py-3 px-4">WAKTU</th>
                    <th className="py-3 px-4">SISWA</th>
                    <th className="py-3 px-4">METODE BAYAR</th>
                    <th className="py-3 px-4">NOMINAL</th>
                    <th className="py-3 px-4">PERIODE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {[
                    { id: "SPP-9921", time: "Hari ini, 11:22", name: "Ahmad Fauzi", method: "Virtual Account BCA", amount: "Rp 250.000", period: "Mei 2026" },
                    { id: "SPP-9918", time: "Hari ini, 09:15", name: "Aulia Rahma", method: "Cash / Tunai", amount: "Rp 250.000", period: "Mei 2026" },
                    { id: "SPP-9912", time: "Kemarin, 14:30", name: "Sinta Bella", method: "Virtual Account Mandiri", amount: "Rp 250.000", period: "Mei 2026" }
                  ].map((row) => (
                    <tr key={row.id}>
                      <td className="py-4 px-4 font-mono font-bold text-gray-700">{row.id}</td>
                      <td className="py-4 px-4 text-gray-400">{row.time}</td>
                      <td className="py-4 px-4 font-bold text-gray-800">{row.name}</td>
                      <td className="py-4 px-4 text-gray-500">{row.method}</td>
                      <td className="py-4 px-4 font-bold text-green-600">{row.amount}</td>
                      <td className="py-4 px-4 text-gray-500">{row.period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Monitor Tunggakan":
        return (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Monitoring Piutang & Tunggakan SPP</h2>
            <p className="text-sm text-gray-500 mb-6">Pemantauan siswa yang belum menyelesaikan administrasi SPP.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold text-[10px] tracking-wider border-b border-gray-100">
                    <th className="py-3 px-4">SISWA</th>
                    <th className="py-3 px-4">KELAS</th>
                    <th className="py-3 px-4">JUMLAH BULAN TUNGGAKAN</th>
                    <th className="py-3 px-4">TOTAL TUNGGAKAN</th>
                    <th className="py-3 px-4">TINDAKAN TERAKHIR</th>
                    <th className="py-3 px-4">TINDAKAN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {[
                    { id: 1, name: "Budi Wijaya", class: "Kelas 7C", months: "2 Bulan (Apr, Mei)", total: "Rp 550.000", alert: "Belum Dihubungi" },
                    { id: 2, name: "Rian Hidayat", class: "Kelas 8C", months: "3 Bulan (Mar, Apr, Mei)", total: "Rp 750.000", alert: "Terkirim WhatsApp 3 hari lalu" }
                  ].map((row) => (
                    <tr key={row.id}>
                      <td className="py-4 px-4 font-bold text-gray-800">{row.name}</td>
                      <td className="py-4 px-4 text-gray-500">{row.class}</td>
                      <td className="py-4 px-4 font-bold text-red-500">{row.months}</td>
                      <td className="py-4 px-4 font-bold text-red-600">{row.total}</td>
                      <td className="py-4 px-4 text-gray-400">{row.alert}</td>
                      <td className="py-4 px-4">
                        <button 
                          onClick={() => triggerToast(`Pengingat peringatan keras terkirim ke wali murid ${row.name}!`)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg cursor-pointer border-none flex items-center gap-1"
                        >
                          <IconSend /> Kirim Somasi WA
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Komponen Gaji":
        return (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Manajemen Skema Komponen Gaji</h2>
            <p className="text-sm text-gray-500 mb-6">Atur regulasi nilai nominal gaji pokok, tunjangan kehadiran, jam mengajar, dan BPJS.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Komponen Pemasukan */}
              <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/50">
                <h3 className="text-xs font-bold text-green-700 uppercase mb-4 tracking-wider">Tunjangan &amp; Pendapatan</h3>
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                    <span className="font-bold text-gray-700">Tunjangan Wali Kelas</span>
                    <span className="font-bold text-gray-800">Rp 500.000 / Bulan</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                    <span className="font-bold text-gray-700">Tunjangan Transportasi</span>
                    <span className="font-bold text-gray-800">Rp 300.000 / Bulan</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                    <span className="font-bold text-gray-700">Honor Jam Mengajar Utama</span>
                    <span className="font-bold text-gray-800">Rp 45.000 / Jam</span>
                  </div>
                </div>
              </div>

              {/* Komponen Potongan */}
              <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/50">
                <h3 className="text-xs font-bold text-red-700 uppercase mb-4 tracking-wider">Potongan Wajib</h3>
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                    <span className="font-bold text-gray-700">Iuran BPJS Kesehatan (2%)</span>
                    <span className="font-bold text-gray-800">Sesuai Gaji Pokok</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                    <span className="font-bold text-gray-700">Iuran BPJS Ketenagakerjaan (1%)</span>
                    <span className="font-bold text-gray-800">Sesuai Gaji Pokok</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                    <span className="font-bold text-gray-700">Potongan Keterlambatan</span>
                    <span className="font-bold text-red-500">Rp 15.000 / Menit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "Generate Slip Gaji":
        return (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Generate Slip Gaji Bulanan</h2>
                <p className="text-sm text-gray-500">Kalkulasi akhir, generate berkas PDF slip gaji staf &amp; guru.</p>
              </div>
              <button 
                onClick={() => triggerToast("Mengalkulasi dan generate masal seluruh slip gaji Guru & Karyawan...")}
                className="bg-[#1A3D63] hover:bg-[#122A44] text-white font-bold text-xs px-4 py-2.5 rounded-lg border-none cursor-pointer transition-all active:scale-95"
              >
                Generate Masal (PDF)
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold text-[10px] tracking-wider border-b border-gray-100">
                    <th className="py-3 px-4">NAMA</th>
                    <th className="py-3 px-4">JABATAN</th>
                    <th className="py-3 px-4">HONOR MENGAJAR (JAM)</th>
                    <th className="py-3 px-4">GAJI BERSIH</th>
                    <th className="py-3 px-4">SLIP GAJI</th>
                    <th className="py-3 px-4">TINDAKAN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {payrollMockData.map((row) => (
                    <tr key={row.id}>
                      <td className="py-4 px-4 font-bold text-gray-800">{row.name}</td>
                      <td className="py-4 px-4 text-gray-500">{row.role}</td>
                      <td className="py-4 px-4 font-bold text-gray-700">32 Jam</td>
                      <td className="py-4 px-4 font-bold text-green-600">{row.salary}</td>
                      <td className="py-4 px-4">
                        <span className="text-[10px] font-bold text-gray-400 font-mono">DRAFT_SLIP_{row.id}.PDF</span>
                      </td>
                      <td className="py-4 px-4 flex items-center gap-3">
                        <button 
                          onClick={() => triggerToast(`Preview slip gaji ${row.name}`)}
                          className="bg-transparent border-none text-[#1A3D63] font-bold cursor-pointer hover:underline"
                        >
                          Preview
                        </button>
                        <button 
                          onClick={() => triggerToast(`Slip gaji ${row.name} sukses terkirim ke email!`)}
                          className="bg-transparent border-none text-green-600 font-bold cursor-pointer hover:underline"
                        >
                          Kirim Slip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Status Bayar Gaji":
        return (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Monitoring Pembayaran Gaji Karyawan</h2>
            <p className="text-sm text-gray-500 mb-6">Daftar verifikasi status pencairan gaji &amp; payroll bulanan.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold text-[10px] tracking-wider border-b border-gray-100">
                    <th className="py-3 px-4">KARYAWAN / GURU</th>
                    <th className="py-3 px-4">JABATAN</th>
                    <th className="py-3 px-4">GAJI BERSIH</th>
                    <th className="py-3 px-4">METODE BAYAR</th>
                    <th className="py-3 px-4">STATUS PAYROLL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {payrollMockData.map((row) => (
                    <tr key={row.id}>
                      <td className="py-4 px-4 font-bold text-gray-800">{row.name}</td>
                      <td className="py-4 px-4 text-gray-500">{row.role}</td>
                      <td className="py-4 px-4 font-bold text-gray-700">{row.salary}</td>
                      <td className="py-4 px-4 text-gray-500">Host-to-Host Bank Mandiri</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          row.status === "Sudah Transfer" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
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
                <div className="relative">
                  <select 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 text-xs sm:text-[13px] font-semibold text-gray-700 cursor-pointer appearance-none pr-8 focus:outline-none"
                  >
                    <option value="2023/2024">Tahun Ajaran: 2023/2024</option>
                    <option value="2024/2025">Tahun Ajaran: 2024/2025</option>
                  </select>
                  <span className="absolute right-3 top-3.5 text-gray-400 pointer-events-none">
                    <IconChevronDown />
                  </span>
                </div>
                
                <button 
                  onClick={() => setShowBillingModal(true)}
                  className="flex items-center gap-1.5 bg-[#1A3D63] hover:bg-[#122A44] text-white border-none rounded-xl px-4 sm:px-5 py-2.5 text-xs sm:text-[13px] font-bold cursor-pointer transition-all shadow-[0_10px_20px_-10px_rgba(26,61,99,0.3)] active:scale-95"
                >
                  <IconPlus /> Generate Tagihan SPP
                </button>
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
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                      <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                      <Bar dataKey="Lunas" fill="#1A3D63" radius={[4, 4, 0, 0]} barSize={16} />
                      <Bar dataKey="Belum" fill="#FF8E8D" radius={[4, 4, 0, 0]} barSize={16} />
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
                          <td className="py-3 text-gray-500">{row.class}</td>
                          <td className="py-3 font-bold text-gray-700">{row.amount}</td>
                          <td className="py-3 text-gray-400">{row.period}</td>
                          <td className="py-3 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold inline-block ${
                              row.status === "Lunas" ? "bg-green-50 text-green-600" :
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
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold inline-block ${
                              row.status === "Sudah Transfer" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-[480px] w-full relative z-10 shadow-2xl animate-scaleUp border border-gray-100 font-sans">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Generate Tagihan SPP</h3>
                <p className="text-sm text-gray-500">Bulan: Juni 2026</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-[11px] font-bold text-gray-400 mb-4 uppercase tracking-wider">Ringkasan Generate</h4>
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Kelas 7 (semua rombel)</span>
                  <span className="font-bold text-gray-800">4 siswa</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Kelas 8 (semua rombel)</span>
                  <span className="font-bold text-gray-800">3 siswa</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Kelas 9 (semua rombel)</span>
                  <span className="font-bold text-gray-800">3 siswa</span>
                </div>
              </div>
              <div className="border-t border-gray-100 my-4"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">Total Tagihan</span>
                <span className="text-lg font-bold text-blue-600">Rp 2.725.000</span>
              </div>
            </div>
            
            <div className="bg-[#FFF8E6] border border-[#FDE6B5] rounded-xl p-4 flex gap-3 mb-6">
              <div className="text-amber-500 mt-0.5 flex-shrink-0">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed font-medium">
                Tagihan akan dikirim otomatis ke Orang Tua / Wali masing-masing siswa.
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowGenerateMonthModal(false)}
                className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  setShowGenerateMonthModal(false);
                  triggerToast("Tagihan SPP bulan ini berhasil digenerate!");
                }}
                className="flex-1 bg-[#1A3D63] hover:bg-[#122A44] text-white py-3 rounded-xl text-xs font-bold cursor-pointer border-none shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>
                Konfirmasi Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Program Baru */}
      {showAddProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddProgramModal(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative animate-scaleIn z-10">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Tambah Program Baru</h2>
              <button 
                onClick={() => setShowAddProgramModal(false)}
                className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            {/* Form Content */}
            <div className="p-6">
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Program</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Beasiswa Yatim Piatu"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Jenis</label>
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700 h-[46px]">
                      <option value="" disabled selected>Pilih jenis</option>
                      <option>Beasiswa</option>
                      <option>Potongan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700 h-[46px]">
                      <option value="" disabled selected>Pilih kategori</option>
                      <option>Akademik</option>
                      <option>Non-Akademik</option>
                      <option>Sosial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nilai (%)</label>
                    <input 
                      type="text" 
                      placeholder="50%"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Jumlah Penerima</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Periode</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: 2024/2025"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A3D63] bg-white text-gray-700 h-[46px]">
                      <option>Aktif</option>
                      <option>Non-Aktif</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
              <button 
                onClick={() => setShowAddProgramModal(false)}
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 px-8 rounded-xl text-sm font-bold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  setShowAddProgramModal(false);
                  triggerToast("Program baru berhasil ditambahkan!");
                }}
                className="bg-[#1A3D63] hover:bg-[#122A44] text-white py-3 px-8 rounded-xl text-sm font-bold cursor-pointer border-none shadow-md transition-all active:scale-[0.98] flex items-center gap-2"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Tambah Program
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default BendaharaDashboard;
