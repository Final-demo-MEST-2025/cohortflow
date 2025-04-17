import { useState, Fragment } from "react";
import {
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  UserGroupIcon,
  UserIcon,
  PencilIcon,
  ChevronDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  Transition
} from "@headlessui/react";


export default function CohortCard({
  name,
  programId,
  description,
  learners,
  instructors,
  startDate,
  endDate,
}) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [query, setQuery] = useState("");

  const users = [...learners, ...instructors];
  const filteredUsers =
    query === ""
      ? users
      : users.filter((user) =>
          user.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="font-lusitana w-full h-70 rounded-xl bg-gray-50 p-4 shadow-sm">
      <div className="mb-4 flex items-center">
        <AcademicCapIcon className="h-5 w-5 text-gray-700" />
        <h3 className="ml-2 text-lg font-medium">{name}</h3>
      </div>

      <div className="space-y-3 bg-white p-3 rounded-t-2xl shrink-0 flex flex-col justify-between">
        <div className="flex items-center">
          <BookOpenIcon className="h-5 w-5 text-gray-500" />
          <span className="ml-2 text-sm text-gray-700">{programId.name}</span>
        </div>

        <div className="bg-white">
          <p className="truncate text-sm text-gray-600">{description}</p>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <UserGroupIcon className="h-5 w-5 text-gray-500" />
              <span className="ml-2 text-sm text-gray-700">
                {learners.lenght + 1} Learners
              </span>
            </div>
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 text-gray-500" />
              <span className="ml-2 text-sm text-gray-700">
                {instructors.lenght + 1} Instructors
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
            <span className="ml-2 text-sm text-gray-700">
              {startDate} → {endDate}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 :mt-6 flex flex-col md:fle-row justify-between">
        <div className="relative w-48">
          <Combobox value={selectedUser} onChange={setSelectedUser}>
            <ComboboxInput
              className="w-full rounded-md border border-gray-300 focus:outline-none focus:ring2 focus:ring-brand-400 py-1 pl-2 pr-10 text-sm shadow-sm"
              displayValue={(user) => user?.name}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="View users..."
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </ComboboxButton>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg">
                {filteredUsers.map((user) => (
                  <ComboboxOption
                    key={user.id}
                    value={user.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-3 pr-9 ${
                        active ? "bg-blue-50" : "text-gray-900"
                      }`
                    }
                  >
                    {user.name}
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </Transition>
          </Combobox>
        </div>

        <div className="mt-4 md:mt-6 flex justify-between">
          <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
            <PencilIcon className="h-4 w-4" />
            <span className="ml-1">Edit</span>
          </button>
          <button className="flex items-center text-sm text-red-600 hover:text-red-800">
            <TrashIcon className="h-4 w-4" />
            <span className="ml-1">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
