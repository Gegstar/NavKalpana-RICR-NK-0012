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
        setError('Unable to connect to the server. Please check your internet connection or backend status.');
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

  // High-End Loading State
  if (loading) {
    return (
      <div 
        className={styles.dashboardContainer} 
        style={{ '--sidebar-width': isCollapsed ? '80px' : '260px' } as React.CSSProperties}
      >
        <div className={styles.sidebarWrapper}>
          <StudentSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>
        <main className={styles.mainContent}>
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  // Professional Error State
  if (error) {
    return (
       <div 
        className={styles.dashboardContainer} 
        style={{ '--sidebar-width': isCollapsed ? '80px' : '260px' } as React.CSSProperties}
      >
        <div className={styles.sidebarWrapper}>
          <StudentSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>
        <main className={`${styles.mainContent} flex-center`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
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
        </main>
      </div>
    );
  }

  return (
    <div 
      className={styles.dashboardContainer} 
      style={{ '--sidebar-width': isCollapsed ? '80px' : '260px' } as React.CSSProperties}
    >
      <div className={styles.sidebarWrapper}>
        <StudentSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
