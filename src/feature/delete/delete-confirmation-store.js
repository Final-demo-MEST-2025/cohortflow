import { create } from "zustand";

export const useDeleteConfirmationStore = create((set) => ({
  isOpen: false,
  modalProps: null,
  showModal: (modalProps) => set({ isOpen: true, modalProps }),
  closeModal: () => set({ isOpen: false, modalProps: null }),
}));
