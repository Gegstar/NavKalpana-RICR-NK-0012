'use client';

import { Container, Typography, Button, Grid } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="center"
        >
          {/* Left Content */}
          <Grid size={{ xs: 12, sm: 6, md: 6 }} className={styles.heroContent}>
            <Typography variant="h1" className={styles.heroTitle}>
              Learn Without Limits
            </Typography>

            <Typography
              variant="h5"
              color="text.secondary"
              className={styles.heroSubtitle}
              sx={{ mt: 2 }}
            >
              Unlock your potential with SkillVerse. Access 1000+ courses from industry experts and advance your career.
            </Typography>

            <div className={styles.heroButtons} style={{ marginTop: '24px' }}>
              <Button
                component={Link}
                href="/signup"
                variant="contained"
                size="large"
                sx={{ mr: 2 }}
              >
                Get Started Free
              </Button>

              <Button
                component={Link}
                href="/courses"
                variant="outlined"
                size="large"
              >
                Browse Courses
              </Button>
            </div>
          </Grid>

          {/* Right Image */}
          <Grid size={{ xs: 12, sm: 6, md: 6 }} className={styles.heroImageColumn}>
            <div
              className={styles.heroImageWrapper}
              style={{ position: 'relative', width: '100%', height: '400px' }}
            >
              <Image
                src="/images/hero-illustration.svg"
                alt="Learning illustration"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
}