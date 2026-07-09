import React from "react";
import { useNavigate } from "react-dom";

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center shadow-lg shadow-orange-100">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Sistem Sedang Dipelihara
        </h2>
        <p className="mt-4 text-center text-sm text-gray-500">
          Mohon maaf, saat ini sistem sedang dalam mode pemeliharaan rutin. Silakan kembali lagi nanti.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100 text-center">
          <a
            href="/login"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#1A3D63] hover:bg-[#122a47] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A3D63] transition-all transform active:scale-[0.98]"
          >
            Kembali ke Halaman Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
