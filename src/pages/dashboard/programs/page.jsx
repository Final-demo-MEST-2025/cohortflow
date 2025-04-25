import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { PlusIcon } from "@heroicons/react/24/outline";
import ProgramCard from "../../../components/ui/dashboard/programs/program-card";
import CohortCard from "../../../components/ui/dashboard/programs/cohort-card";
import ProgramModal from "../../../components/ui/dashboard/programs/program-form";
import CohortModal from "../../../components/ui/dashboard/programs/cohort-form";
import { programService } from "../../../services/programs";
import { userService } from "../../../services/users";
import { useNotification } from "@/hooks";
import Spinner from "../../../components/ui/spinner";

export default function ProgramCohortPage() {
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const notify = useNotification();

  const authCtx = programService.getAuthContext();
  const isAdmin = authCtx?.user?.role === "admin";

  const queryClient = useQueryClient();

  const {data: users=[], isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.fetchUserData(),
    refetchOnWindowFocus: false,
    retry: 3
  });
  



  const { data: programs=[] } = useQuery({
    queryKey: ['programs'],
    queryFn: () => programService.fetchPrograms(),
    refetchOnWindowFocus: false,
    retry: 3,
    enabled: isAdmin,
    // suspense: isAdmin
  });

  const { data: cohorts=[] } = useQuery({
    queryKey: ["cohorts"],
    queryFn: () => programService.fetchCohorts(),
    refetchOnWindowFocus: false,
    retry: 3,
    enabled: isAdmin,
    // suspense: isAdmin,
  });

  const programMutation = useMutation({
    mutationFn: (formData) => programService.mutateProgram(formData),
    onSuccess: (program, formData) => {
      const programs = queryClient.getQueryData(['programs']) || [];
      if (formData.id) {
        const updatedProgram = programs.map((p) =>
          p.id === program.id ? program : p
        );
        queryClient.setQueryData(['programs'], updatedProgram);
      } else {
        queryClient.setQueryData(['programs'], programs.concat(program));
      }
    },
    onError: () => notify(
      'Something went wrong. operation unsuccessful.',
      'error'
    )
  });

  const cohortMutation = useMutation({
    mutationFn: (data) => programService.mutateCohort(data),
    onSuccess: (cohort) => {
      // const cohorts = queryClient.getQueryData(["cohorts"]);
      queryClient.setQueryData(['cohorts'], cohort);
    },
    onError: () =>
      notify(
        "Something went wrong. User registration unsuccessful.",
        "error"
      ),
  });



  const handleProgramSubmit = (formData) => {
    setIsLoading(true);
    programMutation.mutate(formData, {
      onSuccess: () => {
        if (formData.id) {
          notify("Program updated successfully", "success");
        } else {
          notify("New program added successfully", "success");
        }
        setShowProgramModal(false);
        setIsLoading(false);
      }
    });
  };

  const handleCohortSubmit = (formData) => {
    setIsLoading(true);
    cohortMutation.mutate(formData, {
      onSuccess: () => {
        if (formData.id) {
          notify("Cohort updated successfully", "success");
        } else {
          notify("New cohort added successfully", "success");
        }
        setShowCohortModal(false);
        setIsLoading(false);
      }
    });
  };

  const handleEditProgram = (programId) => {
    // const programs = queryClient.getQueryData(['programs']);
    const programToEdit = programs.find(p => p.id === programId);
    setSelectedProgram(programToEdit);
    setShowProgramModal(true);
  }

  const handleEditCohort = (cohortId) => {
    // const cohorts = queryClient.getQueryData(['cohorts']);
    const cohortToEdit = cohorts.find((c) => c.id === cohortId);
    setSelectedCohort(cohortToEdit);
    setShowCohortModal(true);
  }

  if (isFetching) {
    return <Spinner />
  }

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
                <span className="hidden md:block">New Program</span>
                <PlusIcon className="ml-1 h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {programs.length > 0 ? (
                programs.map((program) => (
                  <ProgramCard
                    key={program.id}
                    onProgramEdit={handleEditProgram}
                    program={program}
                  />
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
                New Cohort
                <PlusIcon className="ml-1 h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {cohorts.length > 0 ? (
                cohorts.map((cohort) => (
                  <CohortCard
                    key={cohort.id}
                    cohort={cohort}
                    onCohortEdit={handleEditCohort}
                  />
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
              setIsLoading(false);
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
              setIsLoading(false);
            }}
            onSubmit={handleCohortSubmit}
            programs={programs}
            users={users}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
