'use client';
import { Container, Grid, Typography, Box, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import Link from 'next/link';
import styles from '@/styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Container maxWidth="lg">

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              SkillVerse
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Empowering learners worldwide with cutting-edge courses and expert instructors.
            </Typography>

            <Box sx={{ mt: 2 }}>
              <IconButton className={styles.socialIcon}>
                <FacebookIcon />
              </IconButton>
              <IconButton className={styles.socialIcon}>
                <TwitterIcon />
              </IconButton>
              <IconButton className={styles.socialIcon}>
                <LinkedInIcon />
              </IconButton>
              <IconButton className={styles.socialIcon}>
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" color="white" gutterBottom>
              Company
            </Typography>

            <Box><Link href="/about" className={styles.link}>About</Link></Box>
            <Box><Link href="/careers" className={styles.link}>Careers</Link></Box>
            <Box><Link href="/blog" className={styles.link}>Blog</Link></Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" color="white" gutterBottom>
              Support
            </Typography>

            <Box><Link href="/help" className={styles.link}>Help Center</Link></Box>
            <Box><Link href="/contact" className={styles.link}>Contact</Link></Box>
            <Box><Link href="/faq" className={styles.link}>FAQ</Link></Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" color="white" gutterBottom>
              Legal
            </Typography>

            <Box><Link href="/privacy" className={styles.link}>Privacy Policy</Link></Box>
            <Box><Link href="/terms" className={styles.link}>Terms of Service</Link></Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" color="white" gutterBottom>
              Contact
            </Typography>

            <Typography variant="body2" color="text.secondary">
              hello@skillverse.com
            </Typography>

            <Typography variant="body2" color="text.secondary">
              +1 (555) 123-4567
            </Typography>
          </Grid>

        </Grid>
        <Box sx={{ textAlign: 'center', pt: 4, mt: 4, borderTop: '1px solid #374151' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} SkillVerse. All rights reserved.
          </Typography>
        </Box>

      </Container>
    </footer>
  );
}