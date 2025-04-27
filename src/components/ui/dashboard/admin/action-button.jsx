// Action Button Component
export default function ActionButton({ icon: Icon, label }) {
  return (
    <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors duration-300">
      {Icon && <Icon className="w-5 h-5" />}
      <span>{label}</span>
    </button>
  );
};
