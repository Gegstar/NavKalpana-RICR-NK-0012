"use client";

import React, { useRef } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { BookOpen, ChevronRight, Play, ChevronLeft } from "lucide-react";
import styles from "@/styles/EnrolledCourses.module.css";

interface Course {
  id: number;
  title: string;
  course_image?: string;
  instructor?: string;
  progress?: number;
}

interface EnrolledCoursesProps {
  courses: Course[];
  onViewAll?: () => void;
  onContinue?: (courseId: number) => void;
}

export default function EnrolledCourses({
  courses,
  onViewAll,
  onContinue,
}: EnrolledCoursesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.querySelector(`.${styles.courseCard}`)?.clientWidth || 300;
      const scrollAmount = cardWidth + 16; // card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box component="section" className={styles.section}>
      <Box className={styles.sectionHeader}>
        <Box className={styles.headerLeft}>
          <BookOpen size={24} className={styles.headerIcon} />
          <Typography component="h2" className={styles.headerTitle}>
            My Courses
          </Typography>
        </Box>
        <Box className={styles.headerActions}>
          <IconButton
            onClick={() => scroll("left")}
            className={styles.scrollButton}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </IconButton>
          <IconButton
            onClick={() => scroll("right")}
            className={styles.scrollButton}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </IconButton>
          <Button className={styles.viewAllButton} onClick={onViewAll}>
            View all courses
          </Button>
        </Box>
      </Box>

      <Box className={styles.coursesGrid} ref={scrollContainerRef}>
        {courses.length > 0 ? (
          courses.slice(0, 10).map((course) => (
            <Box key={course.id} className={styles.courseCard}>
              <Box className={styles.courseInfo}>
                <h4>{course.title}</h4>
                <p>by {course.instructor || "University Faculty"}</p>
              </Box>

              <Box className={styles.progressWrapper}>
                <Box className={styles.progressLabel}>
                  <span>Course Progress</span>
                  <span>{course.progress || 0}%</span>
                </Box>
                <Box className={styles.progressBarRoot}>
                  <Box
                    className={styles.progressFill}
                    style={{ width: `${course.progress || 0}%` }}
                  />
                </Box>
              </Box>

              <Box className={styles.courseFooter}>
                <Button
                  className={styles.continueBtn}
                  onClick={() => onContinue?.(course.id)}
                >
                  <Play size={14} fill="currentColor" />
                  Continue
                </Button>
                <ChevronRight size={18} className={styles.arrowIcon} />
              </Box>
            </Box>
          ))
        ) : (
          <Box className={styles.emptyState}>
            No active courses found. Start learning today!
          </Box>
        )}
      </Box>
    </Box>
  );
}