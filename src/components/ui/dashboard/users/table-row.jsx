export default function UserRow({ user, setSelectedUser }) {
  return (
    <tr className="border-t hover:bg-gray-50 transition">
      <td className="p-4">
        <input title="select" type="checkbox" />
      </td>

      <td className="p-4 flex items-center gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-brand-200 text-white flex items-center justify-center font-semibold text-sm uppercase">
          {user.name.charAt(0)}
        </div>
        <span
          className="font-medium text-blue-400 hover:underline text-sm cursor-pointer"
          onClick={() => setSelectedUser(user)}
        >
          {user.name}
        </span>
      </td>

      <td className="p-4 text-xs">{user.email}</td>
      <td className="p-4 text-xs">{user.role}</td>

      <td className="p-4">
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

      <td className="p-4 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
    </tr>
  );
}
