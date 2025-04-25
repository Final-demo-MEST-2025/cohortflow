import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import UserProfile from "../../../components/ui/dashboard/users/user-profile";
import { profileService } from "../../../services/profiles";
import { userService } from "../../../services/users";
import Spinner from "../../../components/ui/spinner";
import LoadingBar from "../../../components/ui/loading-bar";

export default function ProfileLayout() {
  const authCtx = profileService.getAuthContext();
  const hasRole = !!authCtx?.user?.role;

  const { data: profile={}, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.fetchUserProfile(),
    refetchOnWindowFocus: false,
    retry: 3,
    enabled: hasRole,
    // suspense: hasRole,
  });

  const { data: authUser={}, isFetching } = useQuery({
    queryKey: ["user"],
    queryFn: () => userService.fetchUser(),
    refetchOnWindowFocus: false,
    retry: 3,
    enabled: hasRole,
    // suspense: hasRole,
  });

  if (isLoading) {
    return <LoadingBar />
  }


  return (
    <div className="md:flex flex-col p-4 md:p-6 space-y-6">
      <h1 className="hidden md:block font-lusitana mb-4 text-xl md:text-2xl md:mb-8">
        Profile
      </h1>
      <div className="mt-6">
        {isFetching
          ? (
            <Spinner />
          ):(
            <Outlet context={{ profile, authUser }} />
          )
        }
      </div>
    </div>
  );
}
