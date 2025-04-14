import { Outlet } from "react-router-dom";
import SideNav from "../../components/ui/dashboard/sidenav";
import Avatar from "../../components/ui/dashboard/avatar";
import { useLocation  } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12 md:flex md:flex-col">
        {!location.pathname.includes("/users/me") && <Avatar />}
        <Outlet />
      </div>
    </div>
  );
}