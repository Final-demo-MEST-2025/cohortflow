import { Suspense } from "react";
import { authService } from "@/services/auth";
import { CardsSkeleton } from "@/components/ui/skeletons";
import CardWrapper from "@/components/ui/dashboard/cards";
import AdminDashboard from "@/components/ui/dashboard/admin/overview";
import InstructorDashboard from "@/components/ui/dashboard/instructor/overview";
import LearnerDashboard from "@/components/ui/dashboard/learner/overview";


export default function Page() {
  const { role } = authService.getAuthenticatedUser();

  return (
    <main className="mt-5">
      {role
        ? (
          <>
            {role === "admin" && <AdminDashboard />}
            {role === "instructor" && <InstructorDashboard />}
            {role === "learner" && <LearnerDashboard />}
          </>
        )
        : null
      }
      {/* <h1 className="font-lusitana mb-4 text-xl md:text-2xl">Dashboard</h1> */}
      {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div> */}
    </main>
  );
}
