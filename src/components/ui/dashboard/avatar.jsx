import { useState } from "react";
import { authService } from "../../../services/auth";

export default function Avatar() {
  const user = authService.getAuthenticatedUser();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <main className="md:self-end">
      <div className="flex flex-col items-center space-y-2 relative h-20 overflow-visible">
        {/* Clickable Avatar */}
        <button
          onClick={toggleDropdown}
          className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-brand-300 hover:border-brand-500 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50"
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-blue-600 text-2xl font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </button>

        {/* Dropdown Content */}
        {isOpen && (
          <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg absolute top-full mt-2 z-10 w-48 border border-gray-100">
            <span className="text-gray-800 font-medium text-lg">
              {user.name}
            </span>
            <span className="text-brand-600 text-sm font-medium bg-indigo-50 px-2 py-1 rounded-full mt-1">
              {user.role}
            </span>

            {/* Optional divider and additional menu items */}
            <div className="w-full border-t border-gray-100 my-2"></div>
            <button className="text-gray-600 hover:text-brand-600 text-sm w-full text-left py-1 px-2 hover:bg-gray-50 rounded">
              Profile
            </button>
            <button className="text-gray-600 hover:text-brand-600 text-sm w-full text-left py-1 px-2 hover:bg-gray-50 rounded">
              Settings
            </button>
            <button className="text-red-500 hover:text-red-700 text-sm w-full text-left py-1 px-2 hover:bg-gray-50 rounded">
              Logout
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
