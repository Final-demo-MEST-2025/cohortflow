import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/dashboard/classrooms/classroom/quizzes/common/Button";


export default function Quizzes() {
  // Receives classroom from Quiz provider context
  const classroom = useOutletContext();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-4">Quizzes</h2>
        <div>
          <Link to={`/dashboard/classrooms/${classroom.id}/quizzes/create`}>
            <Button className="flex" size="sm">
              <span className="hidden md:block">Create New Quiz</span>
              <PlusIcon className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-6">
        <div className="bg-white shadow rounded-lg p-4 ">
          <p className="text-gray-600">No quizzes yet for {classroom.name}.</p>
        </div>
      </div>
    </div>
  );
}
