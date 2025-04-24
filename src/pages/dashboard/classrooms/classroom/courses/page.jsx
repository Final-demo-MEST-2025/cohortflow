import React from "react";
import { useOutletContext } from "react-router-dom";

export default function Courses() {
  const classroom = useOutletContext();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Courses</h2>
      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-gray-600">No courses yet for {classroom.name}.</p>
      </div>
    </div>
  );
}
