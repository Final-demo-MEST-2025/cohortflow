import { CreateUser } from "./buttons";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

export default function UserActions() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <CreateUser />
      <div className="hidden md:block relative">
        <select
          name="actions"
          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
          defaultValue=""
        >
          <option value="" disabled>
            Actions
          </option>
          <option>Change Role</option>
          <option>Send Email</option>
          <option>Suspend Users</option>
        </select>
        <EllipsisVerticalIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
      </div>
    </div>
  );
}
