'use client';

import { useEffect, useRef } from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import * as THREE from 'three';
import Button from '@/components/ui/PlainButton';
import styles from '@/styles/Hero.module.css';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Three.js particle background
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      posArray[i*3] = (Math.random() - 0.5) * 20;
      posArray[i*3+1] = (Math.random() - 0.5) * 15;
      posArray[i*3+2] = (Math.random() - 0.5) * 10 - 5;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x3B82F6,
      transparent: true,
      opacity: 0.4,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 8;
    camera.position.y = 1;
    camera.lookAt(0, 0, 0);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.002;
      particlesMesh.rotation.y = time * 0.2;
      particlesMesh.rotation.x = Math.sin(time * 0.1) * 0.2;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // GSAP entrance animation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const elements = [titleRef.current, subtitleRef.current, buttonsRef.current, statsRef.current].filter(Boolean);
    if (elements.length === 0) return;

    gsap.set(elements, { opacity: 0, y: 30 });
    if (imageRef.current) gsap.set(imageRef.current, { opacity: 0, scale: 0.95 });

    const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } });
    tl.to(titleRef.current, { opacity: 1, y: 0, delay: 0.2 })
      .to(subtitleRef.current, { opacity: 1, y: 0 }, '-=0.4')
      .to(buttonsRef.current, { opacity: 1, y: 0 }, '-=0.3')
      .to(statsRef.current, { opacity: 1, y: 0 }, '-=0.2')
      .to(imageRef.current, { opacity: 1, scale: 1 }, '-=0.6');

    return () => {
  tl.kill();
};
  }, []);

  return (
    <section ref={heroRef} className={styles.hero}>
      <div ref={canvasContainerRef} className={styles.canvasContainer} />
      <div className={styles.bgGlow} />

      <Container maxWidth="lg" className={styles.container}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }} className={styles.content}>
            <Typography ref={titleRef} variant="h1" className={styles.title}>
              Learn Without <span className={styles.gradientText}>Limits</span>
            </Typography>
            <Typography ref={subtitleRef} variant="h5" className={styles.subtitle}>
              Unlock your potential with SkillVerse. Access 1000+ courses from industry experts and advance your career.
            </Typography>
            <div ref={buttonsRef} className={styles.buttonGroup}>
              <Button href="/signup" variant="primary" size="large">
                Get Started Free
              </Button>
              <Button href="/courses" variant="secondary" size="large">
                Browse Courses
              </Button>
            </div>
            <div ref={statsRef} className={styles.stats}>
              <div><Typography variant="h4">1000+</Typography><Typography variant="body2">Courses</Typography></div>
              <div><Typography variant="h4">50K+</Typography><Typography variant="body2">Students</Typography></div>
              <div><Typography variant="h4">200+</Typography><Typography variant="body2">Experts</Typography></div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} className={styles.content}>
            <div ref={imageRef} className={styles.imageContainer}>
              <Image src="/images/hero-illustration.svg" alt="Learning illustration" fill priority className={styles.image} />
            </div>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
}
