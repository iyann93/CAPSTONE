const PlaceholderDashboard = ({ user, activeMenu }) => {
  return (
    <div className="flex-1 flex items-center justify-center h-full min-h-[60vh] bg-transparent p-6">
      <div className="text-center bg-white border border-gray-100 shadow-sm rounded-3xl p-10 max-w-md w-full">
        <div className="text-5xl mb-4">🚧</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Halaman Belum Tersedia</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Modul <strong className="text-[#1A3D63]">{activeMenu}</strong> untuk role <strong className="text-[#1A3D63]">{user?.role}</strong> sedang dalam pengembangan.
        </p>
      </div>
    </div>
  );
};

export default PlaceholderDashboard;


