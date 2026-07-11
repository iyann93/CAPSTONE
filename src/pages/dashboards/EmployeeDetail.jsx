import React from "react";

const EmployeeDetail = ({ employee, onBack, onEdit }) => {
  return (
    <div className="p-6 md:p-8 animate-fadeIn space-y-6 bg-[#F4F6FA] min-h-full">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-4">
          <div className="flex items-center text-[13px] text-gray-500 gap-2">
            <span className="cursor-pointer hover:text-[#1e293b] transition-colors" onClick={onBack}>Data Pegawai</span>
            <span>&rsaquo;</span>
            <span className="font-bold text-[#1e293b]">{employee.name}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 hover:text-[#1e293b] shadow-sm transition-colors flex-shrink-0"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </button>
            <div>
              <h1 className="text-[26px] font-bold text-[#1e293b]">{employee.name}</h1>
              <p className="text-gray-500 text-[14px] mt-0.5">
                NIP. {employee.nip} - {employee.role}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-6 md:pt-0">
          <button 
            onClick={() => onEdit(employee)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A3D63] hover:bg-[#122A44] text-white rounded-xl text-[14px] font-bold shadow-sm transition-colors"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            Edit Data
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Column - Main Content */}
        <div className="flex-1 space-y-6">
          {/* Banner & Profile Card */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden relative">
            <div className="h-[120px] bg-gradient-to-r from-[#1A3D63] to-[#2A5C91]"></div>
            
            <div className="px-6 pb-6 pt-14 relative">
              <div className="absolute -top-12 left-6">
                <div className="w-24 h-24 rounded-[20px] bg-blue-100 border-4 border-white flex items-center justify-center text-blue-600 text-[32px] font-bold shadow-sm">
                  {employee.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                </div>
              </div>
              
              <div className="absolute top-4 right-6 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${employee.statusColor} ${employee.statusText}`}>
                  {employee.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${employee.roleColor} ${employee.roleText}`}>
                  {employee.role}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div className="flex gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" className="mt-1"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <div>
                    <p className="text-[12px] text-gray-400 font-medium">Jabatan / Mapel</p>
                    <p className="text-[14px] text-[#1e293b] font-bold">{employee.job}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" className="mt-1"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  <div>
                    <p className="text-[12px] text-gray-400 font-medium">Email</p>
                    <p className="text-[14px] text-[#1e293b] font-bold">{employee.email || "Belum diatur"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;



