import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  UserCircleIcon,
  BookOpenIcon,
  BuildingLibraryIcon,
  CogIcon,
  Squares2X2Icon,
  InboxStackIcon,
  CheckCircleIcon,
  UsersIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom"; 
import clsx from "clsx";
import { authService } from "../../../services/auth";


// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.


export default function NavLinks() {
  const { role } = authService.getAuthenticatedUser();
  const isAdmin = role === "admin";
  // const isInstructor = role === "instructor";
  
  const links = [
    { name: "Home", to: "/dashboard", icon: HomeIcon },
    isAdmin && { name: "Programs", to: "/dashboard/programs", icon: Squares2X2Icon },
    isAdmin && { name: "Cohorts", to: "/dashboard/cohorts", icon: UserGroupIcon },
    {
      name: "Classrooms",
      to: "/dashboard/classrooms",
      icon: BuildingLibraryIcon,
    },
    isAdmin && { name: "Attendance", to: "/dashboard/attendance", icon: CheckCircleIcon },
    isAdmin && { name: "Resources", to: "/dashboard/resources", icon: InboxStackIcon },
    isAdmin && { name: "Users", to: "/dashboard/users", icon: UsersIcon },
    { name: "Courses", to: "/dashboard/courses", icon: BookOpenIcon },
    { name: "Profile", to: "/dashboard/profile", icon: UserCircleIcon },
    { name: "Settings", to: "/dashboard/settings", icon: CogIcon },
  ].filter(Boolean);


  const pathname = useLocation().pathname;

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            to={link.to}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-brand-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-brand-600": pathname === link.to,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
