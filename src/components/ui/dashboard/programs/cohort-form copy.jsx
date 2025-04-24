import { Fragment, useState, useEffect } from "react";
import {
  AcademicCapIcon,
  BookOpenIcon,
  UserGroupIcon,
  UserIcon,
  XMarkIcon,
  CheckIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';

export default function CohortModal({
  onClose,
  onSubmit,
  initialData = {},
  programs = [],
  users = [],
  isLoading = false,
}) {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    programId: "",
    startDate: null,
    endDate: null,
    learners: [],
    instructors: [],
  });

  useEffect(() => {
    // Initialize form with existing data when editing
    if (initialData) {
      setFormData({
        name: initialData?.name || "",
        description: initialData?.description || "",
        programId: initialData?.programId || "",
        startDate: initialData?.startDate
          ? new Date(initialData.startDate)
          : null,
        endDate: initialData?.endDate ? new Date(initialData.endDate) : null,
        learners: initialData?.learners || [],
        instructors: initialData?.instructors || [],
      });
    } else {
      // Reset form when creating new
      setFormData({
        name: "",
        description: "",
        programId: "",
        startDate: null,
        endDate:  null,
        learners: [],
        instructors: [],
      });
    }
  }, [initialData]);

  // Prepare options for react-select
const toOption = (item) => ({ value: item.id, label: item.name });

const learnerOptions = users
  .filter((u) => u.role === "learner" && !formData.instructors.includes(u.id))
  .map(toOption);

const instructorOptions = users
  .filter((u) => u.role === "instructor" && !formData.learners.includes(u.id))
  .map(toOption);

