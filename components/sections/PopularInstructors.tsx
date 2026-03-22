'use client';

import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Rating
} from '@mui/material';
import { instructors } from '@/data/instructors';
import styles from '@/styles/PopularInstructors.module.css';

export default function PopularInstructors() {
  return (
    <section className={styles.section} id="instructors">
      <Container maxWidth="lg">

        <Typography variant="h2" className={styles.sectionTitle}>
          Popular Instructors
        </Typography>

        <Grid container spacing={3}>
          {instructors.map((instructor) => (
            
            <Grid key={instructor.id} size={{ xs: 12, sm: 6, md: 3 }}>
              
              <Card className={styles.instructorCard}>
                <CardContent>

                  {/* Avatar */}
                  <img
                    src={instructor.avatar}
                    alt={instructor.name}
                    className={styles.avatar}
                  />

                  {/* Name */}
                  <Typography variant="h6" className={styles.name}>
                    {instructor.name}
                  </Typography>

                  {/* Title */}
                  <Typography variant="body2" className={styles.title}>
                    {instructor.title}
                  </Typography>

                  {/* Rating */}
                  <Rating value={instructor.rating} readOnly size="small" />

                  {/* Stats */}
                  <Box className={styles.stats}>
                    
                    <div className={styles.statItem}>
                      <Typography variant="body2" className={styles.statValue}>
                        {instructor.students.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" className={styles.statLabel}>
                        Students
                      </Typography>
                    </div>

                    <div className={styles.statItem}>
                      <Typography variant="body2" className={styles.statValue}>
                        {instructor.courses}
                      </Typography>
                      <Typography variant="caption" className={styles.statLabel}>
                        Courses
                      </Typography>
                    </div>

                  </Box>

                </CardContent>
              </Card>

            </Grid>
          ))}
        </Grid>

      </Container>
    </section>
  );
}