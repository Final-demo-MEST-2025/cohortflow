import React from "react";
import PropTypes from "prop-types";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";
import useDeleteConfirm from "@/feature/delete/use-delete-confirm";

export default function ClassroomCard({ classroom }) {
  const navigate = useNavigate();
  const confirm = useDeleteConfirm();

  const { role } = authService.getAuthenticatedUser();
  const isAdmin = role === "admin";
  return (
    <div
      // onClick={() => openClassroom(classroom)}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-200"
    >
      <Link to={`/dashboard/classrooms/${classroom.id}`} className="block">
        <div
          className="h-32 flex items-center justify-center"
          style={{ backgroundColor: classroom.color }}
        >
          <span className="text-white font-bold text-4xl opacity-50">
            {classroom.name.charAt(0)}
          </span>
        </div>
      </Link>
      <div className="bg-gray-50 p-4">
        <span className="text-xs text-gray-500">{classroom.cohortId.name}</span>
        <div className="flex justify-between">
          <h3 className="text-xl font-medium text-gray-800 mb-1">
            {classroom.name}
          </h3>
          {isAdmin && (
            <div className="flex gap-5">
              <button
                className="flex items-center text-sm text-gray-600 hover:text-blue-800 cursor-pointer"
                onClick={() =>
                  navigate(`/dashboard/classrooms/${classroom.id}/edit`)
                }
              >
                <PencilSquareIcon className="h-4 w-4" />
              </button>

              <button 
                className="flex items-center text-sm text-red-600 hover:text-red-800 cursor-pointer"
                onClick={() =>
                  confirm({
                    title: "Delete classroom?",
                    message: "This action cannot be undone",
                    onConfirm: () => console.log("Deleted"),
                  })
                }
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <p className="text-gray-600 text-sm">by {classroom.createdBy.name}</p>
      </div>
    </div>
  );
}

ClassroomCard.propTypes = {
  classroom: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    cohortId: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    createdBy: PropTypes.shape({
      name: PropTypes.string.isRequired
    })
  }).isRequired,
};
