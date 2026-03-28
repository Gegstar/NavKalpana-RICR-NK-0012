'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useAppDispatch } from '@/redux/store';
import { setUser } from '@/store/userSlice';
import { usersService } from '@/services/users.service';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useAppDispatch();

  // 🔥 Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await usersService.getCurrentUser();
        dispatch(setUser(user)); // ✅ store in Redux
      } catch (error) {
        console.error('Failed to fetch user', error);
        // optional: redirect to login
        // window.location.href = '/login';
      }
    };

    fetchUser();
  }, [dispatch]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ✅ Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* ✅ Main Content */}
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