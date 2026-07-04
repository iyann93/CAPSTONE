import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import ManageUsers from "./ManageUsers";
import Profile from "../Profile";
import StudentData from "./StudentData";
import EmployeeData from "./EmployeeData";
import SystemSettings from "./SystemSettings";
import PlaceholderDashboard from "./PlaceholderDashboard";
import { getPendingUsers, activateUser, deactivateUser, getAuditLogs } from "../../api/system";

// Icons
const IconUsers = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const IconGraduation = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>;
const IconBriefcase = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>;
const IconPulse = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
const IconDatabase = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>;
const IconAlert = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const IconChevronDown = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>;

const StatCard = ({ icon, label, value, color, iconBg }) => (
  <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} ${color}`}>
        {icon}
      </div>
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
  </div>
);

const ExportLogsModal = ({ onClose }) => {
  const [range, setRange] = useState("Hari Ini");
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <h3 className="text-[17px] font-bold text-[#1A3D63]">Export System Logs</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-7">
          {/* Rentang Waktu */}
          <div>
            <label className="block text-[14px] font-bold text-gray-700 mb-3.5">Rentang Waktu</label>
            <div className="grid grid-cols-2 gap-3.5">
              {["Hari Ini", "7 Hari Terakhir", "30 Hari Terakhir", "Kustom"].map((r) => (
                <button 
                  key={r}
                  onClick={() => setRange(r)}
                  className={`flex items-center justify-center gap-2.5 py-3 rounded-xl border text-[13px] font-bold transition-all ${range === r ? "bg-[#1A3D63] border-[#1A3D63] text-white shadow-lg shadow-[#1A3D63]/20" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"}`}
                >
                  {r === "Hari Ini" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  )}
                  {r}
                </button>
              ))}
            </div>
          </div>
          {/* Level Log (Filter) */}
          <div>
            <label className="block text-[14px] font-bold text-gray-700 mb-3.5">Level Log (Filter)</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-3 px-4 py-2.5 bg-[#F8FAFC] border border-gray-100 rounded-xl cursor-pointer hover:border-gray-200 transition-all">
                <div className="w-4.5 h-4.5 bg-[#1A3D63] rounded-[4px] flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-white rounded-full opacity-0"></div>
                </div>
                <span className="text-[12px] font-bold text-gray-600">INFO</span>
              </label>
              <label className="flex items-center gap-3 px-4 py-3 bg-[#FFF7ED] border border-[#FED7AA]/30 rounded-xl cursor-pointer hover:border-[#FED7AA] transition-all">
                <div className="w-4.5 h-4.5 bg-orange-500 rounded-[4px]"></div>
                <span className="text-[12px] font-bold text-orange-600">WARN</span>
              </label>
              <label className="flex items-center gap-3 px-4 py-3 bg-[#FEF2F2] border border-[#FEE2E2]/30 rounded-xl cursor-pointer hover:border-[#FEE2E2] transition-all">
                <div className="w-4.5 h-4.5 bg-red-500 rounded-[4px]"></div>
                <span className="text-[12px] font-bold text-red-500">ERROR / CRITICAL</span>
              </label>
            </div>
          </div>
          {/* Modul */}
          <div>
            <label className="block text-[14px] font-bold text-gray-700 mb-3.5">Modul Sistem</label>
            <div className="relative">
              <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/10 focus:border-[#1A3D63] appearance-none transition-all">
                <option>Semua Modul</option>
                <option>Akademik</option>
                <option>Keuangan</option>
                <option>Master Data</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                <IconChevronDown />
              </div>
            </div>
          </div>
          {/* Format */}
          <div>
            <label className="block text-[14px] font-bold text-gray-700 mb-3.5">Format File</label>
            <div className="flex gap-8">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input type="radio" name="format" className="w-4.5 h-4.5 text-[#1A3D63] border-gray-300 focus:ring-[#1A3D63]/20" defaultChecked />
                <span className="text-[14px] font-bold text-gray-500 group-hover:text-gray-900 transition-colors flex items-center gap-2">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
                   CSV / Excel
                </span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input type="radio" name="format" className="w-4.5 h-4.5 text-[#1A3D63] border-gray-300 focus:ring-[#1A3D63]/20" />
                <span className="text-[14px] font-bold text-gray-500 group-hover:text-gray-900 transition-colors flex items-center gap-2">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M16 13H8M16 17H8M12 9H8" /></svg>
                   PDF
                </span>
              </label>
            </div>
          </div>
        </div>
        <div className="p-6 bg-[#F8FAFC]/50 border-t border-gray-100 flex items-center justify-end gap-5">
          <button onClick={onClose} className="text-[14px] font-bold text-gray-400 hover:text-gray-600 transition-colors">Batal</button>
          <button className="bg-[#1A3D63] text-white px-7 py-3 rounded-xl text-[14px] font-bold shadow-xl shadow-[#1A3D63]/25 hover:bg-[#122A44] transition-all flex items-center gap-2.5 active:scale-[0.98]">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
             Export & Unduh
          </button>
        </div>
      </div>
    </div>
  );
};

