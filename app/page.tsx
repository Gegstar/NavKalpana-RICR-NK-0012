'use client';
import Hero from '@/components/sections/Hero';
import FeaturedCourses from '@/components/sections/FeaturedCourses';
import PopularInstructors from '@/components/sections/PopularInstructors';
import Benefits from '@/components/sections/Benefits';
import Testimonials from '@/components/sections/Testimonials';
import CTA from '@/components/sections/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Benefits />
      <FeaturedCourses />
      <PopularInstructors />
      <Testimonials />
      <CTA />
    </>
  );
}