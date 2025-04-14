import { Suspense } from "react";
import { CardsSkeleton } from "../../components/ui/skeletons";
import CardWrapper from "../../components/ui/dashboard/cards";

export default function Page() {

  return (
    <main>
      <h1 className="font-lusitana mb-4 text-xl md:text-2xl">Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
    </main>
  );
}
