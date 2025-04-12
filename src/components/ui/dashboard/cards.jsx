
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../../../services/users";
import Card from "./card";
import { CardsSkeleton } from "../skeletons";

export default function CardWrapper() {
  const authCtx = userService.getAuthContext();
  const isAdmin = authCtx?.user?.role === "admin";
  
  const { data } = useQuery({
    queryKey: ["userCount"],
    queryFn: () => userService.fetchUserCount(),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: isAdmin,
    suspense: isAdmin
  });
  
  if (!data) {
    return null;
  }

  const { totalUsers, totalAdmins, totalInstructors, totalLearners } = data;

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

