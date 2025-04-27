import { ClockIcon } from "@heroicons/react/24/outline";


export default function ActivityItem({ message, time }) {
  return (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-100">
      <div className="bg-brand-100 p-2 rounded-full">
        <ClockIcon className="w-4 h-4 text-brand-600" />
      </div>
      <div className="flex-1">
        <p className="text-gray-700">{message}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
};
