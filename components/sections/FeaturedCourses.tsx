'use client';

import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
  Rating,
  Button
} from '@mui/material';
import Link from 'next/link';
import { courses } from '@/data/courses';
import styles from '@/styles/FeaturedCourses.module.css';

export default function FeaturedCourses() {
  return (
    <section className={styles.section}>
      <Container maxWidth="lg">

        <Typography variant="h2" className={styles.sectionTitle}>
          Featured Courses
        </Typography>

        <Grid container spacing={3}>
          {courses.slice(0, 4).map((course) => (
            
            <Grid key={course.id} size={{ xs: 12, sm: 6, md: 3 }}>
              
              <Card className={styles.card}>
                
                <CardMedia
                  className={styles.cardMedia}
                  image={course.image}
                  title={course.title}
                />

                <CardContent className={styles.cardContent}>
                  
                  <Typography variant="h6" className={styles.cardTitle}>
                    {course.title}
                  </Typography>

                  <Typography variant="body2" className={styles.instructor}>
                    {course.instructor}
                  </Typography>

                  <Box className={styles.rating}>
                    <Rating
                      value={course.rating}
                      precision={0.1}
                      readOnly
                      size="small"
                    />
                    <Typography variant="body2">
                      ({course.rating})
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {course.students.toLocaleString()} students
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 2
                    }}
                  >
                    <Typography variant="h6" className={styles.price}>
                      ${course.price}
                    </Typography>

                    <Link href={`/courses/${course.id}`}>
                      <Button size="small" variant="outlined">
                        View
                      </Button>
                    </Link>
                  </Box>

                </CardContent>
              </Card>

            </Grid>
          ))}
        </Grid>

        {/* Bottom Button */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Link href="/courses">
            <Button variant="contained" size="large">
              View All Courses
            </Button>
          </Link>
        </Box>

      </Container>
    </section>
  );
}