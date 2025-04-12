import UserRow from "./table-row";
export default function UserTable({ users, setSelectedUser }) {
  return (
    <>
      <table className="hidden min-w-full text-gray-900 md:table">
        <thead className="rounded-lg bg-gray-50 text-left text-sm font-normal">
          <tr>
            <th className="p-4">
              <div>{""}</div>
            </th>
            <th scope="col" className="px-4 py-5 font-medium">Name</th>
            <th scope="col" className="px-3 py-5 font-medium">Email</th>
            <th scope="col" className="px-3 py-5 font-medium">Role</th>
            <th scope="col" className="px-3 py-5 font-medium">Status</th>
            <th scope="col" className="px-4 py-5 font-medium">Joined</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              setSelectedUser={setSelectedUser}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
