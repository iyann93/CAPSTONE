const PlaceholderDashboard = ({ user, activeMenu }) => {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-[#F3F4F6]">
      <div className="text-center">
        <div className="text-5xl mb-4">🚧</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Halaman Belum Tersedia</h2>
        <p className="text-sm text-gray-400">
          Modul <strong>{activeMenu}</strong> untuk role <strong>{user?.role}</strong> sedang dalam pengembangan.
        </p>
      </div>
    </div>
  );
};

export default PlaceholderDashboard;
