import React from "react";
import { useOutletContext } from "react-router-dom";

export default function Quizzes() {
  const classroom = useOutletContext();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Quizzes</h2>
      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-gray-600">No quizzes yet for {classroom.name}.</p>
      </div>
    </div>
  );
}
