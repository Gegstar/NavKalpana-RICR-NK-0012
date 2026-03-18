'use client';
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4F46E5' },
    secondary: { main: '#0EA5E9' },
    background: { default: '#F9FAFB', paper: '#FFFFFF' },
    text: { primary: '#1F2937', secondary: '#6B7280' },
    success: { main: '#10B981' },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    info: { main: '#3B82F6' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: '3.5rem', lineHeight: 1.2 },
    h2: { fontWeight: 600, fontSize: '2.5rem', lineHeight: 1.3 },
    h3: { fontWeight: 600, fontSize: '2rem' },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '1rem',
          paddingRight: '1rem',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6366F1' },
    secondary: { main: '#38BDF8' },
    background: { default: '#111827', paper: '#1F2937' },
    text: { primary: '#F9FAFB', secondary: '#9CA3AF' },
    success: { main: '#34D399' },
    error: { main: '#F87171' },
    warning: { main: '#FBBF24' },
    info: { main: '#60A5FA' },
  },
  typography: lightTheme.typography,
  components: lightTheme.components,
});