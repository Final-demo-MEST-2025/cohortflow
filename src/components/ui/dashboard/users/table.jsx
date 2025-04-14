import UserRow from "./table-row";
export default function UserTable({
  users,
  setSelectedUser,
  setSelectedUserIds,
  selectedUserIds
}) {

  const toggleCheckbox = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = users?.map((user) => user.id);
      setSelectedUserIds(allIds);
    } else {
      setSelectedUserIds([]);
    }
  };

  const areAllSelected =
    users.length > 0 && selectedUserIds.length === users.length;
  return (
    <>
      <table className="hidden min-w-full text-gray-900 md:table">
        <thead className="rounded-lg bg-gray-50 text-left text-sm font-normal">
          <tr>
            <th scope="col" className="p-4 py-5">
              <input
                type="checkbox"
                title="select all"
                onChange={handleSelectAll}
                checked={areAllSelected}
              />
            </th>
            <th scope="col">
              <div>{""}</div>
            </th>
            <th scope="col" className="px-4 py-5 font-medium">
              Name
            </th>
            <th scope="col" className="px-4 py-5 font-medium">
              Email
            </th>
            <th scope="col" className="px-4 py-5 font-medium">
              Role
            </th>
            <th scope="col" className="px-4 py-5 font-medium">
              Status
            </th>
            <th scope="col" className="px-4 py-5 font-medium">
              Joined
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {users.map((user) => {
            const isChecked = selectedUserIds.includes(user.id);
            return (
              <UserRow
                key={user.id}
                user={user}
                isChecked={isChecked}
                toggleCheckbox={() => toggleCheckbox(user.id)}
                setSelectedUser={setSelectedUser}
              />
            );
          })}
        </tbody>
      </table>
    </>
  );
}
