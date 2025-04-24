import { Outlet } from "react-router-dom";
import clsx from "clsx";
import SideNav from "../../components/ui/dashboard/sidenav";
import Avatar from "../../components/ui/dashboard/avatar";
import { useLocation  } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const pathname = location.pathname;
  const isShow = !(pathname.includes("/users/me") || pathname.includes("/classrooms"));
  const isClassroom = pathname.includes("/classrooms");
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
        {isShow && <Avatar />}
        <Outlet />
      </div>
    </div>
  );
}