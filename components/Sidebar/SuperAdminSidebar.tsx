"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "@/styles/StudentSidebar.module.css"; // you can rename later
import { Dispatch, SetStateAction } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  ShieldCheck,
  Activity,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@mui/material";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}

const SuperAdminSidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

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

    router.push("/auth/admin-login");

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // ✅ SUPER ADMIN MENU
  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    {
      name: "Business Units",
      icon: <Building2 size={20} />,
      path: "/business-units",
    },
    {
      name: "Users",
      icon: <Users size={20} />,
      path: "/users",
    },
    {
      name: "Roles & Permissions",
      icon: <ShieldCheck size={20} />,
      path: "/roles",
    },
    {
      name: "System Logs",
      icon: <Activity size={20} />,
      path: "/logs",
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
    },
  ];

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
            Super<span>Admin</span>
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

export default SuperAdminSidebar;
