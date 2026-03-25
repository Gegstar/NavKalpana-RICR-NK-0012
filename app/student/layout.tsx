'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import Sidebar from '@/components/Sidebar/StudentSidebar';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
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