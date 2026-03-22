'use client';

import { Container, Typography, Grid, Card, CardContent } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimelineIcon from '@mui/icons-material/Timeline';
import styles from '@/styles/Benefits.module.css';

const benefits = [
  {
    icon: <SchoolIcon fontSize="large" />,
    title: 'Expert Instructors',
    description: 'Learn from industry professionals with years of real-world experience.',
  },
  {
    icon: <VideoLibraryIcon fontSize="large" />,
    title: 'High-Quality Videos',
    description: 'Crystal clear video lessons with downloadable resources.',
  },
  {
    icon: <AssignmentIcon fontSize="large" />,
    title: 'Hands-On Projects',
    description: 'Build real projects to reinforce your learning.',
  },
  {
    icon: <TimelineIcon fontSize="large" />,
    title: 'Track Progress',
    description: 'Monitor your learning journey with detailed analytics.',
  },
];

export default function Benefits() {
  return (
    <section className={styles.section} id="features">
      <Container maxWidth="lg">

        {/* Title */}
        <Typography variant="h2" className={styles.sectionTitle}>
          Why Choose <span>SkillVerse</span>?
        </Typography>

        {/* Grid */}
        <Grid container spacing={4}>
          {benefits.map((benefit) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={benefit.title} // ✅ FIXED
              display="flex" // ✅ equal height
            >
              <Card className={styles.card} elevation={0} sx={{ width: '100%' }}>
                <CardContent className={styles.cardContent}>

                  <div className={styles.iconWrapper}>
                    {benefit.icon}
                  </div>

                  <Typography className={styles.benefitTitle}>
                    {benefit.title}
                  </Typography>

                  <Typography className={styles.benefitDescription}>
                    {benefit.description}
                  </Typography>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

      </Container>
    </section>
  );
}