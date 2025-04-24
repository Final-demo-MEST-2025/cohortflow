import React from "react";
import { useOutletContext } from "react-router-dom";

export default function Projects() {
  const classroom = useOutletContext();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Projects</h2>
      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-gray-600">No projects yet for {classroom.name}.</p>
      </div>
    </div>
  );
}
