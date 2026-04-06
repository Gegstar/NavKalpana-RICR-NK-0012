'use client';

import { Container, Typography, Box, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid'; 

import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import Link from 'next/link';
import styles from '@/styles/Footer.module.css';
import Logo from '@/components/ui/Logo';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Container maxWidth="lg">

        <Grid container spacing={4}>

          {/* LEFT */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Logo variant="text" size="large" />

            <Typography variant="body2" color="text.secondary">
              Empowering learners worldwide with cutting-edge courses.
            </Typography>

            <Box sx={{ mt: 2 }}>
              <IconButton className={styles.socialIcon}><FacebookIcon /></IconButton>
              <IconButton className={styles.socialIcon}><TwitterIcon /></IconButton>
              <IconButton className={styles.socialIcon}><LinkedInIcon /></IconButton>
              <IconButton className={styles.socialIcon}><InstagramIcon /></IconButton>
            </Box>
          </Grid>

          {/* COMPANY */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography color="white">Company</Typography>
            <Link href="/about" className={styles.link}>About</Link>
            <br />
            <Link href="/careers" className={styles.link}>Careers</Link>
          </Grid>

          {/* SUPPORT */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography color="white">Support</Typography>
            <Link href="/help" className={styles.link}>Help</Link>
            <br />
            <Link href="/faq" className={styles.link}>FAQ</Link>
          </Grid>

          {/* LEGAL */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography color="white">Legal</Typography>
            <Link href="/privacy" className={styles.link}>Privacy</Link>
            <br />
            <Link href="/terms" className={styles.link}>Terms</Link>
          </Grid>

          {/* CONTACT */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography color="white">Contact</Typography>
            <Typography variant="body2">hello@skillverse.com</Typography>
            <Typography variant="body2">+1 (555) 123-4567</Typography>
          </Grid>

        </Grid>

        <Box className={styles.footerBottom}>
          <Typography variant="body2">
            © {new Date().getFullYear()} SkillVerse
          </Typography>
        </Box>

      </Container>
    </footer>
  );
}