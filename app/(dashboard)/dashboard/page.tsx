"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useAppSelector } from "@/store/store"; 
// ✅ Import Dashboards
import StudentDashboard from "@/components/dashboard/student/StudentDashboard";
import SuperAdminDashboard from "@/components/dashboard/SuperAdminDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import InstructorDashboard from "@/components/dashboard/instructor/InstructorDashboard";

export default function DashboardPage() {
  const { user} = useApp();
  const role = useAppSelector((state) => state.user.role);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // ✅ Wait for user to be initialized
  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading dashboard...</div>;
  }

  if (!user) return null;

  // ✅ ROLE-BASED RENDERING
  switch (role) {
    case "SUPER_ADMIN":
      
      return <SuperAdminDashboard />;

    case "ADMIN":
      return <AdminDashboard />;

    case "INSTRUCTOR":
      
      return <InstructorDashboard />;

    case "STUDENT":
    default:
      return <StudentDashboard />;
  }
}
