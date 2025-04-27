import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ClassroomCard from "@/components/ui/dashboard/classrooms/card";
import { PlusIcon } from "@heroicons/react/24/outline";
import { classroomService } from "@/services/classrooms";
import { Suspense } from "react";
import { ClassroomCardSkeleton } from "@/components/ui/skeletons";
import { authService } from "@/services/auth";
// import Spinner from "@/components/ui/spinner";
import LoadingBar from "@/components/ui/loading-bar";




// Mock data for the classrooms
// const initialClassrooms = [
//   { id: 1, name: "Web Development", createdBy: "John Smith", color: "#FF5252" },
//   {
//     id: 2,
//     name: "JavaScript Fundamentals",
//     createdBy: "Sarah Johnson",
//     color: "#7C4DFF",
//   },
//   { id: 3, name: "UI/UX Design", createdBy: "Michael Chen", color: "#FF9800" },
//   {
//     id: 4,
//     name: "React Masterclass",
//     createdBy: "Emma Wilson",
//     color: "#009688",
//   },
//   {
//     id: 5,
//     name: "Node.js Backend",
//     createdBy: "Robert Davis",
//     color: "#2196F3",
//   },
//   {
//     id: 6,
//     name: "Python for Data Science",
//     createdBy: "Lisa Anderson",
//     color: "#673AB7",
//   },
// ];

export default function ClassroomsPage() {
  const navigate = useNavigate();
  const { role } = authService.getAuthenticatedUser();
  const isAdmin = role === "admin";

  const { data: classrooms = [], isLoading } = useQuery({
    queryKey: ['classrooms'],
    queryFn: () => classroomService.fetchMyClassrooms(),
    refetchOnWindowFocus: false,
    retry: false,
    // suspense: true
  });

  if (isLoading) {
    return <LoadingBar />
  }

  {classrooms.length === 0 && (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-2xl shadow-sm">
      <div className="text-4xl mb-3">🧐</div>
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
        No classrooms found
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        You’re not part of any classroom yet. Once added, your classrooms will appear here.
      </p>
    </div>
  )}


  return (
    <div className="container min-h-screen mx-auto px-4 py-8 bg-gray-50 mt-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-lusitana text-3xl font-bold text-gray-800">
          Classrooms
        </h1>
        {isAdmin && (
          <button
            className="flex items-center rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
            onClick={() => navigate("/dashboard/classrooms/create")}
          >
            <span className="hidden md:block">Create New Classroom</span>
            <PlusIcon className="ml-1 h-4 w-4" />
          </button>
        )}
      </div>

      {classrooms.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-zinc-900 rounded-2xl shadow-sm">
          <div className="text-4xl mb-3">🧐</div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            No classrooms found
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You’re not part of any classroom yet. Once added, your classrooms
            will appear here.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {classrooms.map((classroom) => (
          <Suspense key={classroom.id} fallback={<ClassroomCardSkeleton />}>
            <ClassroomCard key={classroom.id} classroom={classroom} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
