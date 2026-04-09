'use client';

import { useEffect, useRef } from 'react';
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
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '@/styles/FeaturedCourses.module.css';
import Button from '@/components/ui/PlainButton';
import Title from '@/components/ui/Title';


if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    cardsRef.current.forEach((card) => {
      if (card) {
        gsap.set(card, { opacity: 0, y: 40 });
      }
    });

    // ✅ Store trigger in a variable and use arrow function (trigger in scope)
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
    <section ref={sectionRef} className={styles.section} id="courses">
      <Container maxWidth="lg">
       
        <Title title="Featured Courses" highlight="Courses" />

        <Grid container spacing={3}>
          {courses.map((course, index) => (
            <Grid
              key={course.id}
              size={{ xs: 12, sm: 6, md: 3 }}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
            >
              <Card className={styles.card}>
                <CardMedia
                  component="img"
                  image={course.image}
                  alt={course.title}
                  className={styles.cardMedia}
                />
                <CardContent className={styles.cardContent}>
                  <Typography className={styles.cardTitle}>
                    {course.title}
                  </Typography>
                  <Typography className={styles.instructor}>
                    {course.instructor}
                  </Typography>
                  <Box className={styles.rating}>
                    <Rating value={course.rating} precision={0.1} readOnly size="small" />
                    <span>({course.rating})</span>
                  </Box>
                  <Typography className={styles.students}>
                    {course.students.toLocaleString()} students
                  </Typography>
                  <Box className={styles.bottomRow}>
                    <Typography className={styles.price}>${course.price}</Typography>
                    <Link href={`/courses/${course.id}`}>
                      <Button variant="secondary" size="small">
                        View
                      </Button>
                    </Link>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box className={styles.bottomButton}>
          <Link href="/courses">
            <Button variant="primary" size="large">
              View All Courses
            </Button>
          </Link>
        </Box>
      </Container>
    </section>
  );
}