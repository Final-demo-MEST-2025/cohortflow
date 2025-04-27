
import { Outlet } from "react-router-dom";
import clsx from "clsx";
import SideNav from "../../components/ui/dashboard/sidenav";
import Avatar from "../../components/ui/dashboard/avatar";
// import { useLocation } from "react-router-dom";
import NotificationMenu from "../../components/ui/dashboard/notification-menu";
import UserMenu from "../../components/ui/dashboard/user-menu";
import { authService } from "../../services/auth";
import Greeting from "../../components/ui/dashboard/greeting";

export default function Layout() {
  // const location = useLocation();
  // const pathname = location.pathname;
  // const isShow = !(
  //   pathname.includes("/users/me") || pathname.includes("/classrooms")
  // );
  // const isClassroom = pathname.includes("/classrooms");
  const user = authService.getAuthenticatedUser();
  const greeting = <Greeting />


  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div
        className={clsx(
          "flex-grow p-6 md:pt-6 md:pr-3 md:overflow-y-auto md:flex md:flex-col scrollbar-none md:scrollbar-thin md:scrollbar-thumb-brand-200 md:scrollbar-track-transparent"
        )}
      >
        <div className="flex items-center justify-end space-x-2 pr-6">
          <NotificationMenu />
          <UserMenu user={user} />
        </div>
        <Outlet context={greeting}/>
      </div>
    </div>
  );
}
