import { GlobeAltIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

export default function CohortFlowLogo() {
  return (
    <div className="font-lusitana flex md:flex-col items-center leading-none text-white">
      <AcademicCapIcon className="h-13 w-15 md:h-15 md:w-20 shrink-0" />
      <p className="text-[clamp(1.875rem,3vw,1.25rem)]">CohortFlow</p>
    </div>
  );
}
