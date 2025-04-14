export default function UserRow({
  user,
  setSelectedUser,
  isChecked,
  toggleCheckbox,
}) {
  return (
    <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      <td className="whitespace-nowrap p-4">
        <input
          title="select"
          type="checkbox"
          checked={isChecked}
          onChange={toggleCheckbox}
        />
      </td>

      <td className="whitespace-nowrap py-4 pl-6 pr-3 flex">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-brand-200 text-white flex items-center justify-center font-semibold text-sm uppercase">
          {user.name.charAt(0)}
        </div>
      </td>

      <td className="whitespace-nowrap p-4 text-sm">
        <span
          className="font-medium text-blue-400 hover:underline text-sm cursor-pointer"
          onClick={() => setSelectedUser(user)}
        >
          {user.name}
        </span>
      </td>

      <td className="whitespace-nowrap p-4 text-xs">{user.email}</td>
      <td className="whitespace-nowrap p-4 text-xs">{user.role}</td>

      <td className="whitespace-nowrap p-4">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            user.status === "Active"
              ? "bg-green-100 text-green-600"
              : user.status === "Pending"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {user.status}
        </span>
      </td>

      <td className="whitespace-nowrap p-4 text-xs">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );
}
