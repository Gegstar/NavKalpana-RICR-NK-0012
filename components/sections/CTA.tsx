'use client';

import { Container, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import styles from '@/styles/CTA.module.css';

export default function CTA() {
  return (
    <section className={styles.section}>
      <Container maxWidth="md">

        <Box className={styles.content}>
          
          <Typography className={styles.title}>
            Ready to Start <span>Learning?</span>
          </Typography>

          <Typography className={styles.subtitle}>
            Join thousands of learners and upgrade your skills today.
          </Typography>

          <Box className={styles.buttons}>
            
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/signup"
              className={styles.primaryBtn}
            >
              Sign Up for Free
            </Button>

            <Button
              variant="outlined"
              size="large"
              component={Link}
              href="/courses"
              className={styles.secondaryBtn}
            >
              Browse Courses
            </Button>

          </Box>

        </Box>

      </Container>
    </section>
  );
}