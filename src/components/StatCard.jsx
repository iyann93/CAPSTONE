const StatCard = ({ title, value, subtitle, icon, iconBg }) => {
  return <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-wrap items-center gap-4 hover:shadow-md transition-shadow duration-200">
      <div
    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
    style={{ background: iconBg }}
  >
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-0.5">{title}</p>
        <p className="text-2xl font-bold text-gray-800 leading-tight">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
    </div>;
};
var StatCard_default = StatCard;
export {
  StatCard_default as default
};
