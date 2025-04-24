import React from "react";
import { useDeleteConfirmationStore } from "./delete-confirmation-store";
import { motion, AnimatePresence } from "framer-motion";

export default function DeleteConfirmationModal() {
  const { isOpen, modalProps, closeModal } = useDeleteConfirmationStore();

  if (!modalProps) return null;

  const { title, message, onConfirm } = modalProps;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 backdrop-blur-[1px] bg-black/5 z-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h2 className="text-xl font-semibold mb-4">
              {title || "Are you sure?"}
            </h2>
            <p className="text-gray-600 mb-6">
              {message || "This action cannot be undone."}
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-sm bg-gray-300 hover:bg-gray-400 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  closeModal();
                }}
                className="px-4 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
