'use client';
import { useState, useEffect, useRef } from 'react';
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
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import gsap from 'gsap';
import styles from '@/styles/Navbar.module.css';
import Logo from '@/components/ui/Logo';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '#features' },
  { label: 'Courses', href: '#courses' },
  { label: 'Instructors', href: '#instructors' },
  { label: 'Testimonials', href: '#testimonials' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const navbarRef = useRef<HTMLElement>(null);

  // GSAP entrance animation
  useEffect(() => {
    if (navbarRef.current) {
      gsap.fromTo(navbarRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  // Smooth scroll with offset for anchor links
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const navbarHeight = 80; // approximate height of fixed navbar
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - navbarHeight;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

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

  // GSAP animation for drawer (optional)
  useEffect(() => {
    if (mobileOpen) {
      gsap.fromTo('.drawer-content', { x: '100%' }, { x: 0, duration: 0.3, ease: 'power2.out' });
    }
  }, [mobileOpen]);

  const drawer = (
    <Box className="drawer-content" sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={handleDrawerToggle} className={styles.closeDrawerBtn}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ flex: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemText
              primary={
                <Link
                  href={item.href}
                  className={styles.navLink}
                  onClick={(e) => {
                    handleDrawerToggle();
                    if (item.href.startsWith('#')) {
                      handleSmoothScroll(e as any, item.href);
                    }
                  }}
                >
                  {item.label}
                </Link>
              }
              sx={{ textAlign: 'center' }}
            />
          </ListItem>
        ))}
        <ListItem disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3, px: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            LinkComponent={Link}
            href="/auth/student_login"
            onClick={handleDrawerToggle}
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            LinkComponent={Link}
            href="/auth/student_signup"
            onClick={handleDrawerToggle}
          >
            Get Started
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      ref={navbarRef}
      position="fixed"
      color="transparent"
      elevation={0}
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Logo variant="full" size="medium" />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={styles.navLink}
                style={{ textDecoration: 'none' }}
                onClick={(e) => handleSmoothScroll(e, item.href)}
              >
                <Button sx={{ mx: 1, color: 'text.primary' }}>{item.label}</Button>
              </Link>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  LinkComponent={Link}
                  href="/auth/student_login"
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  LinkComponent={Link}
                  href="/auth/student_signup"
                >
                  Get Started
                </Button>
              </>
            )}
            {isMobile && (
              <IconButton edge="end" color="inherit" onClick={handleDrawerToggle} sx={{ ml: 1 }}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </AppBar>
  );
}