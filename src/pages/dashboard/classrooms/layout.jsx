import { Outlet } from "react-router-dom";
import SideNav from "../../../components/ui/dashboard/classrooms/sidenav";

export default function ClassroomLayout() {
  return (
    <div className="flex h-full flex-col">
      <div className="w-full flex-none">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12 md:flex md:flex-col">
        <Outlet />
      </div>
    </div>
  );
}