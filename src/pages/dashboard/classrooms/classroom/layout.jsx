import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { classroomService } from "@/services/classrooms";
import SideNav from "@/components/ui/dashboard/classrooms/classroom/sidenav";
import Spinner from "@/components/ui/spinner";
import LoadingBar from "../../../../components/ui/loading-bar";

export default function ClassroomLayout() {
  const { id } = useParams()

  const { data: classroom={}, isLoading } = useQuery({
    queryKey: ["classroom", id],
    queryFn: () => classroomService.fetchClassroomById(id)
  });

  if (isLoading) {
    return <LoadingBar />
  }
 
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {classroom.name}
            </h1>
            {/* <p className="text-gray-600">Created by {classroom.creator}</p> */}
          </div>

          <div className="overflow-x-auto flex pb-3 scrollbar-none md:scrollbar-thin md:scrollbar-thumb-brand-200 md:scrollbar-track-transparent">
            <nav className="flex space-x-6 min-w-max">
              <SideNav />
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Outlet context={classroom} />
      </main>
    </div>
  );
}