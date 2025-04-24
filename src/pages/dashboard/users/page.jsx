import { useState  } from "react";
import UserModal from "@/components/ui/dashboard/users/user-modal";
import UserSearch from "@/components/ui/dashboard/search";
import UserActions from "@/components/ui/dashboard/users/actions";
import UserCard from "@/components/ui/dashboard/users/card";
import UserTable from "@/components/ui/dashboard/users/table";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/users";
import LoadingBar from "@/components/ui/loading-bar";
import Spinner from "@/components/ui/spinner";


export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [newRole, setNewRole] = useState(""); 
  

  const authCtx = userService.getAuthContext();
  const isAdmin = authCtx?.user?.role === "admin";

  
  const { data, isLoading } = useQuery({
    queryKey:["users"],
    queryFn: () => userService.fetchUserData(),
    refetchOnWindowFocus: false,
    retry: 3,
    enabled: isAdmin,
    // suspense: isAdmin
  });

  // 
  const handleActions = (type) => {
    console.log(type);
    console.log(selectedUserIds);
    console.log(newRole)
  }

  if (isLoading) {
    return <LoadingBar />
  }

  if (!data) return <Spinner />;
  return (
    <main className="p-4 md:p-6 space-y-6">
      <h1 className="font-lusitana mb-4 text-xl md:text-2xl md:mb-8">Users</h1>
      <div className="flex lg:flex-row lg:items-center lg:justify-between gap-4">
        <UserSearch placeholder="search by name...." />
        <UserActions
          onClick={handleActions}
          selectedUserIds={selectedUserIds}
          newRole={newRole}
          setNewRole={setNewRole}
        />
      </div>

      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden space-y-4">
              {data.map((user) => (
                <UserCard key={user.id} user={user} setSelectedUser={setSelectedUser} />
              ))}
            </div>

            <UserTable
              users={data}
              setSelectedUser={setSelectedUser}
              setSelectedUserIds={setSelectedUserIds}
              selectedUserIds={selectedUserIds}
            />
          </div>
        </div>
        {selectedUser && (
          <UserModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </div>
    </main>
  );
}
