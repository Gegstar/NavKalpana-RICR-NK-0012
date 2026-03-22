// styles/theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';

// Base configuration shared between light and dark
const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    // ... other typography settings (as provided earlier)
  },
  spacing: 8,
  shape: { borderRadius: 12 },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 20px',
          transition: 'all 0.2s ease',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-1px)',
          },
        },
        // ... other component overrides
      },
    },
    // ... other component overrides
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: { main: '#4F46E5', light: '#818CF8', dark: '#4338CA', contrastText: '#FFFFFF' },
    secondary: { main: '#0EA5E9', light: '#38BDF8', dark: '#0284C7' },
    background: { default: '#F9FAFB', paper: '#FFFFFF' },
    text: { primary: '#1F2937', secondary: '#6B7280', disabled: '#9CA3AF' },
    // ... other colors
  },
  // shadows array (optional)
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: { main: '#6366F1', light: '#818CF8', dark: '#4F46E5', contrastText: '#FFFFFF' },
    secondary: { main: '#38BDF8', light: '#60A5FA', dark: '#0EA5E9' },
    background: { default: '#111827', paper: '#1F2937' },
    text: { primary: '#F9FAFB', secondary: '#9CA3AF', disabled: '#6B7280' },
    // ... other colors
  },
  // shadows array (darker shadows for dark mode)
});