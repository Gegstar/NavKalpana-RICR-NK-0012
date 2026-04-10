"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "@/styles/StudentSidebar.module.css";
import { authService } from "@/services/auth.service";
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
import { useAppSelector, useAppDispatch } from "@/store/store"; 
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // ✅ GET USER ROLE FROM REDUX
  const role = useAppSelector((state) => state.user.role);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // ✅ LOGOUT FUNCTION
  const handleLogout = async () => {
    await authService.logout();
    router.push("/");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // ================= ROLE-BASED MENUS =================

  const studentMenu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "My Courses", icon: <BookOpen size={20} />, path: "/my-courses" },
    { name: "All Courses", icon: <BookUser size={20} />, path: "/courses" },
    { name: "Learning List", icon: <Flame size={20} />, path: "/learning-list"},
    { name: "Assignments", icon: <Flame size={20} />, path: "/assignments" },
    { name: "Quizzes", icon: <GraduationCap size={20} />, path: "/quizzes" },
    { name: "Attendance", icon: <Calendar size={20} />, path: "/attendance" },
    { name: "Learning Support", icon: <BookUser size={20} />, path: "/learning-support" },
    { name: "Profile", icon: <Users /> , path: "/student-profile"}
  ];

  const adminMenu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Business Units", icon: <Users size={20} />, path: "/business-units" },
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

  const instructorMenu = [
  { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
  { name: "My Courses", icon: <BookOpen size={20} />, path: "/courses" },
  { name: "Assignments", icon: <Flame size={20} />, path: "/assignments" },
  { name: "Quizzes", icon: <GraduationCap size={20} />, path: "/quizzes" },
  { name: "Students", icon: <Users size={20} />, path: "/students" },
  { name: "Analytics", icon: <GraduationCap size={20} />, path: "/analytics" },
  { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
];
 

  //  SELECT MENU BASED ON ROLE
  const getMenu = () => {
    switch (role) {
      case "SUPER_ADMIN":
        return superAdminMenu;
      case "ADMIN":
        return adminMenu;
        case "INSTRUCTOR":
      return instructorMenu;
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
        {!isCollapsed && (
          <Logo variant="full" size="medium" />
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

      {/* Actions */}
      <div className={styles.logoutWrapper}>
        <div style={{ display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-start', paddingLeft: isCollapsed ? 0 : '1rem', paddingBottom: '0.5rem' }}>
          <ThemeToggle />
        </div>
        <Button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
