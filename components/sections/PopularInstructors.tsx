'use client';

import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Rating,
  Avatar
} from '@mui/material';
import styles from '@/styles/PopularInstructors.module.css';

/* ✅ Dummy Data */
const instructors = [
  {
    id: 1,
    name: 'John Doe',
    title: 'Full Stack Developer',
    rating: 4.8,
    students: 12000,
    courses: 12,
    avatar: '/images/instructors/inst1.jpg',
  },
  {
    id: 2,
    name: 'Sarah Khan',
    title: 'UI/UX Designer',
    rating: 4.7,
    students: 9800,
    courses: 8,
    avatar: '/images/instructors/inst2.jpg',
  },
  {
    id: 3,
    name: 'Amit Sharma',
    title: 'Python Expert',
    rating: 4.9,
    students: 15000,
    courses: 15,
    avatar: '/images/instructors/inst3.jpg',
  },
  {
    id: 4,
    name: 'Emily Davis',
    title: 'React Specialist',
    rating: 4.6,
    students: 8700,
    courses: 10,
    avatar: '/images/instructors/inst4.jpg',
  },
];

export default function PopularInstructors() {
  return (
    <section className={styles.section} id="instructors">
      <Container maxWidth="lg">

        <Typography variant="h2" className={styles.sectionTitle}>
          Popular <span>Instructors</span>
        </Typography>

        <Grid container spacing={3}>
          {instructors.map((instructor) => (
            
            <Grid item xs={12} sm={6} md={3} key={instructor.id}>
              
              <Card className={styles.card} elevation={0}>
                <CardContent className={styles.cardContent}>

                  {/* Avatar */}
                  <Avatar
                    src={instructor.avatar}
                    alt={instructor.name}
                    className={styles.avatar}
                  />

                  {/* Name */}
                  <Typography className={styles.name}>
                    {instructor.name}
                  </Typography>

                  {/* Title */}
                  <Typography className={styles.title}>
                    {instructor.title}
                  </Typography>

                  {/* Rating */}
                  <Rating value={instructor.rating} readOnly size="small" />

                  {/* Stats */}
                  <Box className={styles.stats}>
                    
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>
                        {instructor.students.toLocaleString()}
                      </span>
                      <span className={styles.statLabel}>Students</span>
                    </div>

                    <div className={styles.statItem}>
                      <span className={styles.statValue}>
                        {instructor.courses}
                      </span>
                      <span className={styles.statLabel}>Courses</span>
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