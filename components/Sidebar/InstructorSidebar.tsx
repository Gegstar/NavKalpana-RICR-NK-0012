'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Dashboard,
  Assignment,
  Quiz,
  People,
  Analytics,
  Settings,
  Logout,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const menuItems = [
  { name: 'Dashboard', icon: <Dashboard />, path: '/instructor/dashboard' },
  { name: 'Assignments', icon: <Assignment />, path: '/instructor/assignments' },
  { name: 'Quizzes', icon: <Quiz />, path: '/instructor/quizzes' },
  { name: 'Students', icon: <People />, path: '/instructor/students' },
  { name: 'Analytics', icon: <Analytics />, path: '/instructor/analytics' },
  { name: 'Settings', icon: <Settings />, path: '/instructor/settings' },
];

export default function InstructorSidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleLogout = () => {
    // Clear auth tokens, redirect to login
    localStorage.clear();
    sessionStorage.clear();
    router.push('/auth/instructor-login');
  };

  return (
    <Box
      sx={{
        width: isCollapsed ? 80 : 260,
        bgcolor: 'background.paper',
        borderRight: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflowX: 'hidden',
        position: 'relative',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Collapse Toggle Button */}
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: 'absolute',
          right: -12,
          top: 20,
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          zIndex: 1,
          '&:hover': { bgcolor: 'action.hover' },
        }}
        size="small"
      >
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </IconButton>

      {/* Logo Area */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-start', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            bgcolor: 'primary.main',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          S
        </Box>
        {!isCollapsed && (
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Skill<span style={{ color: theme.palette.primary.main }}>Verse</span>
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
          return (
            <ListItemButton
              key={item.name}
              component={Link}
              href={item.path}
              selected={isActive}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                px: isCollapsed ? 1 : 2,
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                  '& .MuiListItemText-primary': { color: 'primary.main', fontWeight: 500 },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 2, justifyContent: 'center' }}>
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary={item.name} />}
            </ListItemButton>
          );
        })}
      </List>

      <Divider />

      {/* Logout */}
      <Box sx={{ p: 1, pb: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            px: isCollapsed ? 1 : 2,
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 2, justifyContent: 'center' }}>
            <Logout />
          </ListItemIcon>
          {!isCollapsed && <ListItemText primary="Logout" />}
        </ListItemButton>
      </Box>
    </Box>
  );
}