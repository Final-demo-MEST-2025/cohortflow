import { useDeleteConfirmationStore } from "./delete-confirmation-store";

export default function useDeleteConfirm() {
  const showModal = useDeleteConfirmationStore((state) => state.showModal);

  return ({ title, message, onConfirm }) => {
    showModal({ title, message, onConfirm });
  };
}