const programOptions = programs.map(toOption);

  // Get currently selected options
  const selectedProgram = programOptions.find(p => p.value === formData.programId);
  const selectedLearners = learnerOptions.filter((l) => formData.learners.includes(l.value));
  const selectedInstructors = instructorOptions.filter((i) => formData.instructors.includes(i.value));


  // Search states
  const [learnerSearch, setLearnerSearch] = useState("");
  const [instructorSearch, setInstructorSearch] = useState("");

  // Filter users based on search and existing selections
  const availableLearners = users.filter(
    (user) =>

      user.name.toLowerCase().includes(learnerSearch.toLowerCase()) &&
      user.role === 'learner' &&
      !formData.instructors.includes(user.id)
  );

  const availableInstructors = users.filter(
    (user) =>
      user.name.toLowerCase().includes(instructorSearch.toLowerCase()) &&
      user.role === 'instructor' &&
      !formData.learners.includes(user.id)
  );

  // Toggle user selections
  const toggleLearner = (userId) => {
    setFormData((prev) => ({
      ...prev,
      learners: prev.learners.includes(userId)
        ? prev.learners.filter((id) => id !== userId)
        : [...prev.learners, userId],
    }));
    setLearnerSearch("");
  };

  const toggleInstructor = (userId) => {
    setFormData((prev) => ({
      ...prev,
      instructors: prev.instructors.includes(userId)
        ? prev.instructors.filter((id) => id !== userId)
        : [...prev.instructors, userId],
    }));
    setInstructorSearch("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      startDate: formData.startDate?.toISOString(),
      endDate: formData.endDate?.toISOString(),
    });
  };

  const getUserById = (id) => users.find(user => user.id === id);

  return (
    <Dialog as="div" className="relative z-50" onClose={onClose} open>
      <div className="fixed inset-0 backdrop-blur-[1px] bg-black/5" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl transform overflow-hidden p-6 text-left align-middle shadow-xl transition-all rounded-lg bg-gray-50">
            <DialogTitle
              as="h3"
              className="font-lusitana border-b text-lg font-medium leading-6 text-gray-900 flex justify-between"
            >
              {initialData?.id ? "✏️ Edit Cohort" : "➕ Create Cohort"}
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </DialogTitle>

            <form
              onSubmit={handleSubmit}
              // className="mt-4 max-h-[70vh] overflow-y-auto pr-2"
            >
              <div className="space-y-6">
                {/* Cohort Name */}
                <div>
                  <label>Cohort Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                {/* Program Selection */}
                <div>
                  <label>Program</label>
                  <Select 
                    options={programOptions}
                    value={selectedProgram}
                    onChange={(selected) => setFormData({ ...formData, programId: selected?.value || "" })}
                    placeholder="Select a program"
                    isClearable
                    isSearchable
                  />
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Start Date</label>
                    <DatePicker
                      selected={formData.startDate}
                      onChange={(date) =>
                        setFormData({ ...formData, startDate: date })
                      }
                      selectsStart
                      startDate={formData.startDate}
                      endDate={formData.endDate}
                      minDate={new Date()}
                      placeholderText="Select start date"
                      required
                      dateFormat="MMMM d, yyyy"
                    />
                  </div>
                  <div>
                    <label>End Date</label>
                    <DatePicker
                      selected={formData.endDate}
                      onChange={(date) =>
                        setFormData({ ...formData, endDate: date })
                      }
                      selectsEnd
                      startDate={formData.startDate}
                      endDate={formData.endDate}
                      minDate={formData.startDate || new Date()}
                      placeholderText="Select end date"
                      required
                      dateFormat="MMMM d, yyyy"
                    />
                  </div>
                </div>

                {/* Learners Multi-Select */}
                <div>
                  <label>👥 Add Learners</label>
                  <Combobox value={null} onChange={toggleLearner}>
                    <div className="relative">
                      <div className="relative">
                        <ComboboxInput
                          placeholder="Search learners..."
                          onChange={(e) => setLearnerSearch(e.target.value)}
                          displayValue={() => learnerSearch}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                        </ComboboxButton>
                      </div>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setLearnerSearch("")}
                      >
                        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                          {availableLearners.length === 0 ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                              {learnerSearch
                                ? "No matches"
                                : "No learners available"}
                            </div>
                          ) : (
                            availableLearners.map((user) => (
                              <ComboboxOption
                                key={user.id}
                                value={user.id}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active
                                      ? "bg-brand-50 text-brand-900"
                                      : "text-gray-900"
                                  }`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? "font-medium" : "font-normal"
                                      }`}
                                    >
                                      {user.name}
                                    </span>
                                    {formData.learners.includes(user.id) && (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-600">
                                        <CheckIcon className="h-5 w-5" />
                                      </span>
                                    )}
                                  </>
                                )}
                              </ComboboxOption>
                            ))
                          )}
                        </ComboboxOptions>
                      </Transition>
                    </div>
                  </Combobox>
                  {/* Selected Learners */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.learners.map((id) => {
                      const user = getUserById(id);
                      return user ? (
                        <span
                          key={id}
                          className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-sm"
                        >
                          {user.name}
                          <button
                            type="button"
                            onClick={() => toggleLearner(id)}
                            className="ml-1 text-brand-500 hover:text-brand-700"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Instructors Multi-Select */}
                <div>
                  <label>👨‍🏫 Add Instructors</label>
                  <Combobox value={null} onChange={toggleInstructor}>
                    <div className="relative">
                      <div className="relative">
                        <ComboboxInput
                          placeholder="Search instructors..."
                          onChange={(e) => setInstructorSearch(e.target.value)}
                          displayValue={() => instructorSearch}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                        </ComboboxButton>
                      </div>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setInstructorSearch("")}
                      >
                        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                          {availableInstructors.length === 0 ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                              {instructorSearch
                                ? "No matches"
                                : "No instructors available"}
                            </div>
                          ) : (
                            availableInstructors.map((user) => (
                              <ComboboxOption
                                key={user.id}
                                value={user.id}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active
                                      ? "bg-brand-50 text-brand-900"
                                      : "text-gray-900"
                                  }`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? "font-medium" : "font-normal"
                                      }`}
                                    >
                                      {user.name}
                                    </span>
                                    {formData.instructors.includes(
                                      user.id
                                    ) && (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-600">
                                        <CheckIcon className="h-5 w-5" />
                                      </span>
                                    )}
                                  </>
                                )}
                              </ComboboxOption>
                            ))
                          )}
                        </ComboboxOptions>
                      </Transition>
                    </div>
                  </Combobox>
                  {/* Selected Instructors */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.instructors.map((id) => {
                      const user = users.find((u) => u.id === id);
                      return user ? (
                        <span
                          key={id}
                          className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-sm"
                        >
                          {user.name}
                          <button
                            type="button"
                            onClick={() => toggleInstructor(id)}
                            className="ml-1 text-brand-500 hover:text-brand-700"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-md hover:bg-brand-700 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
