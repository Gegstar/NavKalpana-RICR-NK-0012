'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setUser } from '@/store/userSlice';
import { usersService } from '@/services/users.service';
import StudentSidebar from '@/components/Sidebar/Sidebar';
import InstructorSidebar from '@/components/Sidebar/InstructorSidebar'; // ✅ add
import AdminSidebar from '@/components/Sidebar/AdminSidebar'; // ✅ add

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await usersService.getCurrentUser();
        dispatch(setUser(userData));
      } catch (error) {
        console.error('Failed to fetch user', error);
        // Optionally redirect to login
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  const renderSidebar = () => {
    const role = user?.role;
    if (role === 'INSTRUCTOR') {
      return <InstructorSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />;
    }
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      return <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />;
    }
    // Default to student sidebar
    return <StudentSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {renderSidebar()}
      <main
        style={{
          flex: 1,
          marginLeft: isCollapsed ? '80px' : '260px',
          transition: 'margin-left 0.3s ease',
          overflowX: 'auto',
          padding: '1.5rem',
        }}
      >
        {children}
      </main>
    </div>
  );
}
