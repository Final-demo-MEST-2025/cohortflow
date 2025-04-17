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
// import { authService } from "../../../../services/auth";


export default function NavLinks() {
  // const { role } = authService.getAuthenticatedUser();
  // const isAdmin = role === "admin";
  // const isInstructor = role === "instructor";
  
  const links = [
    { name: "Home", to: "/dashboard/classrooms", icon: HomeIcon },
    { name: "Announcements", to: "/dashboard/classrooms/a", icon: Squares2X2Icon },
    { name: "Assignments", to: "/dashboard/cohorts", icon: UserGroupIcon },
    { name: "Quizzes", to: "/dashboard/attendance", icon: CheckCircleIcon },
    { name: "Projects", to: "/dashboard/resources", icon: InboxStackIcon },
    { name: "Courses", to: "/dashboard/courses", icon: BookOpenIcon },
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
