'use client';
import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Link from 'next/link';
import { useTheme as useCustomTheme } from '@/context/ThemeContext';
import styles from '@/styles/Navbar.module.css';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'Features', href: '#features' },
  { label: 'Instructors', href: '#instructors' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleTheme } = useCustomTheme();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemText
              primary={
                <Link href={item.href} className={styles.navLink}>
                  {item.label}
                </Link>
              }
            />
          </ListItem>
        ))}
        <ListItem disablePadding>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            LinkComponent={Link}
            href="/login"
            sx={{ mt: 2, mx: 2 }}
          >
            Sign In
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            SkillVerse
          </Link>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className={styles.navLink}>
                <Button sx={{ mx: 1, color: 'text.primary' }}>{item.label}</Button>
              </Link>
            ))}
          </Box>

          {/* Right side actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={toggleTheme} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {!isMobile && (
              <>
                <Button variant="outlined" color="primary" LinkComponent={Link} href="/login">
                  Sign In
                </Button>
                <Button variant="contained" color="primary" LinkComponent={Link} href="/signup">
                  Get Started
                </Button>
              </>
            )}

            {isMobile && (
              <IconButton edge="end" color="inherit" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </AppBar>
  );
}