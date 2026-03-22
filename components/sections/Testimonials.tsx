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
import styles from '@/styles/Testimonials.module.css';

/* ✅ Dummy Data */
const testimonials = [
  {
    id: 1,
    name: 'Rahul Sharma',
    role: 'Frontend Developer',
    content: 'SkillVerse completely changed my career. The courses are top-notch and easy to follow.',
    rating: 4.8,
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: 2,
    name: 'Anjali Verma',
    role: 'UI/UX Designer',
    content: 'Amazing platform! The instructors explain everything clearly with real-world examples.',
    rating: 4.7,
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 3,
    name: 'Mohit Patel',
    role: 'Full Stack Developer',
    content: 'Best investment I made. I landed a job after completing just 2 courses!',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
];

export default function Testimonials() {
  return (
    <section className={styles.section} id="iestimonials">
      <Container maxWidth="lg">

        <Typography className={styles.sectionTitle}>
          What Our <span>Students </span>Say
        </Typography>

        <Grid container spacing={3}>
          {testimonials.map((testimonial) => (

            <Grid item xs={12} md={4} key={testimonial.id}>

              <Card className={styles.card} elevation={0}>
                <CardContent className={styles.cardContent}>

                  {/* Header */}
                  <Box className={styles.header}>
                    
                    <Avatar
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className={styles.avatar}
                    />

                    <Box>
                      <Typography className={styles.name}>
                        {testimonial.name}
                      </Typography>

                      <Typography className={styles.role}>
                        {testimonial.role}
                      </Typography>
                    </Box>

                  </Box>

                  {/* Quote */}
                  <Typography className={styles.quote}>
                    “{testimonial.content}”
                  </Typography>

                  {/* Rating */}
                  <Rating
                    value={testimonial.rating}
                    precision={0.5}
                    readOnly
                    size="small"
                  />

                </CardContent>
              </Card>

            </Grid>
          ))}
        </Grid>

      </Container>
    </section>
  );
}