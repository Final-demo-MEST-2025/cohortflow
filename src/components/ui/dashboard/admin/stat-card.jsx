export default function StatCard({ icon: Icon, label, value, subtext }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300 flex items-center space-x-4">
      <div className="p-3 bg-brand-100 rounded-lg">
        {Icon && <Icon className="w-6 h-6 text-brand-600" />}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
        {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
      </div>
    </div>
  );
};