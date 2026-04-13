'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setUser } from '@/store/userSlice';
import { usersService } from '@/services/users.service';
import StudentSidebar from '@/components/Sidebar/Sidebar';
import DashboardSkeleton from '@/components/dashboard/student/DashboardSkeleton';
import { Button, Typography, Box } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import styles from '@/styles/DashboardLayout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await usersService.getCurrentUser();
      dispatch(setUser(userData));
    } catch (err: any) {
      console.error('Failed to fetch user', err);
      if (err.message === 'Network Error') {
        setError(
          'Unable to connect to the server. Please check your internet connection or backend status.'
        );
      } else {
        setError('An unexpected error occurred while loading your profile.');
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Auto-close mobile sidebar when viewport goes back to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setIsMobileSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerClass = [
    styles.dashboardContainer,
    isMobileSidebarOpen ? styles.sidebarOpen : '',
  ]
    .filter(Boolean)
    .join(' ');

  const renderLayout = (content: React.ReactNode) => (
    <div
      className={containerClass}
      style={
        { '--sidebar-width': isCollapsed ? '80px' : '260px' } as React.CSSProperties
      }
    >
      {/* Dark overlay (mobile) */}
      <div
        className={`${styles.overlay} ${isMobileSidebarOpen ? styles.overlayVisible : ''}`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      {/* Hamburger button (visible only on mobile/tablet) */}
      <button
        className={styles.mobileMenuBtn}
        onClick={() => setIsMobileSidebarOpen((v) => !v)}
        aria-label="Toggle sidebar menu"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          {isMobileSidebarOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      <div className={styles.sidebarWrapper}>
        <StudentSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      <main className={styles.mainContent}>{content}</main>
    </div>
  );

  if (loading) return renderLayout(<DashboardSkeleton />);

  if (error)
    return renderLayout(
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
          textAlign: 'center',
          maxWidth: 400,
          mx: 'auto',
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold" color="error">
          Connection Failure
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchUser}
          sx={{ borderRadius: 'var(--radius-md)', px: 4, py: 1.5 }}
        >
          Retry Connection
        </Button>
      </Box>
    );

  return renderLayout(children);
}
