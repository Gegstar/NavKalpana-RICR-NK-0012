'use client';
import { Container, Typography, Button } from '@mui/material';
import Link from 'next/link';
import styles from '@/styles/CTA.module.css';

export default function CTA() {
  return (
    <section className={styles.section}>
      <Container maxWidth="md">
        <Typography variant="h2" className={styles.title}>
          Ready to Start Learning?
        </Typography>
        <Typography variant="h6" className={styles.subtitle}>
          Join thousands of learners and upgrade your skills today.
        </Typography>
        <div className={styles.buttons}>
          <Button
            variant="contained"
            size="large"
            sx={{ backgroundColor: 'white', color: '#4F46E5', '&:hover': { backgroundColor: '#f3f4f6' } }}
            component={Link}
            href="/signup"
          >
            Sign Up for Free
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: '#f3f4f6', backgroundColor: 'rgba(255,255,255,0.1)' } }}
            component={Link}
            href="/courses"
          >
            Browse Courses
          </Button>
        </div>
      </Container>
    </section>
  );
}