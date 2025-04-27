import { BellIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button 
        className="relative p-2 text-gray-600 hover:text-brand-600 transition-colors duration-200"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <BellIcon className="w-6 h-6" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-10 overflow-hidden">
          <div className="p-3 bg-teal-50 border-b border-brand-100 flex justify-between items-center">
            <h3 className="font-medium">Notifications</h3>
            <button className="text-xs text-brand-600 hover:text-brand-800">Mark all as read</button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <div className="p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
              <p className="text-sm font-medium">New user registration</p>
              <p className="text-xs text-gray-500">Emma Watson joined as an instructor</p>
              <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
            </div>
            <div className="p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
              <p className="text-sm font-medium">Resource update</p>
              <p className="text-xs text-gray-500">React Fundamentals course updated to v2</p>
              <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
            </div>
            <div className="p-3 hover:bg-gray-50 cursor-pointer">
              <p className="text-sm">System maintenance completed</p>
              <p className="text-xs text-gray-400 mt-1">Yesterday</p>
            </div>
          </div>
          <div className="p-2 bg-gray-50 text-center">
            <button className="text-sm text-brand-600 hover:text-brand-800">View all notifications</button>
          </div>
        </div>
      )}
    </div>
  );
};