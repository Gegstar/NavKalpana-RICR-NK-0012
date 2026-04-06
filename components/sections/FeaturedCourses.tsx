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
} from '@mui/material';
import Link from 'next/link';
import styles from '@/styles/FeaturedCourses.module.css';
import Button from '@/components/ui/Button';

/* ✅ Dummy Course Data */
const courses = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp',
    instructor: 'John Doe',
    rating: 4.8,
    students: 12500,
    price: 49,
    image: '/images/web-dev.svg',
  },
  {
    id: 2,
    title: 'React & Next.js Mastery',
    instructor: 'Jane Smith',
    rating: 4.7,
    students: 9800,
    price: 59,
    image: '/images/react.svg',
  },
  {
    id: 3,
    title: 'Python for Beginners',
    instructor: 'Alex Johnson',
    rating: 4.6,
    students: 15000,
    price: 39,
    image: '/images/python.svg',
  },
  {
    id: 4,
    title: 'UI/UX Design Fundamentals',
    instructor: 'Emily Davis',
    rating: 4.5,
    students: 8700,
    price: 29,
    image: '/images/uiux.svg',
  },
];

export default function FeaturedCourses() {
  return (
    <section className={styles.section} id="courses">
      <Container maxWidth="lg">

        <Typography variant="h2" className={styles.sectionTitle}>
          Featured <span>Courses</span>
        </Typography>

        <Grid container spacing={3}>
          {courses.map((course) => (
            
            <Grid key={course.id} size={{ xs: 12, sm: 6, md: 3 }}>
              
              <Card className={styles.card}>
                
                {/* Image */}
                <CardMedia
                  component="img"
                  image={course.image}
                  alt={course.title}
                  className={styles.cardMedia}
                />

                {/* Content */}
                <CardContent className={styles.cardContent}>
                  
                  <Typography className={styles.cardTitle}>
                    {course.title}
                  </Typography>

                  <Typography className={styles.instructor}>
                    {course.instructor}
                  </Typography>

                  <Box className={styles.rating}>
                    <Rating
                      value={course.rating}
                      precision={0.1}
                      readOnly
                      size="small"
                    />
                    <span>({course.rating})</span>
                  </Box>

                  <Typography className={styles.students}>
                    {course.students.toLocaleString()} students
                  </Typography>

                  <Box className={styles.bottomRow}>
                    <Typography className={styles.price}>
                      ${course.price}
                    </Typography>

                    <Link href={`/courses/${course.id}`}>
                      <Button variant="outlined" size="small">
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
        <Box className={styles.bottomButton}>
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