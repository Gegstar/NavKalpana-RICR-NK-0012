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
import { testimonials } from '@/data/testimonials';
import styles from '@/styles/Testimonials.module.css';

export default function Testimonials() {
  return (
    <section className={styles.section}>
      <Container maxWidth="lg">

        <Typography variant="h2" className={styles.sectionTitle}>
          What Our Students Say
        </Typography>

        <Grid container spacing={3}>
          {testimonials.map((testimonial) => (
            
            <Grid key={testimonial.id} size={{ xs: 12, md: 4 }}>
              
              <Card className={styles.testimonialCard}>
                <CardContent>

                  {/* Header */}
                  <Box className={styles.header}>
                    
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className={styles.avatar}
                    />

                    <Box>
                      <Typography variant="subtitle1" className={styles.name}>
                        {testimonial.name}
                      </Typography>

                      <Typography variant="body2" className={styles.role}>
                        {testimonial.role}
                      </Typography>
                    </Box>

                  </Box>

                  {/* Quote */}
                  <Typography variant="body1" className={styles.quote}>
                    "{testimonial.content}"
                  </Typography>

                  {/* Rating */}
                  <Rating
                    value={testimonial.rating}
                    precision={0.5}
                    readOnly
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