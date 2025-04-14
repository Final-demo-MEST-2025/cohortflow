import { useActionState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavLinks from "./nav-links";
import CohortFlowLogo from "../cohortflow-logo";
import { PowerIcon } from "@heroicons/react/24/outline";
import { authService } from "@/services/auth";
import { useNotification } from "@/hooks";


export default function SideNav() {
  const navigate = useNavigate();
  const notify = useNotification();

  const [_, formAction, isPending] = useActionState(
    async () => {
      try {
        await authService.logout();
        navigate("/");
        notify("Logout successfully", "success");
      } catch (error) {
        notify(error?.response.data.error, 'error')
      }
    }
  )

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-center rounded-md bg-brand-600 p-4 md:h-40"
        to="/"
      >
        <div className="w-32 md:w-40 shrink-0">
          <CohortFlowLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2
          overflow-auto scrollbar-none md:scrollbar-thin md:scrollbar-thumb-brand-200 md:scrollbar-track-transparent"
      >
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form action={formAction}>
          <button
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-brand-600 md:flex-none md:justify-start md:p-2 md:px-3
            aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            aria-disabled={isPending}
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
