import { Outlet } from "react-router-dom";
import clsx from "clsx";
import SideNav from "../../components/ui/dashboard/sidenav";
import Avatar from "../../components/ui/dashboard/avatar";
import { useLocation  } from "react-router-dom";
import { authService } from "../../services/auth";

export default function Layout() {
  const location = useLocation();
  const pathname = location.pathname;
  const isShow = !(pathname.includes("/users/me") || pathname.includes("/classrooms"));
  const isClassroom = pathname.includes("/classrooms");
  const { name, role } = authService.getAuthenticatedUser()

  const getGreeting = () => {
    const now = new Date();

    const hour = now.getHours();
    let greeting;
    if ( hour < 12) {
      greeting = "Good morning";
    }else if (hour < 18) {
      greeting ="Good afternoon";
    }else {
      greeting = "Good evening";
    }

    return `${greeting}, ${name} (${role})`;
  }

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div
        className={clsx(
          isClassroom ? "md:p-6" : "md:p-12",
          "flex-grow p-6 md:overflow-y-auto md:flex md:flex-col scrollbar-none md:scrollbar-thin md:scrollbar-thumb-brand-200 md:scrollbar-track-transparent"
        )}
      >
        {isShow &&  (
          <>
            <div className="relative">
              <div className="flex absolute right-40 left-0 w-[90%] h-20 items-center px-3 py-2 text-brand-800 rounded-sm">
                <span className="text-sm md:text-3xl font-medium">
                  {getGreeting()}
                </span>
              </div>
            </div>
            <Avatar />
          </>
        )}
        <Outlet />
      </div>
    </div>
  );
}