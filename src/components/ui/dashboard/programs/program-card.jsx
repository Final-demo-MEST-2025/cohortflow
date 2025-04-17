import {
  BookOpenIcon,
  CalendarIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function ProgramCard({
  name,
  description,
  location,
  startDate,
  endDate,
  createdBy,
}) {
  return (
    <div className="font-lusitana w-full h-70 rounded-xl bg-gray-50 p-4 shadow-sm">
      <div className="mb-4 flex items-center">
        <BookOpenIcon className="h-5 w-5 text-gray-700" />
        <h3 className="ml-2 text-lg font-medium">{name}</h3>
      </div>

      <div className="space-y-3 bg-white p-3 rounded-t-2xl shrink-0 flex flex-col justify-between">
        <p className="truncate text-sm text-gray-600">{description}</p>

        <div className="flex items-center">
          <MapPinIcon className="h-5 w-5 text-gray-500" />
          <span className="ml-2 text-sm text-gray-700">{location}</span>
        </div>

        <div className="flex items-center">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <span className="ml-2 text-sm text-gray-700">
            {startDate} → {endDate}
          </span>
        </div>

        <div className="flex items-center">
          <UserIcon className="h-5 w-5 text-gray-500" />
          <span className="ml-2 text-sm text-gray-700">
            Created by: {createdBy.name}
          </span>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button className="flex items-center text-sm text-red-600 hover:text-red-800">
          <TrashIcon className="h-4 w-4" />
          <span className="ml-1">Delete</span>
        </button>

        <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
          <PencilIcon className="h-4 w-4" />
          <span className="ml-1">Edit</span>
        </button>
      </div>
    </div>
  );
}
