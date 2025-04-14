import { useState } from "react";
import { CreateUser } from "./buttons";
import { useNotification } from "../../../../hooks";
import {
  EllipsisVerticalIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { ConfirmationModal } from "../confirm-modal";

export default function UserActions({
  onClick,
  selectedUserIds,
  setNewRole,
  newRole,
}) {
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const notify = useNotification();

  const actions = {
    role: {
      title: "Change User Role",
      text: "Update Role",
      description: (
        <div className="relative">
          <select
            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 pr-10 text-xs placeholder:text-gray-500 h-10 appearance-none focus:outline-none"
            defaultValue=""
            onChange={(e) => setNewRole(e.target.value)}
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="admin">Admin</option>
            <option value="instructor">Instructor</option>
            <option value="learner">Learner</option>
          </select>
          <EllipsisVerticalIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
      ),
      variant: "neutral",
      icon: <UserCircleIcon className="h-6 w-6 text-brand-600" />,
    },
    suspend: {
      title: "Suspend Account",
      text: "Suspend",
      description:
        "This will prevent the user from logging in until reactivated.",
      variant: "warning",
      icon: <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />,
    },
    delete: {
      title: "Delete User",
      text: "Delete",
      description: (
        <>
          Are you sure you want to delete the selected user(s)? This action
          cannot be undone.
        </>
      ),
      variant: "danger",
      icon: <TrashIcon className="h-6 w-6 text-red-600" />,
    },
  };

  const currentAction = actions[value];
  const isTrue = !value || selectedUserIds.length === 0;
  console.log(isTrue, newRole);
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <CreateUser />
      <div className="relative hidden md:flex items-center rounded-md">
        <div className="relative">
          <select
            name="actions"
            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 pr-10 text-xs placeholder:text-gray-500 h-10 appearance-none border-r-0 rounded-r-none focus:outline-none"
            defaultValue=""
            onChange={(e) => setValue(e.target.value)}
          >
            <option value="" disabled>
              Actions
            </option>
            <option value="role">Change Role</option>
            <option value="email" disabled>
              Send Email
            </option>
            <option value="suspend">Suspend</option>
            <option value="delete">Delete</option>
          </select>
          <EllipsisVerticalIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
        <button
          className="inline-flex h-10 items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none cursor-pointer"
          onClick={() => {
            isTrue
              ? notify("Please select a user and an action", "info")
              : setIsOpen(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && !isTrue && (
        <ConfirmationModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            if (value ==='role' && newRole =='') {
              notify("Please select a role", "info")
            } else {
              onClick(value);
              setIsOpen(false);
              setNewRole("");
            }
            
          }}
          title={currentAction.title}
          description={currentAction.description}
          confirmText={currentAction.text}
          variant={currentAction.variant}
          icon={currentAction.icon}
        />
      )}
    </div>
  );
}
