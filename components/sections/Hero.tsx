'use client';
import { Container, Grid, Typography, Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Container maxWidth="lg">
        {/* Grid container with flex properties */}
        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="center"
          className={styles.heroGrid} // optional additional styling
        >
          {/* Left column: text content */}
          <Grid item xs={12} md={6} className={styles.heroContent}>
            <Typography variant="h1" className={styles.heroTitle}>
              Learn Without Limits
            </Typography>
            <Typography variant="h5" color="text.secondary" className={styles.heroSubtitle}>
              Unlock your potential with SkillVerse. Access 1000+ courses from industry experts and advance your career.
            </Typography>
            <div className={styles.heroButtons}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={Link}
                href="/signup"
              >
                Get Started Free
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                component={Link}
                href="/courses"
              >
                Browse Courses
              </Button>
            </div>
          </Grid>

          {/* Right column: image */}
          <Grid item xs={12} md={6} className={styles.heroImageColumn}>
            <div className={styles.heroImageWrapper}>
              <Image
                src="/images/hero-illustration.svg"
                alt="Learning illustration"
                width={600}
                height={400}
                priority
                className={styles.heroImage}
              />
            </div>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
}