import { ChevronDownIcon, Cog6ToothIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function UserMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <div className="bg-brand-600 w-10 h-10 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm md:text-md font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
          <ul>
            <li className="hover:bg-gray-50">
              <button className="p-3 w-full text-left text-sm flex items-center space-x-2">
                <Cog6ToothIcon className="w-4 h-4 text-gray-500" />
                <span>Settings</span>
              </button>
            </li>
            <li className="hover:bg-gray-50">
              <button className="p-3 w-full text-left text-sm flex items-center space-x-2">
                <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500" />
                <span>Help & Support</span>
              </button>
            </li>
            <li className="hover:bg-gray-50 border-t border-gray-100">
              <button className="p-3 w-full text-left text-sm text-red-600">
                Log Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
