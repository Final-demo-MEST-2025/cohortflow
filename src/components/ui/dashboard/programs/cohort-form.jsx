import { useState, useEffect } from "react";
import {
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import Select from 'react-select';
import SearchableSelect from "../../searchable-select-final";
import { motion, AnimatePresence } from "framer-motion";

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

  // Create stable references for initial data
  const [initialProgramId, setInitialProgramId] = useState(null);
  const [initialLearners, setInitialLearners] = useState([]);
  const [initialInstructors, setInitialInstructors] = useState([]);

  useEffect(() => {
    // Initialize form with existing data when editing
    if (initialData) {
      setFormData({
        id: initialData.id || "",
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

      // Set stable initial values for SearchableSelect components
      setInitialProgramId(initialData?.programId || "");
      setInitialLearners(initialData?.learners || []);
      setInitialInstructors(initialData?.instructors || []);
    } else {
      // Reset form when creating new
      setFormData({
        name: "",
        description: "",
        programId: "",
        startDate: null,
        endDate: null,
        learners: [],
        instructors: [],
      });
    }
  }, [initialData]);

  
  const learnerOptions = users.filter(
    (u) => u.role === "learner" && !formData.instructors.includes(u.id)
  );

  const instructorOptions = users.filter(
    (u) => u.role === "instructor" && !formData.learners.includes(u.id)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      startDate: formData.startDate?.toISOString(),
      endDate: formData.endDate?.toISOString(),
    });
  };

  return (
    <AnimatePresence>
      <Dialog as="div" className="relative z-50" onClose={onClose} open>
        <div className="fixed inset-0 backdrop-blur-[1px] bg-black/5" />

        <motion.div
          className="fixed inset-0 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="flex min-h-full items-center justify-center p-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <DialogPanel className="w-full max-w-2xl transform overflow-hidden p-6 text-left align-middle shadow-xl transition-all rounded-lg bg-gray-50">
              <DialogTitle
                as="h3"
                className="font-lusitana border-b p-4 text-lg font-medium leading-6 text-gray-900 flex justify-between"
              >
                {initialData?.id ? "Edit Cohort" : "Create Cohort"}
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
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  {/* Program Selection */}
                  <div>
                    <label>Program</label>
                    <SearchableSelect
                      name="programId"
                      options={programs}
                      value={formData.programId}
                      onChange={(selectedId) =>
                        setFormData({
                          ...formData,
                          programId: selectedId,
                        })
                      }
                      placeholder="Select a program"
                      valueKey="id"
                      labelKey="name"
                      isSearchable
                      initialData={initialProgramId}
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
                    <SearchableSelect
                      name="learners"
                      options={learnerOptions}
                      value={formData.learners}
                      onChange={(selectedId) =>
                        setFormData({
                          ...formData,
                          learners: selectedId,
                        })
                      }
                      valueKey="id"
                      labelKey="name"
                      placeholder="Select learners"
                      isMulti
                      isSearchable
                      closeMenuOnSelect={false}
                      closeMenuOnScroll={false}
                      initialData={initialLearners}
                    />
                  </div>

                  {/* Instructors Multi-Select */}
                  <div>
                    <label>👨‍🏫 Add Instructors</label>
                    <SearchableSelect
                      name="instructors"
                      options={instructorOptions}
                      value={formData.instructors}
                      onChange={(selectedId) =>
                        setFormData({
                          ...formData,
                          instructors: selectedId,
                        })
                      }
                      placeholder="Select instructors"
                      valueKey="id"
                      labelKey="name"
                      isMulti
                      isSearchable
                      className="basic-multi-select"
                      closeMenuOnSelect={false}
                      closeMenuOnScroll={false}
                      initialData={initialInstructors}
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="mt-6 flex justify-between space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 flex-1/2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-md hover:bg-brand-700 flex-1/2 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </motion.div>
        </motion.div>
      </Dialog>
    </AnimatePresence>
  );
}
