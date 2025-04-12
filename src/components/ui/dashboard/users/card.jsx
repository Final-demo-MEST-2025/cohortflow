export default function UserCard({ user, setSelectedUser }) { 
  return (
    <div className="p-4 rounded-md shadow-sm flex gap-4 items-start mb-2 w-full bg-white">
      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-brand-200 text-white flex items-center justify-center font-semibold text-lg uppercase">
        {user.name.charAt(0)}
      </div>

      <div className="flex-1">
        <div className="flex flex-col justify-between border-b pb-4">
          <div className="flex justify-between items-center mb-1">
            <p
              className="text-md text-blue-400"
              onClick={() => setSelectedUser(user)}
            >
              {user.name}
            </p>
            <span
              className={`text-sm px-2 py-1 rounded-full ${
                user.status === "Active"
                  ? "bg-green-100 text-green-600"
                  : user.status === "Pending"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {user.status}
            </span>
          </div>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-600">Role: {user.role}</p>
          <p className="text-sm text-gray-500 mt-1">
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          <button className="text-blue-600 text-sm hover:underline">
            View
          </button>
          <button className="text-yellow-600 text-sm hover:underline">
            Assign Role
          </button>
          <button className="text-red-600 text-sm hover:underline">Ban</button>
        </div>
      </div>
    </div>
  );
}
