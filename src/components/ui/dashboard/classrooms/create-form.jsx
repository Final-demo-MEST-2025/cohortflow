import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { programService } from "../../../../services/programs";
import { classroomService } from "../../../../services/classrooms";
import { useNotification } from "../../../../hooks";


// Form validation schema using Zod
const classroomSchema = z.object({
  name: z.string().min(1, { message: "Classroom name is required" }),
  programId: z.string({ message: "Program selection is required" }),
  cohortId: z.string({ message: "Cohort selection is required" }),
  instructors: z
    .array(z.string())
    .min(1, { message: "At least one instructor is required" }),
  learners: z
    .array(z.string())
    .min(1, { message: "At least one learner is required" }),
});

export default function CreateClassroomForm() {
  const { id } = useParams();
  const navigate = useNavigate()
  const notify = useNotification()
  const queryClient = useQueryClient()

  // Determine if form in edit mode
  const isEditMode = !!id;
  // Form state
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    programId: null,
    cohortId: null,
    instructors: [],
    learners: [],
  });

  // Validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  
  // Fetch existing classroom data if in edit mode
  const { data: existingClassroom = {}, isFetched } = useQuery({
    queryKey: ["classroom", id],
    queryFn: () => classroomService.fetchClassroomById(id),
    enabled: isEditMode,
    onError: () => {
      setIsLoading(false);
      setErrors({
        server: "Failed to load classroom data",
      });
    },
  });
  

  // Data fetching queries
  const { data: programs = [] } = useQuery({
    queryKey: ["programs"],
    queryFn: () => programService.fetchPrograms(),
  });

  const { data: cohorts = [], refetch: refetchCohorts } = useQuery({
    queryKey: ["cohorts", formData.programId],
    queryFn: () => programService.fetchCohorts(formData.programId),
    enabled: !!formData.programId,
  });

  const { data: instructors = [], refetch: refetchInstructors } = useQuery({
    queryKey: ["instructors", formData.cohortId],
    queryFn: () => programService.fetchCohortInstructors(formData.cohortId),
    enabled: !!formData.cohortId,
  });

  const { data: learners = [], refetch: refetchLearners } = useQuery({
    queryKey: ["learners", formData.cohortId],
    queryFn: () => programService.fetchCohortLearners(formData.cohortId),
    enabled: !!formData.cohortId,
  });

  // Create classroom mutation
  const classroomMutation = useMutation({
    mutationFn: (formData) => classroomService.mutateClassroom(formData),
    onSuccess: (classroom) => {
      const classrooms = queryClient.getQueryData(["classrooms"]) || [];
      if (id) {
        const updatedClassroom = classrooms.map(c => 
          c.id === classroom.id ? classroom : c
        );
        queryClient.setQueryData(["classrooms"], updatedClassroom);
      } else {
        queryClient.setQueryData(["classrooms"], classrooms.concat(classroom));
      }
      // Clear form after successful submission
      setFormData({
        id: null,
        name: "",
        programId: null,
        cohortId: null,
        instructors: [],
        learners: [],
      });
      setIsSubmitting(false);
      // Here you would typically show success message or redirect
      if (id) {
        notify("Classroom updated successfully!", "success");
      } else {
        notify("Classroom created successfully!", "success");
      }
      navigate(-1);
    },
    onError: (error) => {
      setIsSubmitting(false);
      // Display server-side error
      setErrors({
        ...errors,
        server:
          error.response?.data?.message ||
          "An error occurred while creating the classroom",
      });
      notify("Something went wrong, operation unsuccessful", "error");
    },
  });

  useEffect(() => {
    if (isFetched && existingClassroom?.id) {
      setFormData({
        id: existingClassroom.id,
        name: existingClassroom.name,
        programId: existingClassroom.programId.id,
        cohortId: existingClassroom.cohortId.id,
        instructors: existingClassroom.instructors.map((i) => i.id),
        learners: existingClassroom.learners.map((l) => l.id),
      });
      setIsLoading(false);
    }
  }, [isFetched, existingClassroom]);

  // Reset dependent fields when program changes
  useEffect(() => {
    if (formData.programId) {
      setFormData((prev) => ({
        ...prev,
        cohortId: null,
        instructors: [],
        learners: [],
      }));
      refetchCohorts();
    }
  }, [formData.programId, refetchCohorts]);

  // Reset dependent fields when cohort changes
  useEffect(() => {
    if (formData.cohortId) {
      setFormData((prev) => ({
        ...prev,
        instructors: [],
        learners: [],
      }));
      refetchInstructors();
      refetchLearners();
    }
  }, [formData.cohortId, refetchInstructors, refetchLearners]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  // Handle select input changes
  const handleSelectChange = (option, { name }) => {
    // For single selects
    const value = option?.value || null;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  // Handle multi-select input changes
  const handleMultiSelectChange = (options, { name }) => {
    const values = options.map((option) => option.value);
    setFormData({ ...formData, [name]: values });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare data for validation
    const dataToValidate = {
      name: formData.name,
      programId: formData.programId,
      cohortId: formData.cohortId,
      instructors: formData.instructors,
      learners: formData.learners,
    };

    try {
      // Validate form data
      classroomSchema.parse(dataToValidate);

      // Submit data
      if (isEditMode) {
        classroomMutation.mutate(dataToValidate);
      } else {
        classroomMutation.mutate(dataToValidate);
      }
    } catch (validationError) {
      // Handle validation errors
      const formattedErrors = {};
      validationError.errors.forEach((error) => {
        formattedErrors[error.path[0]] = error.message;
      });
      setErrors(formattedErrors);
      setIsSubmitting(false);
    }
  };

  // Convert data for react-select
  const programOptions = programs.map((program) => ({
    value: program.id,
    label: program.name,
  }));

  const cohortOptions = cohorts.map((cohort) => ({
    value: cohort.id,
    label: cohort.name,
  }));

  const instructorOptions = instructors.map((instructor) => ({
    value: instructor.id,
    label: `${instructor.name}`,
  }));

  const learnerOptions = learners.map((learner) => ({
    value: learner.id,
    label: `${learner.name}`,
  }));

  // Get selected values for react-select
  const selectedInstructors = instructorOptions.filter((option) =>
    formData.instructors.includes(option.value)
  );

  const selectedLearners = learnerOptions.filter((option) =>
    formData.learners.includes(option.value)
  );

  const selectedProgram = programOptions.find(
    (option) => option.value === formData.programId
  );

  const selectedCohort = cohortOptions.find(
    (option) => option.value === formData.cohortId
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading classroom data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="font-lusitana text-2xl font-semibold mb-6 text-gray-800">
        {isEditMode ? "Update Classroom" : "Create New Classroom"}
      </h2>

      {errors.server && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {errors.server}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Classroom Name */}
        <div>
          <label htmlFor="name">
            Classroom Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`${errors.name && "ring-red-500"} `}
            placeholder="Enter classroom name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Program Selection */}
        <div>
          <label
            htmlFor="programId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Program <span className="text-red-600">*</span>
          </label>
          <Select
            id="programId"
            name="programId"
            options={programOptions}
            value={selectedProgram}
            onChange={(option) =>
              handleSelectChange(option, { name: "programId" })
            }
            placeholder="Select program"
            className={errors.programId ? "border-red-500" : ""}
            classNamePrefix="react-select"
          />
          {errors.programId && (
            <p className="mt-1 text-sm text-red-600">{errors.programId}</p>
          )}
        </div>

        {/* Cohort Selection */}
        <div>
          <label htmlFor="cohortId">
            Cohort <span className="text-red-600">*</span>
          </label>
          <Select
            id="cohortId"
            name="cohortId"
            options={cohortOptions}
            value={selectedCohort}
            onChange={(option) =>
              handleSelectChange(option, { name: "cohortId" })
            }
            placeholder="Select cohort"
            isDisabled={!formData.programId}
            className={errors.cohortId ? "border-red-500" : ""}
            classNamePrefix="react-select"
          />
          {!formData.programId && (
            <p className="mt-1 text-sm text-gray-500">
              Please select a program first
            </p>
          )}
          {errors.cohortId && (
            <p className="mt-1 text-sm text-red-600">{errors.cohortId}</p>
          )}
        </div>

        {/* Instructors Selection */}
        <div>
          <label htmlFor="instructors">
            Instructors <span className="text-red-600">*</span>
          </label>
          <Select
            id="instructors"
            name="instructors"
            options={instructorOptions}
            value={selectedInstructors}
            onChange={(options) =>
              handleMultiSelectChange(options, { name: "instructors" })
            }
            placeholder="Select instructors"
            isMulti
            isDisabled={!formData.cohortId}
            className={errors.instructors ? "border-red-500" : ""}
            classNamePrefix="react-select"
          />
          {!formData.cohortId && (
            <p className="mt-1 text-sm text-gray-500">
              Please select a cohort first
            </p>
          )}
          {errors.instructors && (
            <p className="mt-1 text-sm text-red-600">{errors.instructors}</p>
          )}
        </div>

        {/* Learners Selection */}
        <div>
          <label htmlFor="learners">
            Learners <span className="text-red-600">*</span>
          </label>
          <Select
            id="learners"
            name="learners"
            options={learnerOptions}
            value={selectedLearners}
            onChange={(options) =>
              handleMultiSelectChange(options, { name: "learners" })
            }
            placeholder="Select learners"
            isMulti
            isDisabled={!formData.cohortId}
            className={errors.learners ? "border-red-500" : ""}
            classNamePrefix="react-select"
          />
          {!formData.cohortId && (
            <p className="mt-1 text-sm text-gray-500">
              Please select a cohort first
            </p>
          )}
          {errors.learners && (
            <p className="mt-1 text-sm text-red-600">{errors.learners}</p>
          )}
        </div>

        {/* Form Buttons */}
        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: "",
                programId: null,
                cohortId: null,
                instructors: [],
                learners: [],
              });
              setErrors({});
              navigate(-1)
            }}
            className="flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Classroom"
              : "Create Classroom"}
          </button>
        </div>
      </form>
    </div>
  );
};

