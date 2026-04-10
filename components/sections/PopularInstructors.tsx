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
import styles from '@/styles/PopularInstructors.module.css';
import Title from '@/components/ui/Title'

// Register ScrollTrigger only on client
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Set initial state – hidden and shifted down
    cardsRef.current.forEach((card) => {
      if (card) {
        gsap.set(card, { opacity: 0, y: 40 });
      }
    });

    // Create ScrollTrigger
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
          delay: index * 0.1,
        });
      }
    });
    if (trigger) trigger.kill();
  },
});

    // Cleanup
    return () => {
      if (trigger) trigger.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} id="instructors">
      <Container maxWidth="lg">
        <Title title="Popular Instructors" highlight="Instructors" />

        <Grid container spacing={3}>
          {instructors.map((instructor, index) => (
            <Grid
              key={instructor.id}
              size={{ xs: 12, sm: 6, md: 3 }}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
            >
              <Card className={styles.card} elevation={0} sx={{ height: '100%' }}>
                <CardContent className={styles.cardContent}>
                  <Avatar
                    src={instructor.avatar}
                    alt={instructor.name}
                    className={styles.avatar}
                  />
                  <Typography className={styles.name}>{instructor.name}</Typography>
                  <Typography className={styles.title}>{instructor.title}</Typography>
                  <Rating value={instructor.rating} readOnly size="small" />
                  <Box className={styles.stats}>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>
                        {instructor.students.toLocaleString()}
                      </span>
                      <span className={styles.statLabel}>Students</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{instructor.courses}</span>
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
