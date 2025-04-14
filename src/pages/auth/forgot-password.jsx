import { Suspense } from "react";
import { Link } from "react-router-dom";
import ForgotPasswordForm from "../../components/ui/forgotpassword-form";
import CohortFlowLogo from "../../components/ui/cohortflow-logo";

export default function ForgotPassword() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <Link 
          to="/"
          title="Go Home"
          >
          <div className="flex h-20 w-full items-end justify-center rounded-lg bg-brand-500 p-3 md:h-36">
            <div className="w-32 text-white md:w-36">
              <CohortFlowLogo />
            </div>
          </div>
        </Link>
        <Suspense>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
