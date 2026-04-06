'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setUser } from '@/store/userSlice';
import { usersService } from '@/services/users.service';
import StudentSidebar from '@/components/Sidebar/Sidebar';
import InstructorSidebar from '@/components/Sidebar/InstructorSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
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
        // window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  // Show loading or placeholder while fetching user
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  // Determine which sidebar to render based on user role
  const renderSidebar = () => {
    if (user?.role === 'instructor') {
      return <InstructorSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />;
    }
    // Default to student sidebar (or admin, if needed)
    return <StudentSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {renderSidebar()}

      {/* Main Content */}
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