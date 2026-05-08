"use client";

import React, { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, BookOpen, GraduationCap, BookUser, 
  LogOut, ChevronLeft, ChevronRight, Calendar, 
  Settings, Users, ClipboardList, BarChart3, Brain
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
      { name: "Dashboard",  icon: <LayoutDashboard size={20} />, path: "/dashboard" },
      { name: "My Courses", icon: <BookOpen size={20} />,        path: "/my-courses" },
      { name: "All Courses",icon: <BookUser size={20} />,        path: "/courses" },
      { name: "Assignments",icon: <ClipboardList size={20} />,   path: "/assignments" },
      { name: "Quizzes",    icon: <GraduationCap size={20} />,   path: "/quizzes" },
      { name: "Attendance", icon: <Calendar size={20} />,        path: "/attendance" },
      { name: "Study",      icon: <Brain size={20} />,           path: "/study-productivity" },
      { name: "Profile",    icon: <Users size={20} />,           path: "/student-profile" },
    ],
    ADMIN: [
      { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
      { name: "Business Units", icon: <Users size={20} />, path: "/business-units" },
      { name: "Users", icon: <Users size={20} />, path: "/users" },
      { name: "Courses", icon: <BookOpen size={20} />, path: "/courses" },
      { name: "Lessons", icon: <BookUser size={20} />, path: "/lessons" },
      { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
    ],
    SUPER_ADMIN: [
      { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
      { name: "Business Units", icon: <Users size={20} />, path: "/business-units" },
      { name: "Users", icon: <Users size={20} />, path: "/users" },
      { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
    ],
    INSTRUCTOR: [
      { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
      { name: "My Courses", icon: <BookOpen size={20} />, path: "/courses" },
      { name: "Assignments", icon: <ClipboardList size={20} />, path: "/assignments" },
      { name: "Lessons", icon: <BookUser size={20} />, path: "/lessons" },
      { name: "Quizzes", icon: <GraduationCap size={20} />, path: "/quizzes" },
      { name: "Students", icon: <Users size={20} />, path: "/students" },
      { name: "Analytics", icon: <BarChart3 size={20} />, path: "/analytics" },
    ]
  };

  const menuItems = menuConfigs[role as keyof typeof menuConfigs] || menuConfigs.STUDENT;

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
      <button 
        className={styles.toggleBtn} 
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={styles.logoContainer}>
        <Logo variant={isCollapsed ? "icon" : "full"} size="medium" />
      </div>

      <nav className={styles.navMenu}>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`${styles.navItem} ${pathname === item.path ? styles.navActive : ""}`}
          >
            {item.icon}
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      <footer className={styles.logoutWrapper}>
        <div className={styles.themeBox}>
          <ThemeToggle />
          {!isCollapsed && <span style={{ marginLeft: '12px', fontSize: '0.85rem', fontWeight: 600 }}>Theme</span>}
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={20} />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </footer>
    </aside>
  );
};

export default Sidebar;
