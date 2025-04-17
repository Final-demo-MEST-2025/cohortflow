import { Fragment, useState } from "react";
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
    name: initialData?.name || "",
    description: initialData?.description || "",
    programId: initialData?.programId || "",
    startDate: initialData?.startDate ? new Date(initialData.startDate) : null,
    endDate: initialData?.endDate ? new Date(initialData.endDate) : null,
    learnerIds: initialData?.learnerIds || [],
    instructorIds: initialData?.instructorIds || [],
  });

  // Search states
  const [learnerSearch, setLearnerSearch] = useState("");
  const [instructorSearch, setInstructorSearch] = useState("");

  // Filter users based on search and existing selections
  const availableLearners = users.filter(
    (user) =>
      user.name.toLowerCase().includes(learnerSearch.toLowerCase()) &&
      !formData.instructorIds.includes(user.id)
  );

  const availableInstructors = users.filter(
    (user) =>
      user.name.toLowerCase().includes(instructorSearch.toLowerCase()) &&
      !formData.learnerIds.includes(user.id)
  );

  // Toggle user selections
  const toggleLearner = (userId) => {
    setFormData((prev) => ({
      ...prev,
      learnerIds: prev.learnerIds.includes(userId)
        ? prev.learnerIds.filter((id) => id !== userId)
        : [...prev.learnerIds, userId],
    }));
    setLearnerSearch("");
  };

  const toggleInstructor = (userId) => {
    setFormData((prev) => ({
      ...prev,
      instructorIds: prev.instructorIds.includes(userId)
        ? prev.instructorIds.filter((id) => id !== userId)
        : [...prev.instructorIds, userId],
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

  return (
    <Dialog as="div" className="relative z-50" onClose={onClose} open>
      <div className="fixed inset-0 bg-black bg-opacity-50" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <DialogTitle
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900 flex justify-between"
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
              className="mt-4 max-h-[70vh] overflow-y-auto pr-2"
            >
              <div className="space-y-6">
                {/* Cohort Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cohort Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 p-2 shadow-sm"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full rounded-md border border-gray-300 p-2 shadow-sm"
                  />
                </div>

                {/* Program Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Program
                  </label>
                  <select
                    value={formData.programId}
                    onChange={(e) =>
                      setFormData({ ...formData, programId: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 p-2 shadow-sm"
                    required
                  >
                    <option value="">Select a program</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <DatePicker
                      selected={formData.startDate}
                      onChange={(date) =>
                        setFormData({ ...formData, startDate: date })
                      }
                      selectsStart
                      startDate={formData.startDate}
                      endDate={formData.endDate}
                      minDate={new Date()}
                      className="w-full rounded-md border border-gray-300 p-2 shadow-sm"
                      placeholderText="Select start date"
                      required
                      dateFormat="MMMM d, yyyy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <DatePicker
                      selected={formData.endDate}
                      onChange={(date) =>
                        setFormData({ ...formData, endDate: date })
                      }
                      selectsEnd
                      startDate={formData.startDate}
                      endDate={formData.endDate}
                      minDate={formData.startDate || new Date()}
                      className="w-full rounded-md border border-gray-300 p-2 shadow-sm"
                      placeholderText="Select end date"
                      required
                      dateFormat="MMMM d, yyyy"
                    />
                  </div>
                </div>

                {/* Learners Multi-Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    👥 Add Learners
                  </label>
                  <Combobox value={null} onChange={toggleLearner}>
                    <div className="relative">
                      <div className="relative">
                        <ComboboxInput
                          className="w-full rounded-md border border-gray-300 p-2 pl-10 shadow-sm"
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
                                      ? "bg-blue-50 text-blue-900"
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
                                    {formData.learnerIds.includes(user.id) && (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
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
                    {formData.learnerIds.map((id) => {
                      const user = users.find((u) => u.id === id);
                      return user ? (
                        <span
                          key={id}
                          className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm"
                        >
                          {user.name}
                          <button
                            type="button"
                            onClick={() => toggleLearner(id)}
                            className="ml-1 text-blue-500 hover:text-blue-700"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    👨‍🏫 Add Instructors
                  </label>
                  <Combobox value={null} onChange={toggleInstructor}>
                    <div className="relative">
                      <div className="relative">
                        <ComboboxInput
                          className="w-full rounded-md border border-gray-300 p-2 pl-10 shadow-sm"
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
                                      ? "bg-blue-50 text-blue-900"
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
                                    {formData.instructorIds.includes(
                                      user.id
                                    ) && (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
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
                    {formData.instructorIds.map((id) => {
                      const user = users.find((u) => u.id === id);
                      return user ? (
                        <span
                          key={id}
                          className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm"
                        >
                          {user.name}
                          <button
                            type="button"
                            onClick={() => toggleInstructor(id)}
                            className="ml-1 text-green-500 hover:text-green-700"
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
                  className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 ${
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
