import { useState } from "react";
import {
  XMarkIcon,
} from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
// import { Listbox, Combobox, Transition } from "@headlessui/react";

// Program Modal Component
export default function ProgramModal({
  onClose,
  onSubmit,
  initialData = {},
  isLoading
}) {
  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    name: initialData?.name || "",
    description: initialData?.description || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    location: initialData?.location || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 backdrop-blur-[1px] bg-black/5 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="rounded-lg bg-gray-50 px-6 pb-4 pt-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <div className="font-lusitana flex justify-between items-center border-b p-4">
            <h3 className="text-lg font-medium"> Create Program</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <label>Program Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
            </div>

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

            <div>
              <label>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div className="flex justify-btween space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 flex-1/2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={clsx(
                  "px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-md hover:bg-brand-700 flex-1/2",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                {isLoading ? "Saving" : "Save"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
