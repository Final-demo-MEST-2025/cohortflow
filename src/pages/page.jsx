import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import CohortFlowLogo from "../components/ui/cohortflow-logo";
import Image from "../components/ui/image";
import { authService } from "../services/auth";

export default function Page() {
  const authenticated = authService.isAuthenticated();

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-brand-500 p-4 md:h-52">
        <CohortFlowLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-[40%] md:px-20">
          <p className="font-lusitana text-xl text-gray-800 md:text-3xl md:leading-normal">
            <strong>Welcome to CohortFlow.</strong> Your centralized learning platform.{" "}
            <span className="text-brand-400">
              Access your classrooms, courses, assignments, submissions, and
              feedback — all in one place.
            </span>
          </p>
          <Link
            to={{ pathname: authenticated ? "/dashboard" : "auth/login"}}
            className="flex items-center gap-5 self-start rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-400 md:text-base"
          >
            <span>{authenticated ? "Dashboard" : "Login"}</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          <Image
            src='/desk1.svg'
            width={1224}
            height={760}
            className='hidden md:block'
            alt='Screenshots of the dashbord project showing desktop version'
          />
          <Image
            src='/mob1.svg'
            width={560}
            height={620}
            className='block md:hidden'
            alt='Screenshots of the dashbord project showing mobile version'
          />
        </div>
      </div>
    </main>
  );
  
}