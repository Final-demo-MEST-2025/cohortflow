import {
  HomeIcon,
  BookOpenIcon,
  MegaphoneIcon,
  ClipboardDocumentListIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import { Link, useParams, useLocation } from "react-router-dom"; 
import clsx from "clsx";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
// import { authService } from "../../../../services/auth";


export default function NavLinks() {
  const { id } = useParams();
  const { pathname } = useLocation()
  // const { role } = authService.getAuthenticatedUser();
  // const isAdmin = role === "admin";
  // const isInstructor = role === "instructor";
  
  const links = [
    { name: "Home", to: "/dashboard/classrooms", icon: HomeIcon },
    {
      name: "Announcements",
      to: `/dashboard/classrooms/${id}`,
      icon: MegaphoneIcon,
    },
    {
      name: "Assignments",
      to: `/dashboard/classrooms/${id}/assignments`,
      icon: ClipboardDocumentListIcon,
    },
    {
      name: "Quizzes",
      to: `/dashboard/classrooms/${id}/quizzes`,
      icon: QuestionMarkCircleIcon,
    },
    {
      name: "Projects",
      to: `/dashboard/classrooms/${id}/projects`,
      icon: DocumentTextIcon,
    },
    {
      name: "Courses",
      to: `/dashboard/classrooms/${id}/courses`,
      icon: BookOpenIcon,
    },
    {
      name: "People",
      to: `/dashboard/classrooms/${id}/people`,
      icon: UserGroupIcon,
    },
  ].filter(Boolean);

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
                "bg-sky-100 text-brand-600": pathname === link.to || pathname.includes(`/${link.name.toLowerCase()}`),
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
