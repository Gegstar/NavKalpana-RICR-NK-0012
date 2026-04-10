'use client';

import { useEffect, useRef } from 'react';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimelineIcon from '@mui/icons-material/Timeline';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '@/styles/Benefits.module.css';
import Title from '@/components/ui/Title';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

useEffect(() => {
  if (!sectionRef.current) return;

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
      if (trigger) trigger.kill(); // ✅ trigger is in scope
    },
  });

  return () => {
    if (trigger) trigger.kill();
  };
}, []);

  return (
    <section ref={sectionRef} className={styles.section} id="features">
      <Container maxWidth="lg">
        <Title title="Why Choose SkillVerse?" highlight="SkillVerse" />

        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid
              key={benefit.title}
              size={{ xs: 12, sm: 6, md: 3 }}
              display="flex"
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
            >
              <Card className={styles.card} elevation={0} sx={{ width: '100%' }}>
                <CardContent className={styles.cardContent}>
                  <div className={styles.iconWrapper}>{benefit.icon}</div>
                  <Typography className={styles.benefitTitle}>{benefit.title}</Typography>
                  <Typography className={styles.benefitDescription}>{benefit.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
