"use client";

import React, { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  BookUser,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Settings,
  Users,
  ClipboardList,
  BarChart3,
  Brain,
  ClipboardCheck,
  Activity,
  Building2,
  Layers,
  FolderOpen,
  FileText,
  HelpCircle,
  UserCheck,
} from "lucide-react";

import styles from "@/styles/StudentSidebar.module.css";
import { authService } from "@/services/auth.service";
import { useAppSelector } from "@/store/store";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const role = useAppSelector((state) => state.user.role);

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push("/");
      setTimeout(() => window.location.reload(), 100);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const menuConfigs: Record<string, MenuItem[]> = {
    STUDENT: [
      { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
      { name: "My Courses", icon: <BookOpen size={20} />, path: "/my-courses" },
      { name: "All Courses", icon: <BookUser size={20} />, path: "/courses" },
      { name: "Assignments", icon: <ClipboardList size={20} />, path: "/assignments" },
      { name: "Quizzes", icon: <GraduationCap size={20} />, path: "/quizzes" },
      { name: "Attendance", icon: <Calendar size={20} />, path: "/attendance" },
      { name: "Study", icon: <Brain size={20} />, path: "/study-productivity" },
      { name: "Profile", icon: <Users size={20} />, path: "/student-profile" },
    ],
    ADMIN: [
      { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
      { name: "Manage Students", icon: <UserCheck size={20} />, path: "/manage-students" },
      { name: "Manage Teachers", icon: <GraduationCap size={20} />, path: "/manage-teachers" },
      { name: "Course Tracking", icon: <ClipboardCheck size={20} />, path: "/course-tracking" },
      { name: "Live Users", icon: <Activity size={20} />, path: "/live-users" },
      { name: "Analytics", icon: <BarChart3 size={20} />, path: "/analytics" },
      
      { name: "Courses", icon: <BookOpen size={20} />, path: "/courses" },
      { name: "Modules", icon: <ClipboardCheck size={20} />, path: "/modules" },
      { name: "Lessons", icon: <BookUser size={20} />, path: "/lessons" },
      { name: "Lessons Resources", icon: <ClipboardCheck size={20} />, path: "/lesson-resources" },
      { name: "Settings", icon: <Settings size={20} />, path: "/settings" }
    ],
    SUPER_ADMIN: [
      { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
      { name: "Business Units", icon: <Building2 size={20} />, path: "/business-units" },
      { name: "Users", icon: <Users size={20} />, path: "/users" },
      { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
    ],
    INSTRUCTOR: [
      { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
      { name: "My Courses", icon: <BookOpen size={20} />, path: "/courses" },
      { name: "Modules", icon: <Layers size={20} />, path: "/modules" },
      { name: "Lessons", icon: <FolderOpen size={20} />, path: "/lessons" },
      { name: "Lesson Resources", icon: <FileText size={20} />, path: "/lesson-resources" },
      { name: "Assignments", icon: <ClipboardList size={20} />, path: "/assignments" },
      { name: "Quizzes", icon: <HelpCircle size={20} />, path: "/quizzes" },
      { name: "Students", icon: <Users size={20} />, path: "/students" },
      { name: "Analytics", icon: <BarChart3 size={20} />, path: "/analytics" },
    ],
  };

  const menuItems = menuConfigs[role as keyof typeof menuConfigs] || menuConfigs.STUDENT;

  return (
    <Box
      component="aside"
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}
    >
      {/* Toggle button */}
      <IconButton
        className={styles.toggleBtn}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </IconButton>

      {/* Logo */}
      <Box className={styles.logoContainer}>
        <Logo variant={isCollapsed ? "icon" : "full"} size="medium" />
      </Box>

      {/* Navigation */}
      <Box component="nav" className={styles.navMenu}>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`${styles.navItem} ${pathname === item.path ? styles.navActive : ""}`}
          >
            {item.icon}
            {!isCollapsed && <Typography component="span">{item.name}</Typography>}
          </Link>
        ))}
      </Box>

      {/* Footer */}
      <Box component="footer" className={styles.logoutWrapper}>
        <Box className={styles.themeBox}>
          <ThemeToggle />
          {!isCollapsed && (
            <Typography
              sx={{
                ml: 1.5,
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--color-text-primary)",
              }}
            >
              Theme
            </Typography>
          )}
        </Box>
        <Button
          onClick={handleLogout}
          className={styles.logoutBtn}
          startIcon={<LogOut size={20} />}
          fullWidth
          sx={{ justifyContent: isCollapsed ? "center" : "flex-start" }}
        >
          {!isCollapsed && "Sign Out"}
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;