const MassActivationModal = ({ onClose }) => {
  const [sendEmail, setSendEmail] = useState(true);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-[17px] font-bold text-gray-800">Konfirmasi Aktivasi Massal</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <p className="text-gray-600 text-sm leading-relaxed">
            Anda akan menyetujui dan mengaktifkan <span className="font-semibold text-gray-850">24 akun</span> yang saat ini berstatus Pending. Pengguna akan segera dapat login ke dalam sistem.
          </p>

          {/* Ringkasan Role */}
          <div className="border border-gray-100 rounded-2xl p-5 bg-white space-y-4">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Ringkasan Role
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-[#1E293B]"></span>
                  <span>Siswa</span>
                </div>
                <span className="font-bold text-gray-800">18 Akun</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                  <span>Orang Tua</span>
                </div>
                <span className="font-bold text-gray-800">4 Akun</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                  <span>Guru Mapel</span>
                </div>
                <span className="font-bold text-gray-800">2 Akun</span>
              </div>
            </div>
          </div>

          {/* Kirim Email Option */}
          <div 
            onClick={() => setSendEmail(!sendEmail)}
            className="border border-gray-100 rounded-2xl p-4 flex gap-3 cursor-pointer bg-white select-none hover:border-gray-200 transition-colors"
          >
            <div className="mt-0.5">
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                sendEmail ? "bg-[#1A3D63] text-white" : "border-2 border-gray-300 bg-white"
              }`}>
                {sendEmail && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-800 leading-tight">
                Kirim email pemberitahuan massal
              </div>
              <div className="text-[11px] text-gray-400 leading-normal mt-1">
                Setiap pengguna akan menerima email konfirmasi bahwa akun mereka telah aktif beserta link login.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-4 bg-gray-50/50">
          <button 
            onClick={onClose} 
            className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors mr-2"
          >
            Batal
          </button>
          <button 
            onClick={() => {
              alert("Aktivasi massal berhasil disetujui!");
              onClose();
            }}
            className="bg-[#059669] hover:bg-[#047857] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Setujui 24 Akun
          </button>
        </div>
      </div>
    </div>
  );
};

const ReactivateAccountModal = ({ user, onClose }) => {
  const [sendEmail, setSendEmail] = useState(true);
  const [requireReset, setRequireReset] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                <line x1="12" y1="2" x2="12" y2="12" />
              </svg>
            </div>
            <h3 className="text-[17px] font-bold text-gray-800">Aktivasi Ulang Akun</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <p className="text-gray-600 text-sm leading-relaxed">
            Anda akan mengaktifkan kembali akun pengguna berikut. Pengguna akan dapat login kembali menggunakan password terakhir mereka.
          </p>

          {/* User Info Card */}
          <div className="border border-gray-100 rounded-2xl p-5 bg-white flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-650 font-bold text-base flex-shrink-0">
              {user.initials}
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-805 leading-tight">{user.name}</span>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mt-1">
                <span>💼 {user.role}</span>
                <span>•</span>
                <span>ðŸ—“ï¸ Nonaktif: {user.date}</span>
              </div>
            </div>
          </div>

          {/* Kirim Email Option */}
          <div 
            onClick={() => setSendEmail(!sendEmail)}
            className="border border-gray-100 rounded-2xl p-4 flex gap-3 cursor-pointer bg-white select-none hover:border-gray-200 transition-colors"
          >
            <div className="mt-0.5">
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                sendEmail ? "bg-[#1A3D63] text-white" : "border-2 border-gray-300 bg-white"
              }`}>
                {sendEmail && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-800 leading-tight">
                Kirim email pemberitahuan
              </div>
              <div className="text-[11px] text-gray-400 leading-normal mt-1">
                Beritahu pengguna bahwa akun mereka telah aktif kembali.
              </div>
            </div>
          </div>

          {/* Wajibkan Reset Password Option */}
          <div 
            onClick={() => setRequireReset(!requireReset)}
            className="border border-gray-100 rounded-2xl p-4 flex gap-3 cursor-pointer bg-white select-none hover:border-gray-200 transition-colors"
          >
            <div className="mt-0.5">
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                requireReset ? "bg-[#1A3D63] text-white" : "border-2 border-gray-300 bg-white"
              }`}>
                {requireReset && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-805 leading-tight">
                Wajibkan reset password
              </div>
              <div className="text-[11px] text-gray-400 leading-normal mt-1">
                Pengguna harus mengubah kata sandi saat login pertama kali.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-4 bg-gray-50/50">
          <button 
            onClick={onClose} 
            className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors mr-2"
          >
            Batal
          </button>
          <button 
            onClick={() => {
              alert(`Akun ${user.name} berhasil diaktifkan kembali!`);
              onClose();
            }}
            className="bg-[#1A3D63] hover:bg-[#112a47] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-[#1A3D63]/10 hover:shadow-[#1A3D63]/20 active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Ya, Aktivasi Ulang
          </button>
        </div>
      </div>
    </div>
  );
};

const ActivationModule = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [showMassActivationModal, setShowMassActivationModal] = useState(false);
  const [reactivateUser, setReactivateUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const triggerToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const rows = await getPendingUsers();
      setAllUsers(Array.isArray(rows) ? rows : []);
    } catch (e) {
      console.error('loadUsers:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleActivate = async (userId, userName) => {
    try {
      await activateUser(userId);
      triggerToast(`Akun ${userName} berhasil diaktifkan!`);
      loadUsers();
    } catch (e) {
      triggerToast('Gagal mengaktifkan akun', 'error');
    }
  };

  const handleDeactivate = async (userId, userName) => {
    try {
      await deactivateUser(userId);
      triggerToast(`Akun ${userName} berhasil dinonaktifkan!`);
      loadUsers();
    } catch (e) {
      triggerToast('Gagal menonaktifkan akun', 'error');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getInitials = (nama) => {
    if (!nama) return '?';
    return nama.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = allUsers.filter(u => 
    (u.nama || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(u => activeTab === "Pending" ? !u.is_active : !u.is_active);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-bold shadow-xl ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
        }`}>{toast.msg}</div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-gray-800 tracking-tight">Aktivasi & Nonaktif Akun</h1>
          <p className="text-gray-400 text-[14px] mt-1 font-medium">Kelola persetujuan akun baru dan status aktif/nonaktif pengguna.</p>
        </div>
        <button 
          onClick={() => setShowMassActivationModal(true)}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-50 transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="m9 12 2 2 4-4" /></svg>
          Aktivasi Massal
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Menunggu Persetujuan / Nonaktif */}
        <div 
          className={`bg-white rounded-2xl p-5 border flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer select-none border-orange-200 ring-1 ring-orange-50/50`}
        >
          <div className="w-14 h-14 rounded-full bg-[#FFF7ED] flex items-center justify-center text-orange-500 flex-shrink-0">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          </div>
          <div>
            <div className="text-gray-500 text-sm font-medium mb-1">Akun Nonaktif</div>
            <div className="text-3xl font-bold text-gray-800 leading-none">{isLoading ? '...' : allUsers.length}</div>
          </div>
        </div>

        {/* Aktivasi Bulan Ini */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100/80 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="w-14 h-14 rounded-full bg-[#ECFDF5] flex items-center justify-center text-emerald-500 flex-shrink-0">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></svg>
          </div>
          <div>
            <div className="text-gray-500 text-sm font-medium mb-1">Aksi: Aktifkan / Nonaktifkan</div>
            <div className="text-xl font-bold text-gray-600 leading-none">Pilih dari tabel</div>
          </div>
        </div>

        {/* Refresh */}
        <div 
          onClick={loadUsers}
          className="bg-white rounded-2xl p-5 border border-gray-100/80 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-[#EFF6FF] flex items-center justify-center text-blue-500 flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
          </div>
          <div>
            <div className="text-gray-500 text-sm font-medium mb-1">Refresh Data</div>
            <div className="text-sm font-bold text-blue-500 leading-none">Klik untuk reload</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Tabs & Search */}
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("Pending")}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "Pending"
                  ? "bg-white border border-gray-200 text-gray-800 shadow-sm"
                  : "text-gray-400 hover:text-gray-600 border border-transparent"
              }`}
            >
              Pending (24)
            </button>
            <button
              onClick={() => setActiveTab("Nonaktif")}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "Nonaktif"
                  ? "bg-white border border-gray-200 text-gray-800 shadow-sm"
                  : "text-gray-400 hover:text-gray-600 border border-transparent"
              }`}
            >
              Nonaktif (156)
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
              <IconSearch />
            </div>
            <input 
              type="text" 
              placeholder="Cari nama atau email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-200 focus:border-gray-300 rounded-xl pl-10 pr-4 py-2 text-sm w-full md:w-[280px] outline-none transition-all placeholder:text-gray-400 text-gray-700 bg-white" 
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left"></th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Pengguna & Email</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Tgl. Daftar</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">Memuat data...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">Tidak ada akun nonaktif</td></tr>
              ) : (
                filteredUsers.map((u, i) => (
                  <tr key={u.id || i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4"></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-xs font-bold text-[#475569]">
                          {getInitials(u.nama)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-800 leading-tight">{u.nama}</span>
                          <span className="text-xs text-gray-400 font-medium mt-0.5">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 bg-[#F1F5F9] text-gray-700 rounded-md text-xs font-medium">
                        {u.roles || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{formatDate(u.created_at)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-red-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        <span className="text-sm font-semibold">Nonaktif</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleActivate(u.id, u.nama)}
                        className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3.5 py-2 rounded-lg text-xs font-semibold border border-emerald-200 shadow-sm transition-all active:scale-[0.98]"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        Aktifkan
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F8FAFC]/30">
          <span className="text-xs text-gray-400 font-medium">
            Menampilkan {filteredUsers.length} akun nonaktif
          </span>
        </div>
      </div>
      {showMassActivationModal && <MassActivationModal onClose={() => setShowMassActivationModal(false)} />}
      {reactivateUser && <ReactivateAccountModal user={reactivateUser} onClose={() => setReactivateUser(null)} />}
    </div>
  );
};

const RolePermissionModule = () => {
  const [selectedRoleId, setSelectedRoleId] = useState("admintu");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [newRolePerms, setNewRolePerms] = useState({});

  const roles = [
    { id: "superadmin", name: "Super Admin", usersCount: 2, isSystem: true, locked: true, description: "Hak akses penuh untuk mengelola seluruh aspek sistem, konfigurasi, backup, restore, dan database." },
    { id: "kepsek", name: "Kepala Sekolah", usersCount: 1, isSystem: true, locked: true, description: "Memantau laporan akademik, keuangan, guru, staf, siswa, serta menyetujui kebijakan strategis sekolah." },
    { id: "wakepsek", name: "Wakil Kepala", usersCount: 3, isSystem: true, locked: true, description: "Mengelola operasional sekolah harian, kurikulum, kesiswaan, humas, dan sarana prasarana." },
    { id: "admintu", name: "Admin TU", usersCount: 5, isSystem: true, locked: true, description: "Kelola Akademik (mata pelajaran, semester, data kelas, jadwal pelajaran, kenaikan kelas, data kelulusan). Kelola siswa(data siswa, absensi siswa, kartu pelajar)." },
    { id: "walikelas", name: "Wali Kelas", usersCount: 32, isSystem: true, locked: true, description: "Mengelola absensi kelas, nilai rapor, bimbingan siswa, serta berkomunikasi dengan orang tua siswa kelas tertentu." },
    { id: "gurumapel", name: "Guru Mapel", usersCount: 80, isSystem: true, locked: true, description: "Mengelola materi pembelajaran, tugas, ujian, dan penilaian siswa untuk mata pelajaran yang diajarkan." },
    { id: "orangtua", name: "Orang Tua", usersCount: 1240, isSystem: true, locked: true, description: "Memantau perkembangan belajar anak, absensi, jadwal pelajaran, tagihan SPP, dan pengumuman sekolah." },
    { id: "bendaharaosis", name: "Bendahara OSIS", usersCount: 4, isSystem: false, locked: false, description: "Kelola anggaran kegiatan kesiswaan, iuran OSIS, serta laporan pertanggungjawaban dana kegiatan." }
  ];

  // Default permissions map
  const [permissions, setPermissions] = useState({
    superadmin: {
      "Akses Data User": { lihat: true, buat: true, ubah: true, hapus: true },
      "Aktivasi & Nonaktif": { lihat: true, buat: true, ubah: true, hapus: true },
      "Reset Password": { lihat: true, buat: true, ubah: true, hapus: true },
      "Mata Pelajaran & Kelas": { lihat: true, buat: true, ubah: true, hapus: true },
      "Jadwal Pelajaran": { lihat: true, buat: true, ubah: true, hapus: true },
      "Data Kelulusan": { lihat: true, buat: true, ubah: true, hapus: true },
      "Tagihan SPP": { lihat: true, buat: true, ubah: true, hapus: true },
      "Laporan Keuangan": { lihat: true, buat: true, ubah: true, hapus: true }
    },
    admintu: {
      "Akses Data User": { lihat: true, buat: true, ubah: true, hapus: false },
      "Aktivasi & Nonaktif": { lihat: true, buat: true, ubah: true, hapus: false },
      "Reset Password": { lihat: true, buat: true, ubah: true, hapus: false },
      "Mata Pelajaran & Kelas": { lihat: true, buat: true, ubah: true, hapus: true },
      "Jadwal Pelajaran": { lihat: true, buat: true, ubah: true, hapus: true },
      "Data Kelulusan": { lihat: true, buat: true, ubah: true, hapus: false },
      "Tagihan SPP": { lihat: true, buat: false, ubah: false, hapus: false },
      "Laporan Keuangan": { lihat: true, buat: false, ubah: false, hapus: false }
    },
    kepsek: {
      "Akses Data User": { lihat: true, buat: false, ubah: false, hapus: false },
      "Aktivasi & Nonaktif": { lihat: true, buat: false, ubah: false, hapus: false },
      "Reset Password": { lihat: true, buat: false, ubah: false, hapus: false },
      "Mata Pelajaran & Kelas": { lihat: true, buat: false, ubah: false, hapus: false },
      "Jadwal Pelajaran": { lihat: true, buat: false, ubah: false, hapus: false },
      "Data Kelulusan": { lihat: true, buat: false, ubah: false, hapus: false },
      "Tagihan SPP": { lihat: true, buat: false, ubah: false, hapus: false },
      "Laporan Keuangan": { lihat: true, buat: false, ubah: false, hapus: false }
    }
  });

  const selectedRole = roles.find(r => r.id === selectedRoleId) || roles[0];

  const handleToggle = (feature, action) => {
    setPermissions(prev => {
      const rolePerms = prev[selectedRoleId] || {
        "Akses Data User": { lihat: false, buat: false, ubah: false, hapus: false },
        "Aktivasi & Nonaktif": { lihat: false, buat: false, ubah: false, hapus: false },
        "Reset Password": { lihat: false, buat: false, ubah: false, hapus: false },
        "Mata Pelajaran & Kelas": { lihat: false, buat: false, ubah: false, hapus: false },
        "Jadwal Pelajaran": { lihat: false, buat: false, ubah: false, hapus: false },
        "Data Kelulusan": { lihat: false, buat: false, ubah: false, hapus: false },
        "Tagihan SPP": { lihat: false, buat: false, ubah: false, hapus: false },
        "Laporan Keuangan": { lihat: false, font: false, ubah: false, hapus: false }
      };

      return {
        ...prev,
        [selectedRoleId]: {
          ...rolePerms,
          [feature]: {
            ...rolePerms[feature],
            [action]: !rolePerms[feature]?.[action]
          }
        }
      };
    });
  };

  const getPermission = (feature, action) => {
    const rolePerms = permissions[selectedRoleId] || {
      "Akses Data User": { lihat: false, buat: false, ubah: false, hapus: false },
      "Aktivasi & Nonaktif": { lihat: false, buat: false, ubah: false, hapus: false },
      "Reset Password": { lihat: false, buat: false, ubah: false, hapus: false },
      "Mata Pelajaran & Kelas": { lihat: false, buat: false, ubah: false, hapus: false },
      "Jadwal Pelajaran": { lihat: false, buat: false, ubah: false, hapus: false },
      "Data Kelulusan": { lihat: false, buat: false, ubah: false, hapus: false },
      "Tagihan SPP": { lihat: false, buat: false, ubah: false, hapus: false },
      "Laporan Keuangan": { lihat: false, buat: false, ubah: false, hapus: false }
    };
    return rolePerms[feature]?.[action] || false;
  };

  const filteredRoles = roles.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const permissionStructure = [
    {
      category: "MANAJEMEN PENGGUNA",
      features: ["Akses Data User", "Aktivasi & Nonaktif", "Reset Password"]
    },
    {
      category: "MODUL AKADEMIK",
      features: ["Mata Pelajaran & Kelas", "Jadwal Pelajaran", "Data Kelulusan"]
    },
    {
      category: "MODUL KEUANGAN",
      features: ["Tagihan SPP", "Laporan Keuangan"]
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-gray-800 tracking-tight">Role & Permission (RBAC)</h1>
          <p className="text-gray-400 text-[14px] mt-1 font-medium font-sans">Kelola hak akses untuk setiap role dalam sistem.</p>
        </div>
        <div className="flex items-center gap-3">
          {isCreating ? (
            <button
              onClick={() => { setIsCreating(false); setNewRoleName(""); setNewRoleDesc(""); setNewRolePerms({}); }}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-gray-50 transition-all"
            >
              Batal
            </button>
          ) : (
            <>
              <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-gray-50 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                Duplikat Role
              </button>
              <button
                onClick={() => { setIsCreating(true); setSelectedRoleId(null); }}
                className="flex items-center gap-2 bg-[#1A3D63] hover:bg-[#122a47] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-[#1A3D63]/10 transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Tambah Role Baru
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column: Daftar Role */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-800">Daftar Role</h3>
            <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full">
              {roles.length}
            </span>
          </div>

          {/* Search Role */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <IconSearch />
            </div>
            <input 
              type="text" 
              placeholder="Cari role..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-200 focus:border-gray-300 rounded-xl pl-9 pr-4 py-2 text-sm w-full outline-none transition-all placeholder:text-gray-400 text-gray-700 bg-white" 
            />
          </div>

          {/* Role List */}
          <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
            {/* New Role placeholder item */}
            {isCreating && (
              <div className="w-full flex items-center justify-between p-4 rounded-xl bg-[#F1F5F9] select-none">
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-gray-800 leading-tight">
                    {newRoleName.trim() ? newRoleName : "Role Baru..."}
                  </span>
                  <span className="text-[11px] text-gray-400 mt-1 font-medium">👥 0 Pengguna</span>
                </div>
              </div>
            )}
            {filteredRoles.map((r) => {
              const isSelected = !isCreating && r.id === selectedRoleId;
              return (
                <div
                  key={r.id}
                  onClick={() => { setIsCreating(false); setSelectedRoleId(r.id); }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all select-none ${
                    isSelected
                      ? "bg-[#F1F5F9] text-gray-800"
                      : "hover:bg-gray-50/80 text-gray-550 bg-white"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className={`text-[14px] leading-tight ${isSelected ? "font-bold text-gray-800" : "font-semibold text-gray-750"}`}>
                      {r.name}
                    </span>
                    <span className="text-[11px] text-gray-400 mt-1 font-medium">
                      👥 {r.usersCount.toLocaleString()} Pengguna
                    </span>
                  </div>
                  {r.locked && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Permissions Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6">
          {isCreating ? (
            /* CREATE MODE HEADER */
            <>
              <div className="flex flex-col gap-4">
                {/* Nama Role */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Role</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Masukkan nama role..."
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      className="flex-1 border border-gray-200 focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-700 placeholder:text-gray-400"
                    />
                    <button
                      onClick={() => {
                        if (!newRoleName.trim()) { alert("Nama role tidak boleh kosong!"); return; }
                        alert(`Role "${newRoleName}" berhasil disimpan!`);
                        setIsCreating(false); setNewRoleName(""); setNewRoleDesc(""); setNewRolePerms({});
                      }}
                      className="flex items-center gap-1.5 bg-[#1A3D63] hover:bg-[#122a47] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-[#1A3D63]/10 transition-all flex-shrink-0"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                      Simpan Role
                    </button>
                  </div>
                </div>
                {/* Deskripsi Role */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Role</label>
                  <textarea
                    placeholder="Deskripsikan tanggung jawab dan akses untuk role ini..."
                    value={newRoleDesc}
                    onChange={(e) => setNewRoleDesc(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 focus:border-[#1A3D63] focus:ring-2 focus:ring-[#1A3D63]/10 rounded-xl px-4 py-3 text-sm outline-none transition-all text-gray-700 placeholder:text-gray-400 resize-none"
                  />
                </div>
              </div>
            </>
          ) : (
            /* VIEW MODE HEADER */
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold text-gray-800 leading-none">{selectedRole?.name}</h2>
                  <span className={`px-2 py-0.5 text-[9.5px] font-black tracking-widest rounded-md ${
                    selectedRole?.isSystem ? "bg-[#F1F5F9] text-gray-500" : "bg-blue-50 text-blue-600"
                  }`}>
                    {selectedRole?.isSystem ? "SYSTEM ROLE" : "CUSTOM ROLE"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[560px]">{selectedRole?.description}</p>
              </div>
              <button
                onClick={() => alert("Perubahan hak akses berhasil disimpan!")}
                className="flex items-center gap-1.5 bg-[#1A3D63] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-[#1A3D63]/10 hover:bg-[#122a47] transition-all self-start flex-shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Simpan Perubahan
              </button>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Modul / Fitur</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider w-20">Lihat</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider w-20">Buat</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider w-20">Ubah</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider w-20">Hapus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {permissionStructure.map((cat, ci) => (
                  <React.Fragment key={ci}>
                    {/* Category Divider Row */}
                    <tr className="bg-gray-50/10">
                      <td colSpan="5" className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/20">
                        {cat.category}
                      </td>
                    </tr>
                    {/* Features under category */}
                    {cat.features.map((feature, fi) => (
                      <tr key={fi} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                          {feature}
                        </td>
                        {["lihat", "buat", "ubah", "hapus"].map((action) => {
                          const isChecked = isCreating
                            ? !!(newRolePerms[feature]?.[action])
                            : getPermission(feature, action);
                          const handleClick = isCreating
                            ? () => setNewRolePerms(prev => ({
                                ...prev,
                                [feature]: { ...(prev[feature] || {}), [action]: !prev[feature]?.[action] }
                              }))
                            : () => handleToggle(feature, action);
                          return (
                            <td key={action} className="px-4 py-4 text-center">
                              <div className="flex justify-center">
                                <div
                                  onClick={handleClick}
                                  className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-all ${
                                    isChecked
                                      ? "bg-[#1A3D63] text-white shadow-sm"
                                      : "border-2 border-gray-200 bg-white hover:border-gray-300"
                                  }`}
                                >
                                  {isChecked && (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuperAdminOverview = ({ onExportClick, onViewChange }) => {
  const [showQuickAction, setShowQuickAction] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const rbacChanges = [
    { name: "Dr. Wahyu", oldRole: "Guru", newRole: "Admin TU", time: "10:45" },
    { name: "Siti Aminah", oldRole: "Staf", newRole: "Bendahara", time: "09:30" },
    { name: "Ahmad Ridwan", oldRole: "Siswa", newRole: "Alumni", time: "Kemarin" },
    { name: "Budi Santoso", oldRole: "-", newRole: "Guru", time: "Kemarin" },
    { name: "System Admin", oldRole: "Super", newRole: "Super", time: "2 hari lalu" },
    { name: "Kepala Sekolah", oldRole: "Guru", newRole: "Kepsek", time: "3 hari lalu" },
    { name: "User Test", oldRole: "Siswa", newRole: "Nonaktif", time: "3 hari lalu" },
  ];

  const systemLogs = [
    { time: "11:02:45", message: "Database backup completed successfully" },
    { time: "10:55:12", message: "High CPU usage detected (85%) on Node-1" },
    { time: "10:15:00", message: "User Budi_S logged in via Web" },
    { time: "09:42:11", message: "Failed to send email notification to User_" },
    { time: "09:30:00", message: "Cron job: Daily attendance calculation sta" },
    { time: "08:15:22", message: "System update v2.4.1 applied" },
    { time: "07:00:05", message: "Service [PaymentGateway] restarted" },
  ];

  const filteredRbacChanges = rbacChanges.filter(row =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.newRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSystemLogs = systemLogs.filter(log =>
    log.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Super Admin Console</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
              <IconSearch />
            </div>
            <input 
              type="text" 
              placeholder="Cari user, role, atau log..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm w-full md:w-[280px] focus:outline-none focus:ring-2 focus:ring-[#1A3D63]/10 focus:border-[#1A3D63] transition-all"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowQuickAction(!showQuickAction)}
              className="flex items-center gap-2 bg-[#1A3D63] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#1A3D63]/20 hover:bg-[#122A44] transition-all active:scale-[0.98]"
            >
              <span>Quick Action</span>
              <IconChevronDown />
            </button>
            
            {showQuickAction && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowQuickAction(false)}></div>
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100/80 py-0 z-20 overflow-hidden animate-slideUp">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-gray-100 text-xs font-bold text-slate-500">
                    Manajemen Akun
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <button onClick={() => { onViewChange?.("Kelola Pengguna"); setShowQuickAction(false); }} className="w-full text-left px-3 py-2 text-[13px] font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A3D63]">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <line x1="20" y1="8" x2="20" y2="14" />
                        <line x1="17" y1="11" x2="23" y2="11" />
                      </svg>
                      Tambah Akun User
                    </button>
                    <button onClick={() => { onViewChange?.("Aktivasi & Nonaktif"); setShowQuickAction(false); }} className="w-full text-left px-3 py-2 text-[13px] font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A3D63]">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <polyline points="17 11 19 13 23 9" />
                      </svg>
                      Aktivasi / Nonaktif User
                    </button>
                    <button onClick={() => { onViewChange?.("Kelola Pengguna"); setShowQuickAction(false); }} className="w-full text-left px-3 py-2 text-[13px] font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zM12 12l.5-1.5L14 11l.5-1.5L16 10l3.5-3.5L21 4" />
                      </svg>
                      Reset Password User
                    </button>
                  </div>
                  
                  <div className="px-4 py-2.5 bg-slate-50 border-y border-gray-100 text-xs font-bold text-slate-500">
                    Sistem & Akses
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <button onClick={() => { onViewChange?.("Role & Permission"); setShowQuickAction(false); }} className="w-full text-left px-3 py-2 text-[13px] font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A3D63]">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      Kelola Role (RBAC)
                    </button>
                    <button onClick={() => { onViewChange?.("Backup & Maintenance"); setShowQuickAction(false); }} className="w-full text-left px-3 py-2 text-[13px] font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                        <ellipse cx="12" cy="5" rx="9" ry="3" />
                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
                      </svg>
                      Backup Sistem Manual
                    </button>
                    <button onClick={() => { onViewChange?.("Hak Akses Sistem"); setShowQuickAction(false); }} className="w-full text-left px-3 py-2 text-[13px] font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                        <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                        <line x1="12" y1="2" x2="12" y2="12" />
                      </svg>
                      Maintenance Mode
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={<IconUsers />} label="Total User" value="1,582" color="text-blue-600" iconBg="bg-blue-50" />
        <StatCard icon={<IconGraduation />} label="Siswa Aktif" value="1,248" color="text-indigo-600" iconBg="bg-indigo-50" />
        <StatCard icon={<IconBriefcase />} label="Guru & Staf" value="112" color="text-emerald-600" iconBg="bg-emerald-50" />
        <StatCard icon={<IconPulse />} label="Sistem Uptime" value="99.9%" color="text-teal-600" iconBg="bg-teal-50" />
        <StatCard icon={<IconDatabase />} label="Storage" value="68%" color="text-amber-600" iconBg="bg-amber-50" />
        <StatCard icon={<IconAlert />} label="Error Logs" value="3" color="text-red-600" iconBg="bg-red-50" />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* RBAC Changes Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <h3 className="font-bold text-gray-800">Hak Akses & Role Terakhir Diubah</h3>
            </div>
            <button className="text-xs font-bold text-[#1A3D63] hover:underline">Kelola RBAC</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">NAMA</th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">ROLE LAMA</th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">ROLE BARU</th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">WAKTU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRbacChanges.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">{row.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-medium">{row.oldRole}</td>
                    <td className="px-6 py-4 text-sm text-[#1A3D63] font-bold">{row.newRole}</td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-medium">{row.time}</td>
                  </tr>
                ))}
                {filteredRbacChanges.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Tidak ada perubahan role yang cocok</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-gray-400 font-bold text-base">&gt;_</span>
              <h3 className="font-bold text-gray-800">Activity Log</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">TIMESTAMP</th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">EVENT / MESSAGE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-mono">
                {filteredSystemLogs.map((log, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-[13px] text-gray-400 font-medium">{log.time}</td>
                    <td className="px-6 py-4 text-[13px] text-gray-700 leading-relaxed min-w-[300px]">{log.message}</td>
                  </tr>
                ))}
                {filteredSystemLogs.length === 0 && (
                  <tr><td colSpan={2} className="px-6 py-8 text-center text-gray-400 font-sans">Tidak ada log aktivitas yang cocok</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===================== HAK AKSES SISTEM MODULE =====================
const Toggle = ({ checked, onChange, disabled = false }) => (
  <button
    onClick={() => !disabled && onChange(!checked)}
    className={`relative inline-flex items-center w-11 h-6 rounded-full transition-all duration-300 focus:outline-none ${
      disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
    } ${checked ? "bg-[#1A3D63]" : "bg-gray-200"}`}
  >
    <span
      className={`inline-block w-4 h-4 bg-white rounded-full shadow-sm transform transition-all duration-300 ${
        checked ? "translate-VII-6" : "translate-VII-1"
      }`}
    />
  </button>
);

const HakAksesSistemModule = () => {
  // Status Platform
  const [isMaintenance, setIsMaintenance] = useState(false);

  // Keamanan Sesi
  const [twoFA, setTwoFA] = useState(true);
  const [blockAfterFail, setBlockAfterFail] = useState(true);
  const [multiDevice, setMultiDevice] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("1 Jam");

  // IP Whitelist
  const [ipList, setIpList] = useState([
    { id: 1, range: "192.168.1.100 - 192.168.1.255", label: "Jaringan Lab Komputer Sekolah" },
    { id: 2, range: "203.0.113.42", label: "IP Statis Ruang Server / TU" },
  ]);
  const [showAddIp, setShowAddIp] = useState(false);
  const [newIpRange, setNewIpRange] = useState("");
  const [newIpLabel, setNewIpLabel] = useState("");

  // SSO
  const [googleSSO, setGoogleSSO] = useState(true);
  const [microsoftSSO, setMicrosoftSSO] = useState(false);

  // Reset Modal
  const [showResetModal, setShowResetModal] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleReset = () => {
    setIsMaintenance(false);
    setTwoFA(false);
    setBlockAfterFail(false);
    setMultiDevice(false);
    setSessionTimeout("1 Jam");
    setIpList([]);
    setShowAddIp(false);
    setNewIpRange("");
    setNewIpLabel("");
    setGoogleSSO(false);
    setMicrosoftSSO(false);
    setShowResetModal(false);
    showToast("Pengaturan berhasil direset ke default!");
  };

  const handleDeleteIp = (id) => {
    setIpList(prev => prev.filter(ip => ip.id !== id));
  };

  const handleAddIp = () => {
    if (!newIpRange.trim()) return;
    setIpList(prev => [...prev, { id: Date.now(), range: newIpRange.trim(), label: newIpLabel.trim() || "IP Baru" }]);
    setNewIpRange("");
    setNewIpLabel("");
    setShowAddIp(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[200] bg-[#1A3D63] text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-3 animate-slideUp">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          {toastMsg}
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowResetModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <h3 className="text-[17px] font-bold text-gray-800">Reset ke Pengaturan Default?</h3>
              </div>
              <button onClick={() => setShowResetModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 pb-2 space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                Tindakan ini akan mengembalikan seluruh pengaturan Hak Akses Sistem ke konfigurasi awal bawaan sistem. Apakah Anda yakin ingin melanjutkan?
              </p>

              {/* Changes Preview */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Pengaturan yang akan diubah:</div>
                <div className="space-y-2">
                  {[
                    { label: "Autentikasi 2FA", value: "Dinonaktifkan", danger: true },
                    { label: "Batas Sesi / Timeout", value: "1 Jam", danger: false },
                    { label: "Whitelist IP Address", value: "Akan dihapus semua", danger: true },
                    { label: "Konfigurasi SSO", value: "Dinonaktifkan", danger: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-sm">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span className="text-gray-600">{item.label}:</span>
                      <span className={`font-bold ${item.danger ? "text-red-500" : "text-gray-700"}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning Note */}
              <div className="flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-xl p-3.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p className="text-xs text-orange-700 leading-relaxed">
                  Sesi login yang sedang aktif (termasuk milik Anda) tidak akan diputus. Pengaturan baru akan berlaku pada login berikutnya.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-5">
              <button
                onClick={() => setShowResetModal(false)}
                className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors px-4 py-2"
              >
                Batal
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-red-500/20 transition-all active:scale-[0.98]"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.89"/></svg>
                Ya, Reset Pengaturan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-gray-800 tracking-tight">Hak Akses Sistem</h1>
          <p className="text-gray-400 text-[14px] mt-1 font-medium">Konfigurasi keamanan global, sesi, dan kebijakan akses jaringan sistem.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-gray-50 transition-all"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.89" /></svg>
            Reset Default
          </button>
          <button
            onClick={() => showToast("Pengaturan berhasil disimpan!")}
            className="flex items-center gap-2 bg-[#1A3D63] hover:bg-[#122a47] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-[#1A3D63]/20 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13" /><polyline points="7 3 7 8 15 8" /></svg>
            Simpan Pengaturan
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">

        {/* === LEFT COLUMN === */}
        <div className="flex flex-col gap-6">

          {/* Status Platform Global */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              </div>
              <h2 className="text-[15px] font-bold text-gray-800">Status Platform Global</h2>
            </div>
            <div className="p-5 space-y-3">
              {/* Mode Normal */}
              <div className={`rounded-xl border-2 p-4 transition-all ${!isMaintenance ? "border-[#1A3D63]/20 bg-[#F0F4FF]" : "border-gray-100 bg-white"}` }>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-gray-800">Mode Normal Aktif</div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">Sistem berjalan normal. Seluruh pengguna dapat login dan mengakses sistem sesuai dengan role masing-masing.</div>
                  </div>
                  <Toggle checked={!isMaintenance} onChange={(v) => setIsMaintenance(!v)} />
                </div>
              </div>

              {/* Mode Maintenance */}
              <div className={`rounded-xl border-2 p-4 transition-all ${isMaintenance ? "border-orange-200 bg-orange-50" : "border-gray-100 bg-white"}` }>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                      <span className={`text-sm font-bold ${isMaintenance ? "text-orange-600" : "text-gray-500"}`}>Mode Maintenance (Pemeliharaan)</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">Hanya akun dengan role Super Admin yang dapat mengakses sistem. Pengguna lain akan melihat halaman pemeliharaan.</div>
                  </div>
                  <Toggle checked={isMaintenance} onChange={setIsMaintenance} />
                </div>
              </div>
            </div>
          </div>

          {/* Keamanan Sesi & Kata Sandi */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </div>
              <h2 className="text-[15px] font-bold text-gray-800">Keamanan Sesi &amp; Kata Sandi</h2>
            </div>
            <div className="p-5 space-y-5">

              {/* 2FA */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-gray-800">Wajibkan Autentikasi Dua Faktor (2FA)</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">Haruskan seluruh System Role (Super Admin, Kepsek, Admin TU) menggunakan 2FA saat login.</div>
                </div>
                <Toggle checked={twoFA} onChange={setTwoFA} />
              </div>

              <div className="border-t border-gray-100" />

              {/* Blokir Akun */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-gray-800">Blokir Akun Setelah Gagal Login</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">Akun akan diblokir sementara jika salah memasukkan password sebanyak 5 kali berturut-turut.</div>
                </div>
                <Toggle checked={blockAfterFail} onChange={setBlockAfterFail} />
              </div>

              <div className="border-t border-gray-100" />

              {/* Multi-device */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-gray-800">Izinkan Sesi Ganda (Multi-device)</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">Izinkan pengguna login dari beberapa perangkat yang berbeda secara bersamaan.</div>
                </div>
                <Toggle checked={multiDevice} onChange={setMultiDevice} />
              </div>

              <div className="border-t border-gray-100" />

              {/* Session Timeout */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-gray-800">Batas Waktu Sesi (Timeout)</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">Pengguna akan otomatis logout jika tidak ada aktivitas selama periode ini.</div>
                </div>
                <div className="relative">
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#1A3D63]/30 transition-all cursor-pointer"
                  >
                    {["30 Menit", "1 Jam", "2 Jam", "4 Jam", "8 Jam"].map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN === */}
        <div className="flex flex-col gap-6">

          {/* Autentikasi SSO */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
              </div>
              <h2 className="text-[15px] font-bold text-gray-800">Autentikasi SSO</h2>
            </div>
            <div className="p-5">
              <p className="text-xs text-gray-500 leading-relaxed mb-4">Izinkan pengguna login menggunakan akun layanan pihak ketiga (hanya email dengan domain sekolah yang diizinkan).</p>

              <div className="space-y-3">
                {/* Google */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-sm font-bold text-red-500">G</div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">Google Workspace</div>
                      <div className="text-xs text-gray-500">
                        {googleSSO ? "Aktif untuk domain @siswa.sch.id" : "Belum dikonfigurasi"}
                      </div>
                    </div>
                  </div>
                  <Toggle checked={googleSSO} onChange={setGoogleSSO} />
                </div>

                {/* Microsoft */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-sm font-bold text-blue-600">M</div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">Microsoft 365</div>
                      <div className="text-xs text-gray-500">
                        {microsoftSSO ? "Aktif untuk domain @sekolah.sch.id" : "Belum dikonfigurasi"}
                      </div>
                    </div>
                  </div>
                  <Toggle checked={microsoftSSO} onChange={setMicrosoftSSO} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ===================== AKSES SELURUH DATA MODULE =====================
const AksesSeluruhDataModule = () => {
  const [selectedModule, setSelectedModule] = useState("Akademik");
  const [searchTable, setSearchTable] = useState("");
  const [showFullExportModal, setShowFullExportModal] = useState(false);
  const [exportScope, setExportScope] = useState("full"); // "full" or "module"
  const [fileFormat, setFileFormat] = useState("zip"); // "zip", "excel", "sql"
  const [secureZip, setSecureZip] = useState(true);
  const [zipPassword, setZipPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewSearch, setPreviewSearch] = useState("");
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelAllColumns, setExcelAllColumns] = useState(true);
  const [excelFormatAsText, setExcelFormatAsText] = useState(true);
  const [excelFreezePanes, setExcelFreezePanes] = useState(true);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfOrientation, setPdfOrientation] = useState("landscape");
  const [pdfKopSurat, setPdfKopSurat] = useState(true);
  const [pdfPageNum, setPdfPageNum] = useState(true);
  const [pdfPassword, setPdfPassword] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvHeader, setCsvHeader] = useState(true);
  const [csvQuote, setCsvQuote] = useState(true);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const modules = [
    { name: "Akademik", count: 12 },
    { name: "Kesiswaan", count: 8 },
    { name: "Kepegawaian", count: 5 },
    { name: "Keuangan", count: 15 },
    { name: "Inventaris", count: 6 }
  ];

  const tableData = {
    Akademik: [
      { name: "Data Siswa Aktif", records: "1,240", size: "4.2 MB", updated: "Hari ini, 08:30" },
      { name: "Mata Pelajaran", records: "48", size: "120 KB", updated: "Kemarin, 14:15" },
      { name: "Jadwal Pelajaran", records: "320", size: "1.5 MB", updated: "3 hari yang lalu" },
      { name: "Nilai Ujian (Semester Genap)", records: "14,800", size: "12.8 MB", updated: "Hari ini, 10:05" },
      { name: "Presensi Harian Siswa", records: "45,200", size: "38.4 MB", updated: "Hari ini, 07:15" },
      { name: "Data Ekstrakurikuler", records: "24", size: "85 KB", updated: "12 Okt 2026" }
    ],
    Kesiswaan: [
      { name: "Pendaftaran Siswa Baru", records: "250", size: "850 KB", updated: "Hari ini, 09:00" },
      { name: "Pelanggaran & Pembinaan", records: "32", size: "64 KB", updated: "Kemarin, 10:30" },
      { name: "Prestasi Siswa", records: "115", size: "320 KB", updated: "5 hari yang lalu" },
      { name: "Organisasi Siswa (OSIS)", records: "4", size: "28 KB", updated: "10 Okt 2026" }
    ],
    Kepegawaian: [
      { name: "Data Guru", records: "82", size: "1.1 MB", updated: "Hari ini, 08:00" },
      { name: "Data Staf Administrasi", records: "30", size: "450 KB", updated: "Kemarin, 11:20" },
      { name: "Presensi Guru & Staf", records: "12,400", size: "9.2 MB", updated: "Hari ini, 07:00" }
    ],
    Keuangan: [
      { name: "Transaksi Pembayaran SPP", records: "8,650", size: "7.8 MB", updated: "Hari ini, 09:45" },
      { name: "Gaji & Honor Guru", records: "984", size: "1.2 MB", updated: "2 hari yang lalu" },
      { name: "Anggaran Operasional", records: "156", size: "340 KB", updated: "15 Okt 2026" }
    ],
    Inventaris: [
      { name: "Aset & Inventaris Sekolah", records: "1,240", size: "3.5 MB", updated: "Hari ini, 08:30" },
      { name: "Peminjaman Sarana", records: "410", size: "1.1 MB", updated: "Kemarin, 16:00" },
      { name: "Pengadaan Barang", records: "64", size: "150 KB", updated: "3 hari yang lalu" }
    ]
  };

  const getModuleSubtext = (modName) => {
    switch (modName) {
      case "Akademik":
        return "Mencakup Data Siswa, Mata Pelajaran, Jadwal, dan Nilai Ujian.";
      case "Kesiswaan":
        return "Mencakup Pendaftaran Siswa Baru, Pelanggaran, Prestasi, dan OSIS.";
      case "Kepegawaian":
        return "Mencakup Data Guru, Staf Administrasi, dan Presensi.";
      case "Keuangan":
        return "Mencakup Transaksi SPP, Gaji Guru, dan Anggaran.";
      case "Inventaris":
        return "Mencakup Aset Sekolah, Peminjaman Sarana, dan Pengadaan.";
      default:
        return "Mencakup seluruh tabel yang terdaftar pada modul ini.";
    }
  };

  const currentTables = tableData[selectedModule] || [];
  const filteredTables = currentTables.filter(t => t.name.toLowerCase().includes(searchTable.toLowerCase()));

  const handleExportStart = () => {
    setShowFullExportModal(false);
    showToast("Ekspor database berhasil dimulai di latar belakang!");
  };

  const previewStudents = [
    { id: "1001", nisn: "0012345678", name: "Andi Setiawan", class: "VII-A", gender: "L", status: "AKTIF" },
    { id: "1002", nisn: "0012345679", name: "Budi Santoso", class: "VII-A", gender: "L", status: "AKTIF" },
    { id: "1003", nisn: "0012345680", name: "Citra Kirana", class: "VII-B", gender: "P", status: "AKTIF" },
    { id: "1004", nisn: "0012345681", name: "Dewi Lestari", class: "VII-B", gender: "P", status: "AKTIF" },
    { id: "1005", nisn: "0012345682", name: "Eko Prasetyo", class: "VII-C", gender: "L", status: "CUTI" },
    { id: "1006", nisn: "0012345683", name: "Fajar Hidayat", class: "VIII-A", gender: "L", status: "AKTIF" },
  ];

  const filteredStudents = previewStudents.filter(student => 
    student.name.toLowerCase().includes(previewSearch.toLowerCase()) ||
    student.nisn.includes(previewSearch) ||
    student.id.includes(previewSearch) ||
    student.class.toLowerCase().includes(previewSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[200] bg-[#1A3D63] text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-3 animate-slideUp">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-gray-800 tracking-tight">Akses Seluruh Data</h1>
          <p className="text-gray-400 text-[14px] mt-1 font-medium">Telusuri dan ekspor seluruh basis data sistem terpadu.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast("Melakukan pencarian global...")}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-gray-50 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            Global Search
          </button>
          <button
            onClick={() => setShowFullExportModal(true)}
            className="flex items-center gap-2 bg-[#1A3D63] hover:bg-[#122a47] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-[#1A3D63]/20 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Ekspor Laporan Penuh
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Card: Modul Sistem List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden lg:col-span-4">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-[15px] font-bold text-gray-800">Modul Sistem</h2>
          </div>
          <div className="p-4 space-y-1">
            {modules.map((m) => {
              const isSelected = selectedModule === m.name;
              return (
                <button
                  key={m.name}
                  onClick={() => { setSelectedModule(m.name); setSearchTable(""); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    isSelected
                      ? "bg-[#F0F4FF] text-[#1A3D63] font-bold"
                      : "hover:bg-gray-50 text-gray-600 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {m.name === "Akademik" && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                    )}
                    {m.name === "Kesiswaan" && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    )}
                    {m.name === "Kepegawaian" && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
                    )}
                    {m.name === "Keuangan" && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    )}
                    {m.name === "Inventaris" && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
                    )}
                    <span className="text-sm">{m.name}</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${isSelected ? "bg-[#1A3D63]/10 text-[#1A3D63]" : "bg-gray-100 text-gray-400"}`}>
                    {m.count} Tabel
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Table: Table reference details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden lg:col-span-8 flex flex-col">
          {/* Table Header area */}
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">Database {selectedModule}</h3>
                <p className="text-xs text-gray-400 font-medium">Menampilkan {modules.find(m => m.name === selectedModule)?.count} tabel terkait.</p>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama tabel..."
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
                className="border border-gray-200 focus:border-gray-300 rounded-xl pl-4 pr-4 py-2 text-sm w-full sm:w-[220px] outline-none transition-all placeholder:text-gray-400 text-gray-700 bg-white"
              />
            </div>
          </div>

          {/* Table details list */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-10"></th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Tabel / Referensi</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Records</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Ukuran</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Terakhir Diperbarui</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Aksi Ekspor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTables.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-400">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /></svg>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-gray-800">{row.name}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 font-medium">
                      {row.records}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 font-mono">
                      {row.size}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-400">
                      {row.updated}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            if (row.name === "Data Siswa Aktif") {
                              setShowPreviewModal(true);
                            } else {
                              showToast(`Membuka preview untuk ${row.name}`);
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                          title="Preview Data"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        </button>
                        <button
                          onClick={() => {
                            if (row.name === "Data Siswa Aktif") {
                              setShowCsvModal(true);
                            } else {
                              showToast(`Mengekspor ${row.name} ke CSV`);
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#1A3D63] hover:bg-blue-50 rounded-lg transition-all"
                          title="Ekspor CSV"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                        </button>
                        <button
                          onClick={() => {
                            if (row.name === "Data Siswa Aktif") {
                              setShowExcelModal(true);
                            } else {
                              showToast(`Mengekspor ${row.name} ke Excel`);
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Ekspor Excel"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M16 13H8M16 17H8M12 9H8" /></svg>
                        </button>
                        <button
                          onClick={() => {
                            if (row.name === "Data Siswa Aktif") {
                              setShowPdfModal(true);
                            } else {
                              showToast(`Mengunduh ${row.name}`);
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          title="Unduh / Ekspor PDF"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ekspor Laporan Penuh (Backup) Modal */}
      {showFullExportModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setShowFullExportModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col" style={{maxHeight: '88vh'}}>
            {/* Modal Header - always visible */}
            <div className="flex-shrink-0 flex items-start justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1A3D63]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-gray-800">Ekspor Laporan Penuh (Backup)</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Unduh data dari beberapa tabel atau seluruh modul sekaligus.</p>
                </div>
              </div>
              <button onClick={() => setShowFullExportModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Modal Body - scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">

              {/* Scope Selection */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3.5">Cakupan Data yang Diekspor</label>
                <div className="space-y-3">
                  <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all bg-white ${
                    exportScope === "full" ? "border-2 border-[#1A3D63]" : "border border-gray-300 hover:border-gray-400"
                  }`}>
                    <div className="mt-1 flex items-center justify-center">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${exportScope === "full" ? "border-[#1A3D63]" : "border-gray-300"}`}>
                        {exportScope === "full" && <div className="w-2 h-2 rounded-full bg-[#1A3D63]"></div>}
                      </div>
                    </div>
                    <input type="radio" name="exportScope" checked={exportScope === "full"} onChange={() => setExportScope("full")} className="hidden" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-800">Seluruh Sistem (Full Database Backup)</span>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full font-semibold">46 Tabel</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">Mencakup modul Akademik, Kesiswaan, Kepegawaian, Keuangan, dan Inventaris.</p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all bg-white ${
                    exportScope === "module" ? "border-2 border-[#1A3D63]" : "border border-gray-300 hover:border-gray-400"
                  }`}>
                    <div className="mt-1 flex items-center justify-center">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${exportScope === "module" ? "border-[#1A3D63]" : "border-gray-300"}`}>
                        {exportScope === "module" && <div className="w-2 h-2 rounded-full bg-[#1A3D63]"></div>}
                      </div>
                    </div>
                    <input type="radio" name="exportScope" checked={exportScope === "module"} onChange={() => setExportScope("module")} className="hidden" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-800">Hanya Modul {selectedModule}</span>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full font-semibold">
                          {modules.find(m => m.name === selectedModule)?.count} Tabel
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{getModuleSubtext(selectedModule)}</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Format File Output */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3.5">Format File Output</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "zip", title: "ZIP Archive", desc: "Berisi file CSV terpisah",
                      iconClass: "bg-blue-50 text-[#1A3D63]",
                      icon: (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
                          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                          <path d="M12 12v6" />
                          <path d="M10 14h4" />
                          <path d="M10 16h4" />
                        </svg>
                    )},
                    { id: "excel", title: "Excel Multi-sheet", desc: "1 Sheet per Tabel",
                      iconClass: "bg-emerald-50 text-emerald-600",
                      icon: (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
                          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                          <rect x="8" y="11" width="8" height="6" rx="1" />
                          <path d="M12 11v6" />
                          <path d="M8 14h8" />
                        </svg>
                    )},
                    { id: "sql", title: "SQL Dump", desc: "Untuk restorasi sistem",
                      iconClass: "bg-slate-100 text-slate-600",
                      icon: (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
                          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                          <ellipse cx="12" cy="13" rx="3" ry="1.5" />
                          <path d="M9 13v3c0 .8 1.3 1.5 3 1.5s3-.7 3-1.5v-3" />
                        </svg>
                    )}
                  ].map((format) => {
                    const isActive = fileFormat === format.id;
                    return (
                    <button
                      key={format.id}
                      onClick={() => setFileFormat(format.id)}
                      className={`flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all bg-white ${
                        isActive
                          ? "border-[#1A3D63]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-all ${format.iconClass}`}>
                        {format.icon}
                      </div>
                      <span className="text-xs font-bold text-gray-800 leading-none">{format.title}</span>
                      <span className="text-[10px] text-gray-400 mt-1 leading-normal">{format.desc}</span>
                    </button>
                    );
                  })}
                </div>
              </div>

              {/* Password Option */}
              {fileFormat === "zip" && (
                <div className="space-y-3 pt-1">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={secureZip}
                      onChange={(e) => setSecureZip(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-[#1A3D63] focus:ring-0 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-gray-800 select-none">Amankan file ZIP dengan Password (Enkripsi AES-256)</span>
                  </label>
                  {secureZip && (
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={zipPassword}
                        onChange={(e) => setZipPassword(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#1A3D63]/40 transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        )}
                      </button>
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400">Sistem akan men-generate password otomatis jika dikosongkan.</p>
                </div>
              )}

            </div>

            {/* Modal Footer - always visible */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E2A500" strokeWidth="2.2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r="0.5" fill="#E2A500" /></svg>
                <span className="text-xs font-semibold text-gray-500">Proses ini mungkin memakan waktu 1-3 menit.</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFullExportModal(false)}
                  className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors px-4 py-2"
                >
                  Batal
                </button>
                <button
                  onClick={handleExportStart}
                  className="flex items-center gap-2 bg-[#1A3D63] hover:bg-[#122a47] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#1A3D63]/20 transition-all active:scale-[0.98]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  Mulai Proses Ekspor
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Data Preview Modal */}
      {showPreviewModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm animate-fadeIn" onClick={() => setShowPreviewModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden animate-scaleUp" style={{ maxHeight: '88vh' }}>
            {/* Modal Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#1A3D63]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="text-base font-bold text-gray-800">Data Siswa Aktif</h3>
                    <span className="ml-2.5 px-2.5 py-0.5 rounded text-[10px] font-black bg-slate-100 text-slate-500 uppercase tracking-widest leading-none">PREVIEW</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">Total: 1,240 records &nbsp;•&nbsp; Modul: Akademik</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" title="Copy Raw Data">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" title="Duplicate View">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-[#1A3D63] cursor-pointer transition-colors" title="Export as CSV">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <div className="w-[1px] h-5 bg-gray-200" />
                <button onClick={() => setShowPreviewModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex-shrink-0 px-6 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="absolute inset-y-0 left-3 my-auto text-gray-400"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  <input
                    type="text"
                    placeholder="Filter dalam hasil..."
                    value={previewSearch}
                    onChange={(e) => setPreviewSearch(e.target.value)}
                    className="w-full border border-gray-200 focus:border-gray-300 rounded-xl pl-9 pr-4 py-2 text-xs outline-none transition-all placeholder:text-gray-400 text-gray-700 bg-white"
                  />
                </div>
                <button className="flex items-center gap-1.5 border border-gray-200 hover:border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
                  </svg>
                  <span>Kolom (6/12)</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 ml-0.5"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
              </div>
              <div className="text-xs text-gray-400 font-medium">Menampilkan 50 baris pertama</div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-y-auto overflow-x-auto min-h-[250px]">
              <table className="w-full text-left">
                <thead className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-[0_1px_0_0_rgba(243,244,246,1)]">
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">NISN</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">NAMA LENGKAP</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">KELAS</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">JENIS KELAMIN</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50/40 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-400">{student.id}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-mono font-medium">{student.nisn}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-800">{student.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-semibold">{student.class}</td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-semibold">{student.gender}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-block font-bold text-[10px] px-2.5 py-0.5 rounded-md leading-relaxed tracking-wider ${
                            student.status === "AKTIF" 
                              ? "bg-emerald-50 text-emerald-600" 
                              : "bg-amber-50 text-amber-600"
                          }`}>
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-400 font-semibold">
                        Tidak ada data siswa yang cocok dengan filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
              <span className="text-xs text-gray-400 font-medium">Data diekstrak pada: Hari ini, 15:42 WIB</span>
              <button 
                onClick={() => {
                  setShowPreviewModal(false);
                  showToast("Berhasil mendownload dataset lengkap (CSV)!");
                }}
                className="flex items-center gap-2 bg-[#1A3D63] hover:bg-[#122a47] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-[#1A3D63]/10 transition-all active:scale-[0.98]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                Download Full Dataset (CSV)
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ===== EKSPOR KE EXCEL MODAL ===== */}
      {showExcelModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setShowExcelModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <rect x="8" y="11" width="8" height="6" rx="1" />
                    <path d="M12 11v6M8 14h8" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800">Ekspor ke Excel</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Atur opsi format data spreadsheet sebelum mengunduh.</p>
                </div>
              </div>
              <button onClick={() => setShowExcelModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Data Sumber */}
              <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">DATA SUMBER</p>
                  <p className="text-sm font-bold text-gray-800">Data Siswa Aktif</p>
                </div>
                <span className="text-xs font-semibold text-gray-400">1,240 records</span>
              </div>

              {/* Kolom yang Diekspor */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Kolom yang Diekspor</p>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${excelAllColumns ? "border-[#1A3D63]" : "border-gray-300"}`}>
                      {excelAllColumns && <div className="w-2 h-2 rounded-full bg-[#1A3D63]" />}
                    </div>
                    <input type="radio" className="hidden" checked={excelAllColumns} onChange={() => setExcelAllColumns(true)} />
                    <span className="text-sm text-gray-700 font-semibold">Semua Kolom (12)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!excelAllColumns ? "border-[#1A3D63]" : "border-gray-300"}`}>
                      {!excelAllColumns && <div className="w-2 h-2 rounded-full bg-[#1A3D63]" />}
                    </div>
                    <input type="radio" className="hidden" checked={!excelAllColumns} onChange={() => setExcelAllColumns(false)} />
                    <span className="text-sm text-gray-700 font-semibold">Pilih Kolom Khusus</span>
                  </label>
                </div>
              </div>

              {/* Opsi Pemformatan */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Opsi Pemformatan</p>
                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                  <label className="flex items-start gap-3.5 p-4 cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div
                      onClick={() => setExcelFormatAsText(!excelFormatAsText)}
                      className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${excelFormatAsText ? "bg-[#1A3D63] border-[#1A3D63]" : "border-gray-300 bg-white"}`}
                    >
                      {excelFormatAsText && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Format Angka Spesifik sebagai Teks</p>
                      <p className="text-xs text-gray-400 mt-0.5">Mencegah data seperti NIK atau NISN berubah menjadi format scientific (E+).</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3.5 p-4 cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div
                      onClick={() => setExcelFreezePanes(!excelFreezePanes)}
                      className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${excelFreezePanes ? "bg-[#1A3D63] border-[#1A3D63]" : "border-gray-300 bg-white"}`}
                    >
                      {excelFreezePanes && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Bekukan Baris Pertama (Freeze Panes)</p>
                      <p className="text-xs text-gray-400 mt-0.5">Membuat header tabel tetap terlihat saat di-scroll ke bawah.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Versi File */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Versi File</p>
                <div className="relative">
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-300 appearance-none cursor-pointer font-semibold">
                    <option>Excel Workbook (.xlsx)</option>
                    <option>Excel 97-2003 (.xls)</option>
                    <option>CSV UTF-8 (.csv)</option>
                  </select>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute inset-y-0 right-4 my-auto text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9" /></svg>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="20 6 9 17 4 12" /></svg>
                <span className="text-xs font-semibold">File siap diunduh.</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowExcelModal(false)} className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors px-4 py-2">Batal</button>
                <button
                  onClick={() => { setShowExcelModal(false); showToast("File Excel berhasil dibuat & diunduh!"); }}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  Buat & Unduh Excel
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ===== EKSPOR KE PDF MODAL ===== */}
      {showPdfModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setShowPdfModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <path d="M9 13h1c1.1 0 2-.9 2-2s-.9-2-2-2H9v6M15 9h2M15 13h2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800">Ekspor ke PDF</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Konfigurasi tata letak dan opsi dokumen.</p>
                </div>
              </div>
              <button onClick={() => setShowPdfModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Data Sumber */}
              <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">DATA SUMBER</p>
                  <p className="text-sm font-bold text-gray-800">Data Siswa Aktif</p>
                </div>
                <span className="text-xs font-semibold text-gray-400">1,240 records</span>
              </div>

              {/* Ukuran Kertas + Orientasi */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-2">Ukuran Kertas</p>
                  <div className="relative">
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-300 appearance-none cursor-pointer font-semibold">
                      <option>A4 (210 × 297 mm)</option>
                      <option>Letter (215.9 × 279.4 mm)</option>
                      <option>A3 (297 × 420 mm)</option>
                    </select>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute inset-y-0 right-4 my-auto text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9" /></svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-2">Orientasi</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPdfOrientation("landscape")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${pdfOrientation === "landscape" ? "bg-[#1A3D63] text-white border-[#1A3D63] shadow-md shadow-[#1A3D63]/20" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /></svg>
                      Landscape
                    </button>
                    <button
                      onClick={() => setPdfOrientation("portrait")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${pdfOrientation === "portrait" ? "bg-[#1A3D63] text-white border-[#1A3D63] shadow-md shadow-[#1A3D63]/20" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" /></svg>
                      Portrait
                    </button>
                  </div>
                </div>
              </div>

              {/* Opsi Dokumen */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Opsi Dokumen</p>
                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {[
                    { state: pdfKopSurat, setter: setPdfKopSurat, label: "Sertakan Kop Surat & Logo Sekolah", desc: "Menambahkan header resmi sekolah di halaman pertama." },
                    { state: pdfPageNum, setter: setPdfPageNum, label: "Penomoran Halaman", desc: "Format: Halaman VII dari Y di bagian bawah." },
                    { state: pdfPassword, setter: setPdfPassword, label: "Lindungi dengan Password", desc: "Enkripsi file PDF agar hanya bisa dibuka dengan kata sandi." },
                  ].map((opt, i) => (
                    <label key={i} className="flex items-start gap-3.5 p-4 cursor-pointer hover:bg-gray-50/50 transition-colors">
                      <div
                        onClick={() => opt.setter(!opt.state)}
                        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${opt.state ? "bg-[#1A3D63] border-[#1A3D63]" : "border-gray-300 bg-white"}`}
                      >
                        {opt.state && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{opt.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r="0.5" fill="currentColor" /></svg>
                <span className="text-xs font-semibold">Proses ekspor mungkin memakan waktu beberapa detik.</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowPdfModal(false)} className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors px-4 py-2">Batal</button>
                <button
                  onClick={() => { setShowPdfModal(false); showToast("File PDF berhasil dibuat & diunduh!"); }}
                  className="flex items-center gap-2 bg-[#1A3D63] hover:bg-[#122a47] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#1A3D63]/20 transition-all active:scale-[0.98]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  Buat PDF
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ===== EKSPOR KE CSV MODAL ===== */}
      {showCsvModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setShowCsvModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <path d="M8 13h2M14 13h2M8 17h2M14 17h2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800">Ekspor ke CSV</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Ekspor data mentah (raw data) untuk integrasi dengan sistem lain.</p>
                </div>
              </div>
              <button onClick={() => setShowCsvModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Data Sumber */}
              <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">DATA SUMBER</p>
                  <p className="text-sm font-bold text-gray-800">Data Siswa Aktif</p>
                </div>
                <span className="text-xs font-semibold text-gray-400">1,240 records</span>
              </div>

              {/* Delimiter + Enkoding */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-2">Delimiter (Pemisah)</p>
                  <div className="relative">
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-300 appearance-none cursor-pointer font-semibold">
                      <option>Koma (,)</option>
                      <option>Titik Koma (;)</option>
                      <option>Tab (\t)</option>
                      <option>Pipe (|)</option>
                    </select>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute inset-y-0 right-4 my-auto text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9" /></svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-2">Enkoding Karakter</p>
                  <div className="relative">
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-300 appearance-none cursor-pointer font-semibold">
                      <option>UTF-8 (Rekomendasi)</option>
                      <option>UTF-16</option>
                      <option>ISO-8859-1 (Latin-1)</option>
                      <option>Windows-1252</option>
                    </select>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute inset-y-0 right-4 my-auto text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9" /></svg>
                  </div>
                </div>
              </div>

              {/* Opsi Ekstraksi */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Opsi Ekstraksi</p>
                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                  <label className="flex items-start gap-3.5 p-4 cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div
                      onClick={() => setCsvHeader(!csvHeader)}
                      className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${csvHeader ? "bg-[#1A3D63] border-[#1A3D63]" : "border-gray-300 bg-white"}`}
                    >
                      {csvHeader && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Sertakan Baris Header</p>
                      <p className="text-xs text-gray-400 mt-0.5">Baris pertama berisi nama kolom tabel.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3.5 p-4 cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div
                      onClick={() => setCsvQuote(!csvQuote)}
                      className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${csvQuote ? "bg-[#1A3D63] border-[#1A3D63]" : "border-gray-300 bg-white"}`}
                    >
                      {csvQuote && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Bungkus Teks dengan Kutip ("")</p>
                      <p className="text-xs text-gray-400 mt-0.5">Mencegah teks terpotong jika mengandung karakter delimiter.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="20 6 9 17 4 12" /></svg>
                <span className="text-xs font-semibold">File siap diunduh.</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowCsvModal(false)} className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors px-4 py-2">Batal</button>
                <button
                  onClick={() => { setShowCsvModal(false); showToast("File CSV berhasil diunduh!"); }}
                  className="flex items-center gap-2 bg-[#1A3D63] hover:bg-[#122a47] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#1A3D63]/20 transition-all active:scale-[0.98]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  Unduh CSV
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
// ============================================================================================================================

const BackupMaintenanceModule = () => {
  const [showManualBackupModal, setShowManualBackupModal] = useState(false);
  const [backupType, setBackupType] = useState("full");
  const [highCompression, setHighCompression] = useState(true);
  const [dailyBackup, setDailyBackup] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [autoBackupBeforeMaintenance, setAutoBackupBeforeMaintenance] = useState(true);
  const [agreeMaintenanceImpact, setAgreeMaintenanceImpact] = useState(false);
  
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-[#1A3D63] tracking-tight">Backup & Maintenance Sistem</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Kelola cadangan data, jadwal pemeliharaan, dan status penyimpanan server.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowScheduleModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            Jadwalkan Maintenance
          </button>
          <button onClick={() => setShowManualBackupModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#1A3D63] text-white rounded-xl text-sm font-bold hover:bg-[#122a47] transition-all shadow-md shadow-[#1A3D63]/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></svg>
            Buat Backup Manual
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Penyimpanan Server */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="12" x2="2" y2="12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /><line x1="6" y1="16" x2="6.01" y2="16" /><line x1="10" y1="16" x2="14" y2="16" /></svg>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-400 mb-1">Penyimpanan Server</p>
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-2xl font-black text-gray-800">850 GB</span>
              <span className="text-sm font-semibold text-gray-400">/ 1 TB</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1.5">
              <div className="bg-[#1A3D63] h-1.5 rounded-full" style={{ width: "85%" }}></div>
            </div>
            <p className="text-[10px] font-semibold text-gray-400 text-right">85% Terpakai</p>
          </div>
        </div>

        {/* Status Backup Terakhir */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 mb-1">Status Backup Terakhir</p>
            <p className="text-xl font-black text-gray-800 mb-1">Berhasil</p>
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              Hari ini, 02:00 WIB
            </div>
          </div>
        </div>

        {/* Kesehatan Database */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 mb-1">Kesehatan Database</p>
            <p className="text-xl font-black text-gray-800 mb-1">Optimal</p>
            <p className="text-xs font-medium text-gray-500">Tidak ada anomali terdeteksi.</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (Table) */}
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Riwayat Backup</h3>
              <p className="text-xs text-gray-500 mt-1">Daftar cadangan data yang tersimpan di server.</p>
            </div>
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Cari backup..." className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63] transition-all" />
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">Waktu Backup</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">Nama File & ID</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">Ukuran</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">Tipe</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { time: "24 Okt 2026, 02:00", name: "Full_Backup_System_v2", id: "BKP-20261024-0200", size: "1.2 GB", type: "Otomatis", status: "Berhasil" },
                  { time: "23 Okt 2026, 02:00", name: "Full_Backup_System_v2", id: "BKP-20261023-0200", size: "1.2 GB", type: "Otomatis", status: "Berhasil" },
                  { time: "22 Okt 2026, 14:30", name: "Manual_Pre_Update_v2.1", id: "BKP-20261022-1430", size: "1.15 GB", type: "Manual", status: "Berhasil" },
                  { time: "22 Okt 2026, 02:00", name: "Full_Backup_System_v2", id: "BKP-20261022-0200", size: "1.15 GB", type: "Otomatis", status: "Berhasil" },
                  { time: "21 Okt 2026, 02:00", name: "Full_Backup_System_v2", id: "BKP-20261021-0200", size: "1.12 GB", type: "Otomatis", status: "Gagal" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-700">{row.time}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-800">{row.name}</p>
                      <p className="text-xs font-medium text-gray-400 font-mono mt-0.5 tracking-wide">{row.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-600">{row.size}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-gray-100 text-gray-600">
                        {row.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {row.status === "Berhasil" ? (
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          <span className="text-xs font-bold">Berhasil</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-red-500">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                          <span className="text-xs font-bold">Gagal</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Menampilkan 5 dari 42 total backup</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors bg-white shadow-sm">Sebelumnya</button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors bg-white shadow-sm">Selanjutnya</button>
            </div>
          </div>
        </div>

        {/* Right Col */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pengaturan Backup Otomatis */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2.5 mb-6">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <h3 className="text-base font-bold text-gray-800">Pengaturan Backup Otomatis</h3>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div className="pr-4">
                  <p className="text-sm font-bold text-gray-800">Aktifkan Backup Harian</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed font-medium">Sistem akan melakukan pencadangan otomatis setiap hari.</p>
                </div>
                <button 
                  onClick={() => setDailyBackup(!dailyBackup)}
                  className={`w-11 h-6 rounded-full flex items-center transition-colors px-0.5 shrink-0 ${dailyBackup ? 'bg-[#1A3D63]' : 'bg-gray-200'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${dailyBackup ? 'translate-VII-5' : 'translate-VII-0'}`}></div>
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Waktu Eksekusi</label>
                <div className="relative">
                  <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 appearance-none focus:outline-none focus:border-[#1A3D63] cursor-pointer">
                    <option>02:00 AM (Disarankan)</option>
                    <option>03:00 AM</option>
                    <option>04:00 AM</option>
                  </select>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute inset-y-0 right-4 my-auto text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-medium">Pilih waktu dengan lalu lintas akses terendah.</p>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Kebijakan Retensi</label>
                <div className="relative">
                  <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 appearance-none focus:outline-none focus:border-[#1A3D63] cursor-pointer">
                    <option>Simpan selama 30 Hari</option>
                    <option>Simpan selama 60 Hari</option>
                    <option>Simpan selama 90 Hari</option>
                  </select>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute inset-y-0 right-4 my-auto text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-medium leading-relaxed">Backup yang lebih lama dari periode ini akan dihapus otomatis untuk menghemat ruang server.</p>
              </div>
              
              <button className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors">
                Simpan Pengaturan
              </button>
            </div>
          </div>

          {/* Mode Pemeliharaan */}
          <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100">
            <div className="flex items-center gap-2.5 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <h3 className="text-base font-bold text-gray-800">Mode Pemeliharaan (Maintenance)</h3>
            </div>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed font-medium">
              Mengaktifkan mode ini akan memblokir akses login bagi semua pengguna kecuali Super Admin. Gunakan saat melakukan update sistem besar atau restorasi data.
            </p>
            <button onClick={() => setShowMaintenanceModal(true)} className="w-full py-2.5 bg-white border border-orange-200 text-orange-600 rounded-xl text-sm font-bold hover:bg-orange-50 transition-colors shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2 -mt-0.5"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
              Aktifkan Mode Maintenance
            </button>
          </div>
        </div>
      </div>

      {/* Buat Backup Manual Modal */}
      {showManualBackupModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setShowManualBackupModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800">Buat Backup Manual</h3>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Buat cadangan data sistem secara instan (on-demand).</p>
                </div>
              </div>
              <button onClick={() => setShowManualBackupModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Nama Backup */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Nama Backup</label>
                <input type="text" defaultValue="Manual_Backup_20261024" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1A3D63] focus:ring-1 focus:ring-[#1A3D63] transition-all" />
                <p className="text-xs text-gray-500 mt-2 font-medium">Gunakan nama yang deskriptif untuk memudahkan identifikasi (misal: Manual_Pre_Update_v3).</p>
              </div>

              {/* Tipe Backup */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">Tipe Backup</label>
                <div className="space-y-3">
                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${backupType === "full" ? "border-[#1A3D63] bg-blue-50/30" : "border-gray-100 bg-white"}`}>
                    <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${backupType === "full" ? "border-[#1A3D63]" : "border-gray-300"}`}>
                      {backupType === "full" && <div className="w-2.5 h-2.5 rounded-full bg-[#1A3D63]"></div>}
                    </div>
                    <input type="radio" name="backupType" className="hidden" checked={backupType === "full"} onChange={() => setBackupType("full")} />
                    <div>
                      <p className="text-sm font-bold text-gray-800">Backup Penuh (Full System)</p>
                      <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">Mencadangkan seluruh database, konfigurasi sistem, dan file yang diunggah. Perkiraan ukuran: ~1.2 GB.</p>
                    </div>
                  </label>
                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${backupType === "db" ? "border-[#1A3D63] bg-blue-50/30" : "border-gray-100 bg-white"}`}>
                    <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${backupType === "db" ? "border-[#1A3D63]" : "border-gray-300"}`}>
                      {backupType === "db" && <div className="w-2.5 h-2.5 rounded-full bg-[#1A3D63]"></div>}
                    </div>
                    <input type="radio" name="backupType" className="hidden" checked={backupType === "db"} onChange={() => setBackupType("db")} />
                    <div>
                      <p className="text-sm font-bold text-gray-800">Backup Database Saja</p>
                      <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">Hanya mencadangkan struktur dan data tabel (SQL Dump). Tidak termasuk file lampiran. Perkiraan ukuran: ~450 MB.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Opsi Tambahan */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">Opsi Tambahan</label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div onClick={() => setHighCompression(!highCompression)} className={`mt-0.5 shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors border-2 ${highCompression ? "bg-[#1A3D63] border-[#1A3D63]" : "border-gray-300 bg-white group-hover:border-[#1A3D63]"}`}>
                    {highCompression && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Kompresi Tinggi (High Compression)</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Mengurangi ukuran file hasil backup (proses mungkin lebih lama).</p>
                  </div>
                </label>
              </div>
              
              {/* Warning Alert */}
              <div className="flex gap-3 bg-orange-50/80 p-4 rounded-xl border border-orange-100">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  Sistem mungkin akan mengalami <strong className="font-bold">sedikit penurunan performa</strong> selama proses backup penuh berlangsung. Disarankan untuk melakukannya di luar jam aktif (Peak Hours).
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
              <button onClick={() => setShowManualBackupModal(false)} className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors px-4 py-2.5">Batal</button>
              <button
                onClick={() => setShowManualBackupModal(false)}
                className="flex items-center gap-2 bg-[#1A3D63] hover:bg-[#122a47] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#1A3D63]/20 transition-all active:scale-[0.98]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Mulai Proses Backup
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Jadwalkan Maintenance Modal */}
      {showScheduleModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setShowScheduleModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800">Jadwalkan Maintenance</h3>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Atur waktu sistem offline untuk pemeliharaan rutin.</p>
                </div>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Tanggal Mulai</label>
                  <input type="text" defaultValue="11/01/2026" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Waktu Mulai (WIB)</label>
                  <input type="text" defaultValue="11:00 PM" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Perkiraan Durasi (Jam)</label>
                <div className="relative">
                  <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 appearance-none focus:outline-none focus:border-[#d97706] cursor-pointer">
                    <option>1 Jam</option>
                    <option>2 Jam</option>
                    <option>3 Jam</option>
                    <option>4 Jam</option>
                  </select>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute inset-y-0 right-4 my-auto text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Pesan untuk Pengguna</label>
                <textarea 
                  defaultValue="Sistem sedang dalam masa pemeliharaan rutin untuk peningkatan performa. Silakan kembali lagi setelah proses selesai."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 h-24 resize-none focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] transition-all"
                ></textarea>
                <p className="text-[11px] text-gray-400 mt-1.5 font-medium">Pesan ini akan ditampilkan di halaman login selama masa maintenance.</p>
              </div>

              <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer transition-colors bg-white hover:border-[#f59e0b]">
                <div onClick={() => setAutoBackupBeforeMaintenance(!autoBackupBeforeMaintenance)} className={`mt-0.5 shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors border-2 ${autoBackupBeforeMaintenance ? "bg-[#f59e0b] border-[#f59e0b]" : "border-gray-300 bg-white"}`}>
                  {autoBackupBeforeMaintenance && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Otomatis Lakukan Backup Penuh</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">Sistem akan melakukan backup otomatis tepat sebelum maintenance dimulai.</p>
                </div>
              </label>

              <div className="flex gap-3 bg-orange-50 p-4 rounded-xl border border-orange-100">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <div>
                  <p className="text-sm font-bold text-gray-800 mb-1">Dampak Maintenance</p>
                  <ul className="text-xs text-gray-600 font-medium leading-relaxed list-disc list-inside space-y-1">
                    <li>Seluruh pengguna (kecuali Super Admin) akan otomatis ter-logout.</li>
                    <li>Akses API dan integrasi sistem akan terhenti sementara.</li>
                    <li>Sistem akan kembali normal secara otomatis setelah durasi berakhir.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
              <button onClick={() => setShowScheduleModal(false)} className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors px-4 py-2.5">Batal</button>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex items-center gap-2 bg-[#d97706] hover:bg-[#b45309] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#d97706]/20 transition-all active:scale-[0.98]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Simpan Jadwal
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Peringatan Mode Maintenance Modal */}
      {showMaintenanceModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setShowMaintenanceModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-red-600">Peringatan: Aktifkan Mode Maintenance?</h3>
                </div>
              </div>
              <button onClick={() => setShowMaintenanceModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Tindakan ini akan menghentikan seluruh aktivitas pengguna saat ini. Seluruh pengguna aktif (kecuali Super Admin) akan dikeluarkan secara paksa dan tidak dapat login kembali sampai mode ini dinonaktifkan.
              </p>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">STATUS SAAT INI:</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">Pengguna Aktif (Online)</span>
                    <span className="text-sm font-black text-red-600">142 Pengguna</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">Proses Background Berjalan</span>
                    <span className="text-sm font-black text-orange-600">3 Proses</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Pesan untuk Pengguna</label>
                <textarea 
                  defaultValue="Sistem sedang dalam masa pemeliharaan darurat. Mohon maaf atas ketidaknyamanan ini."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 h-20 resize-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                ></textarea>
              </div>

              <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${agreeMaintenanceImpact ? "bg-red-50/50 border-red-200" : "bg-white border-gray-200"}`}>
                <div onClick={() => setAgreeMaintenanceImpact(!agreeMaintenanceImpact)} className={`mt-0.5 shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors border-2 ${agreeMaintenanceImpact ? "bg-red-500 border-red-500" : "border-gray-300 bg-white"}`}>
                  {agreeMaintenanceImpact && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 leading-relaxed">Saya mengerti dampak dari tindakan ini dan menyetujui untuk memaksa keluar seluruh pengguna aktif saat ini.</p>
                </div>
              </label>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-center gap-3 bg-gray-50/50 rounded-b-2xl">
              <button onClick={() => setShowMaintenanceModal(false)} className="flex-1 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors px-6 py-2.5">Batal</button>
              <button
                disabled={!agreeMaintenanceImpact}
                onClick={() => setShowMaintenanceModal(false)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-[0.98] ${agreeMaintenanceImpact ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20" : "bg-red-300 text-white/80 cursor-not-allowed shadow-none"}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                Ya, Aktifkan Sekarang
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// ============================================================================================================================
// ===================== LOG AKTIVITAS MODULE =====================
const LogAktivitasModule = () => {
  const [filterAction, setFilterAction] = useState("Semua");
  const [filterUser, setFilterUser] = useState("");
  const [dateRange, setDateRange] = useState("Hari Ini");
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const rows = await getAuditLogs();
      setLogs(Array.isArray(rows) ? rows : []);
    } catch (e) {
      console.error('loadLogs:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  const actionTypes = ["Semua", "LOGIN", "LOGOUT", "CREATE", "UPDATE", "DELETE", "EXPORT"];

  const getLogType = (aksi) => {
    if (!aksi) return 'info';
    const a = aksi.toUpperCase();
    if (a.includes('DELETE') || a.includes('GAGAL') || a.includes('FAILED') || a.includes('ERROR')) return 'error';
    if (a.includes('UPDATE') || a.includes('CHANGE') || a.includes('EDIT')) return 'warning';
    if (a.includes('LOGIN') || a.includes('EXPORT') || a.includes('CREATE')) return 'info';
    return 'success';
  };

  const typeConfig = {
    info:    { bg: "bg-blue-50",    text: "text-blue-600",   dot: "bg-blue-500"   },
    success: { bg: "bg-green-50",   text: "text-green-600",  dot: "bg-green-500"  },
    warning: { bg: "bg-amber-50",   text: "text-amber-600",  dot: "bg-amber-500"  },
    error:   { bg: "bg-red-50",     text: "text-red-600",    dot: "bg-red-500"    },
  };

  const formatLogTime = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const filteredLogs = logs.filter(l => {
    const matchAction = filterAction === "Semua" || (l.aksi || '').toUpperCase() === filterAction;
    const matchUser = !filterUser ||
      (l.user_name || '').toLowerCase().includes(filterUser.toLowerCase()) ||
      (l.detail || '').toLowerCase().includes(filterUser.toLowerCase());
    return matchAction && matchUser;
  });

  const stats = [
    { label: "Total Events", value: logs.length.toLocaleString(), sub: "Dari database", color: "text-[#1A3D63]", bg: "bg-blue-50" },
    { label: "Login", value: logs.filter(l => (l.aksi||'').toUpperCase() === 'LOGIN').length, sub: "Tercatat", color: "text-green-600", bg: "bg-green-50" },
    { label: "Error/Delete", value: logs.filter(l => ['DELETE','ERROR','FAILED'].some(k => (l.aksi||'').toUpperCase().includes(k))).length, sub: "Perlu perhatian", color: "text-red-500", bg: "bg-red-50" },
    { label: "Perubahan Data", value: logs.filter(l => ['UPDATE','CREATE','EDIT'].some(k => (l.aksi||'').toUpperCase().includes(k))).length, sub: "Update/Create", color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-gray-800 tracking-tight">Log Aktivitas Sistem</h1>
          <p className="text-gray-400 text-[14px] mt-1 font-medium">Pantau seluruh aktivitas dan perubahan penting dalam sistem secara real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Export Log
          </button>
          <button className="flex items-center gap-2 bg-[#1A3D63] hover:bg-[#122a47] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#1A3D63]/20 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${s.bg}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={s.color}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            </div>
            <div className={`text-2xl font-black mb-0.5 ${s.color}`}>{s.value}</div>
            <div className="text-sm font-bold text-gray-700">{s.label}</div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Log Table */}
      <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Filter Bar */}
        <div className="px-7 py-5 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-full lg:w-72">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                type="text"
                placeholder="Cari username atau detail..."
                value={filterUser}
                onChange={e => setFilterUser(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50/80 border border-transparent focus:bg-white focus:border-gray-200 rounded-[16px] text-sm font-semibold text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-1 focus:ring-[#1A3D63]"
              />
            </div>
            {/* Action Filter */}
            <div className="relative">
              <select
                value={filterAction}
                onChange={e => setFilterAction(e.target.value)}
                className="appearance-none bg-gray-50/80 border border-transparent rounded-[16px] pl-4 pr-9 py-2.5 text-sm font-bold text-gray-600 outline-none cursor-pointer transition-all w-48"
              >
                {actionTypes.map(a => <option key={a}>{a}</option>)}
              </select>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            {/* Date Range */}
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              {["Hari Ini", "7 Hari", "30 Hari"].map(d => (
                <button
                  key={d}
                  onClick={() => setDateRange(d)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    dateRange === d ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >{d}</button>
              ))}
            </div>
          </div>
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{filteredLogs.length} Events</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left whitespace-nowrap min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Log ID</th>
                <th className="px-4 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Pengguna</th>
                <th className="px-4 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
                <th className="px-4 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Detail Aktivitas</th>
                <th className="px-8 py-5 text-right text-[11px] font-black text-gray-400 uppercase tracking-widest">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/80">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">Memuat log...</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">Tidak ada log yang cocok</td></tr>
              ) : (
                filteredLogs.map((log) => {
                  const t = typeConfig[getLogType(log.aksi)];
                  return (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <span className="text-[11px] font-mono font-bold text-gray-400">{String(log.id).slice(0,8).toUpperCase()}</span>
                      </td>
                      <td className="px-4 py-5">
                        <div>
                          <div className="text-sm font-bold text-gray-800">{log.user_name || 'System'}</div>
                          <div className="text-xs text-gray-400 font-medium mt-0.5">{log.user_email || ''}</div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wide ${t.bg} ${t.text}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${t.dot}`}></div>
                          {(log.aksi || '').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-5 max-w-sm">
                        <p className="text-sm font-medium text-gray-600 leading-snug">{log.detail}</p>
                        {log.ip_address && <span className="text-xs text-gray-400">IP: {log.ip_address}</span>}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="text-sm font-semibold text-gray-500">{formatLogTime(log.created_at)}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-8 py-5 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
          <span className="text-xs font-black text-gray-400 uppercase tracking-tight">Menampilkan {filteredLogs.length} dari {logs.length} log</span>
          <button
            onClick={loadLogs}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-gray-50 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
            Refresh
          </button>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-xs font-black text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm">â† Prev</button>
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-black transition-all ${
                p === 1 ? "bg-[#1A3D63] text-white shadow-md shadow-[#1A3D63]/25" : "text-gray-500 hover:bg-white hover:shadow-sm"
              }`}>{p}</button>
            ))}
            <span className="text-gray-300 font-bold px-1">...</span>
            <button className="px-4 py-2 text-xs font-black text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
};
// ============================================================================================================================

const SuperAdminDashboard = ({ user, activeMenu, onViewChange }) => {
  const [showExportModal, setShowExportModal] = useState(false);

  const content = () => {
    switch (activeMenu) {
      case "Mengelola Akun User":
      case "Kelola Pengguna":
        return <ManageUsers />;
      case "Aktivasi & Nonaktif":
        return <ActivationModule />;
      case "Role & Permission":
        return <RolePermissionModule />;
      case "Hak Akses Sistem":
        return <HakAksesSistemModule />;
      case "Akses Seluruh Data":
        return <AksesSeluruhDataModule />;
      case "Backup & Maintenance":
        return <BackupMaintenanceModule />;
      case "Data Siswa":
        return <StudentData />;
      case "Data Guru & Karyawan":
        return <EmployeeData />;
      case "Laporan Integrasi":
        return <PlaceholderDashboard user={user} activeMenu={activeMenu} />;
      case "Pengaturan Sistem":
        return <SystemSettings />;
      case "My Profile":
        return <Profile user={user} />;
      default:
        return <SuperAdminOverview onExportClick={() => setShowExportModal(true)} onViewChange={onViewChange} />;
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen">
      {content()}
      {showExportModal && <ExportLogsModal onClose={() => setShowExportModal(false)} />}
    </main>
  );
};

export default SuperAdminDashboard;



