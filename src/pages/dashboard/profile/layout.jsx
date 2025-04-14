import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import UserProfile from "../../../components/ui/dashboard/users/user-profile";
import { profileService } from "../../../services/profiles";
import { userService } from "../../../services/users";

export default function ProfileLayout() {
  const authCtx = profileService.getAuthContext();
  const hasRole = !!authCtx?.user?.role;

  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.fetchUserProfile(),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: hasRole,
    suspense: hasRole,
  });

  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => userService.fetchUser(),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: hasRole,
    suspense: hasRole,
  });

  return (
    <div className="md:flex flex-col p-4 md:p-6 space-y-6">
      <h1 className="hidden md:block font-lusitana mb-4 text-xl md:text-2xl md:mb-8">
        Profile
      </h1>
      <div className="mt-6">
        <Outlet context={{profile, user}}/>
      </div>
    </div>
  );
}
