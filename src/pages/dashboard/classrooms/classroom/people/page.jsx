import React from "react";
import { useOutletContext } from "react-router-dom";

export default function People() {
  const classroom = useOutletContext();


  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Instructors</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {classroom?.instructors.map((instructor) => (
            <li key={instructor.id} className="px-6 py-4 flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {instructor.name.charAt(0)}
                </span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  {instructor.name}
                </p>
                <p className="text-sm text-gray-500">{instructor.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <h2 className="text-xl font-semibold mb-4 mt-5">Learners</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {classroom?.learners.map((learner) => (
            <li key={learner.id} className="px-6 py-4 flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {learner.name.charAt(0)}
                </span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  {learner.name}
                </p>
                <p className="text-sm text-gray-500">{learner.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
