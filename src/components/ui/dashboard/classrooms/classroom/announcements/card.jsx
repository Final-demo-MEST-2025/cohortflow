import { formatDate } from "@/utils/utils.js";
import { ChatBubbleLeftIcon, HandThumbUpIcon, PaperClipIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import useDeleteConfirm from "@/feature/delete/use-delete-confirm";
import { authService } from "@/services/auth";

export default function Card({ announcement, onEdit, onDelete }) {
  const confirm = useDeleteConfirm();
  const { id } = authService.getAuthenticatedUser();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800">
          {announcement?.title}
        </h3>
        <span className="text-sm text-gray-500">
          {formatDate(announcement?.createdAt)}
        </span>
      </div>

      <div className="flex items-center mt-2 mb-4">
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-brand-600">
          {announcement.createdBy.name?.charAt(0)}
        </div>
        <span className="ml-2 text-sm font-medium text-gray-700">
          {announcement?.createdBy?.name}
        </span>
      </div>

      <div className="text-gray-700 mb-4 overflow-auto">
        <div dangerouslySetInnerHTML={{ __html: announcement.content }} />
      </div>

      {announcement?.attachments > 0 && (
        <div className="flex items-center mb-4 text-sm text-gray-600">
          <PaperClipIcon className="h-4 w-4 mr-1" />
          <span>
            {announcement?.attachments} attachment
            {announcement?.attachments > 1 ? "s" : ""}
          </span>
        </div>
      )}

      <div className="border-t pt-4 flex items-center space-x-6">
        <button className="flex items-center text-sm text-gray-600 hover:text-blue-600">
          <HandThumbUpIcon className="h-4 w-4 mr-1" />
          <span>
            {announcement?.likes} Like{announcement?.likes !== 1 ? "s" : ""}
          </span>
        </button>
        <button className="flex items-center text-sm text-gray-600 hover:text-blue-600">
          <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
          <span>
            {announcement?.comments} Comment
            {announcement?.comments !== 1 ? "s" : ""}
          </span>
        </button>
        <div className="shrink-0 flex-1/2" />
        {announcement.createdBy?.id === id && (
          <div className="flex justify-between shrink-0 gap-4">
            <button
              className="text-gray-600 hover:text-blue-600"
              onClick={() => onEdit(announcement.id)}
            >
              <PencilSquareIcon className="h-5 w-5" />
            </button>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() =>
                confirm({
                  title: "Delete announcement?",
                  message: "This action cannot be undone",
                  onConfirm: () => onDelete(announcement.id),
                })
              }
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}