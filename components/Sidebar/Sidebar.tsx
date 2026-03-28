"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "@/styles/StudentSidebar.module.css";
import { Dispatch, SetStateAction } from "react";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  BookUser,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Flame,
  Settings,
  Users,
} from "lucide-react";
import { Button } from "@mui/material";
import { useAppSelector } from "@/redux/store"; // ✅ IMPORT

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  // ✅ GET USER ROLE FROM REDUX
  const role = useAppSelector((state) => state.user.role);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    router.push("/auth/student-login");

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // ================= ROLE-BASED MENUS =================

  const studentMenu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Courses", icon: <BookOpen size={20} />, path: "/my-courses" },
    { name: "Assignments", icon: <Flame size={20} />, path: "/assignments" },
    { name: "Quizzes", icon: <GraduationCap size={20} />, path: "/quizzes" },
    { name: "Attendance", icon: <Calendar size={20} />, path: "/attendance" },
    { name: "Learning Support", icon: <BookUser size={20} />, path: "/learning-support" },
  ];

  const adminMenu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Users", icon: <Users size={20} />, path: "/users" },
    { name: "Courses", icon: <BookOpen size={20} />, path: "/courses" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  const superAdminMenu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Business Units", icon: <Users size={20} />, path: "/business-units" },
    { name: "Users", icon: <Users size={20} />, path: "/users" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  // ✅ SELECT MENU BASED ON ROLE
  const getMenu = () => {
    switch (role) {
      case "SUPER_ADMIN":
        return superAdminMenu;
      case "ADMIN":
        return adminMenu;
      case "STUDENT":
      default:
        return studentMenu;
    }
  };

  const menuItems = getMenu();

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
      
      {/* Collapse Button */}
      <button className={styles.toggleBtn} onClick={toggleSidebar}>
        {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
      </button>

      {/* Logo */}
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>S</div>
        {!isCollapsed && (
          <span className={styles.logoText}>
            Skill<span>verse</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className={styles.navMenu}>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`${styles.navItem} ${
              pathname === item.path ? styles.navActive : ""
            }`}
          >
            {item.icon}
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className={styles.logoutWrapper}>
        <Button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;