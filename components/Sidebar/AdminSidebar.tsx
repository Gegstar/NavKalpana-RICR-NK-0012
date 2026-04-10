'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from '@/styles/StudentSidebar.module.css'; // reuse same CSS module
import { authService } from '@/services/auth.service';
import { Dispatch, SetStateAction } from 'react';
import {
  LayoutDashboard,
  Users,
  School,
  BookOpen,
  Activity,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@mui/material';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}

const AdminSidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push('/');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: 'Manage Students', icon: <Users size={20} />, path: '/admin/manage-students' },
    { name: 'Manage Teachers', icon: <School size={20} />, path: '/admin/manage-teachers' },
    { name: 'Course Tracking', icon: <BookOpen size={20} />, path: '/admin/course-tracking' },
    { name: 'Live Users', icon: <Activity size={20} />, path: '/admin/live-users' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/admin/analytics' },
    { name: 'Site Settings', icon: <Settings size={20} />, path: '/admin/site-settings' },
  ];

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      
      {/* Collapse Button */}
      <button className={styles.toggleBtn} onClick={toggleSidebar}>
        {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
      </button>

      {/* Logo */}
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>A</div>
        {!isCollapsed && (
          <span className={styles.logoText}>
            Admin<span>Panel</span>
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
              pathname === item.path ? styles.navActive : ''
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

export default AdminSidebar;
