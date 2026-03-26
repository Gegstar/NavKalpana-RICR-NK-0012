'use client';

import { useState, useEffect } from 'react';
import StudentSidebar from '@/components/Sidebar/StudentSidebar';
import SuperAdminSidebar from '@/components/Sidebar/SuperAdminSidebar';
import { useRouter } from 'next/navigation';

// ✅ Helper to get cookie
const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(
    new RegExp('(^| )' + name + '=([^;]+)')
  );
  return match ? match[2] : null;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  // ✅ Read role from cookie
  useEffect(() => {
    const userRole = getCookie('user_role');

    if (!userRole) {
      router.push('/auth/login');
    } else {
      setRole(userRole);
    }
  }, []);

  // ⏳ Loading until role is fetched
  if (!role) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  // ✅ ROLE-BASED SIDEBAR
  const renderSidebar = () => {
    switch (role) {
      case 'SUPER_ADMIN':
        return (
          <SuperAdminSidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        );

      case 'STUDENT':
      default:
        return (
          <StudentSidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--color-background)',
      }}
    >
      {/* ✅ Sidebar */}
      {renderSidebar()}

      {/* ✅ Main */}
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