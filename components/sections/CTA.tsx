'use client';

import { useEffect, useRef } from 'react';
import { Container, Typography, Box } from '@mui/material';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import PlainButton from '@/components/ui/PlainButton';
import styles from '@/styles/CTA.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      posArray[i*3] = (Math.random() - 0.5) * 20;
      posArray[i*3+1] = (Math.random() - 0.5) * 10;
      posArray[i*3+2] = (Math.random() - 0.5) * 15 - 5;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, transparent: true, opacity: 0.3 });
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
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  // GSAP entrance animation
  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;
    gsap.set(contentRef.current, { opacity: 0, y: 40 });
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(contentRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        trigger.kill();
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={canvasContainerRef} className={styles.canvasContainer} />
      <Container maxWidth="md" className={styles.container}>
        <Box ref={contentRef} className={styles.content}>
          <Typography className={styles.title}>
            Ready to Start <span>Learning?</span>
          </Typography>
          
          <Typography className={styles.subtitle}>
            Join thousands of learners and upgrade your skills today.
          </Typography>
          <Box className={styles.buttons}>
            <PlainButton variant="primary" size="large" href="/signup">
              Sign Up for Free
            </PlainButton>
            <PlainButton variant="secondary" size="large" href="/courses">
              Browse Courses
            </PlainButton>
          </Box>
        </Box>
      </Container>
    </section>
  );
}