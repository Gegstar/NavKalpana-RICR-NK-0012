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
import Link from 'next/link';
import styles from '@/styles/Navbar.module.css';
import Logo from '@/components/ui/Logo'; 

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '#features' },
  { label: 'Courses', href: '#courses' },
  { label: 'Instructors', href: '#instructors' },
  { label: 'Testimonials', href: '#iestimonials'}

];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', width: 250 }}>
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
        <ListItem disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2, mt: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            LinkComponent={Link}
            href="/auth/student_login"
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            LinkComponent={Link}
            href="/auth/student_signup"
          >
            Get Started
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
          <Logo variant="full" size="medium" />

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className={styles.navLink} style={{ textDecoration: 'none' }}>
                <Button sx={{ mx: 1, color: 'text.primary' }}>{item.label}</Button>
              </Link>
            ))}
          </Box>

          {/* Right side actions */}
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
              <IconButton edge="end" color="inherit" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle} className={styles.drawer}>
        {drawer}
      </Drawer>
    </AppBar>
  );
}