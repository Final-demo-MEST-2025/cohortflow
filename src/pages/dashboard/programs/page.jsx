import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { PlusIcon } from "@heroicons/react/24/outline";
import ProgramCard from "../../../components/ui/dashboard/programs/program-card";
import CohortCard from "../../../components/ui/dashboard/programs/cohort-card";
import ProgramModal from "../../../components/ui/dashboard/programs/program-form";
import CohortModal from "../../../components/ui/dashboard/programs/cohort-form";
import { programService } from "../../../services/programs";
import { useNotification } from "@/hooks";

export default function ProgramCohortPage() {
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const notify = useNotification();

  const authCtx = programService.getAuthContext();
  const isAdmin = authCtx?.user?.role === "admin";

  const queryClient = useQueryClient()


  const programs = useQuery({
    queryKey: ['programs'],
    queryFn: () => programService.fetchPrograms(),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: isAdmin,
    suspense: isAdmin
  });

  const cohorts = useQuery({
    queryKey: ["cohorts"],
    queryFn: () => programService.fetchCohorts(),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: isAdmin,
    suspense: isAdmin,
  });

  const programMutation = useMutation({
    mutationFn: (data) => programService.createProgram(data),
    onSuccess: (program) => {
      const programs = queryClient.getQueryData(['programs'])
      queryClient.setQueryData(['programs'], programs.concat(program))
    },
    onError: () => notify(
      'Something went wrong. User registration unsuccessful.',
      'error'
    )
  });

  const cohortMutation = useMutation({
    mutationFn: (data) => programService.createProgram(data),
    onSuccess: (cohort) => {
      const cohorts = queryClient.getQueryData(["cohorts"]);
      queryClient.setQueryData(['cohorts'], cohorts.concat(cohort))
    },
    onError: () =>
      notify(
        "Something went wrong. User registration unsuccessful.",
        "error"
      ),
  });



  const handleProgramSubmit = (data) => {
    setIsLoading(true);
    programMutation.data(data, {
      onSuccess: () => {
        notify("New program added successfully");
      }
    })
  };

  const handleCohortSubmit = (data) => {
    setIsLoading(true);
    cohortMutation.mutate(data, {
      onSuccess: () => {
        setIsLoading(false);
      }
    })
  };

  const users = queryClient.getQueryData(['userData']);
  console.log(users)

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-2xl font-bold text-gray-900">
          Programs & Cohorts
        </h1>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Programs Section */}
          <section className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Programs</h2>
              <button
                className="flex items-center rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
                onClick={() => {
                  setSelectedProgram(null);
                  setShowProgramModal(true);
                }}
              >
                <PlusIcon className="mr-1 h-4 w-4" />
                New Program
              </button>
            </div>

            <div className="space-y-4">
              {programs.data.length > 0 ? (
                programs.data.map((program) => (
                  <ProgramCard key={program.id} {...program} />
                ))
              ) : (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <p className="text-gray-500">No programs yet</p>
                </div>
              )}
            </div>
          </section>

          {/* Cohorts Section */}
          <section className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Cohorts</h2>
              <button
                className="flex items-center rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
                onClick={() => {
                  setSelectedCohort(null);
                  setShowCohortModal(true);
                }}
              >
                <PlusIcon className="mr-1 h-4 w-4" />
                New Cohort
              </button>
            </div>

            <div className="space-y-4">
              {cohorts.data.length > 0 ? (
                cohorts.data.map((cohort) => (
                  <CohortCard key={cohort.id} {...cohort} />
                ))
              ) : (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <p className="text-gray-500">No cohorts yet</p>
                </div>
              )}
            </div>
          </section>
        </div>
        {showProgramModal && (
          <ProgramModal
            initialData={selectedProgram}
            onClose={() => {
              setShowProgramModal(false);
              setSelectedProgram(null);
            }}
            onSubmit={handleProgramSubmit}
            isLoading={isLoading}
          />
        )}

        {showCohortModal && (
          <CohortModal
            initialData={selectedCohort}
            onClose={() => {
              setShowCohortModal(false);
              setSelectedCohort(null);
            }}
            onSubmit={handleCohortSubmit}
            programs={programs.data}
            users={[]}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
