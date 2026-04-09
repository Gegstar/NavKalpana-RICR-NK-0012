'use client';

import { useEffect, useRef } from 'react';
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
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '@/styles/Testimonials.module.css';
import Title from '@/components/ui/Title'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

 useEffect(() => {
  if (!sectionRef.current) return;

  // Set initial state – hidden
  cardsRef.current.forEach((card) => {
    if (card) {
      gsap.set(card, { opacity: 0, y: 40 });
    }
  });

  let trigger: ScrollTrigger | null = null;
  trigger = ScrollTrigger.create({
    trigger: sectionRef.current,
    start: 'top 80%',
    onEnter: () => {
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: index * 0.15,
          });
        }
      });
      if (trigger) trigger.kill();
    },
  });

  return () => {
    if (trigger) trigger.kill();
  };
}, []);

  return (
    <section ref={sectionRef} className={styles.section} id="testimonials">
      <Container maxWidth="lg">
        <Title title=" What Our Students Say" highlight="Students" />
        
        <Grid container spacing={3}>
          {testimonials.map((testimonial, index) => (
            <Grid
              key={testimonial.id}
              size={{ xs: 12, md: 4 }}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
            >
              <Card className={styles.card} elevation={0} sx={{ height: '100%' }}>
                <CardContent className={styles.cardContent}>
                  <Box className={styles.header}>
                    <Avatar
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className={styles.avatar}
                    />
                    <Box>
                      <Typography className={styles.name}>{testimonial.name}</Typography>
                      <Typography className={styles.role}>{testimonial.role}</Typography>
                    </Box>
                  </Box>
                  <Typography className={styles.quote}>“{testimonial.content}”</Typography>
                  <Rating value={testimonial.rating} precision={0.5} readOnly size="small" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </section>
  );
}