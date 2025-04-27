
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/users";
import Card from "./card";
import LoadingBar from "../loading-bar";

export default function CardWrapper() {
  const authCtx = userService.getAuthContext();
  const isAdmin = authCtx?.user?.role === "admin";
  
  const { data: users={}, isLoading } = useQuery({
    queryKey: ["userCount"],
    queryFn: () => userService.fetchUserCount(),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: isAdmin,
    suspense: isAdmin
  });

  if (isLoading) {
    <LoadingBar />
  }
  
  const { totalUsers, totalAdmins, totalInstructors, totalLearners } = users;

  return (
    <>
      {isAdmin && (
        <>
          <Card title="Admins" value={totalAdmins} type="admins" />
          <Card title="Instructors" value={totalInstructors} type="instructors" />
          <Card title="Learners" value={totalLearners} type="learners" />
          <Card title="Total Users" value={totalUsers} type="total" />
        </>
      )}
    </>
  );
}

