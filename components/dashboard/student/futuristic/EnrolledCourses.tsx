"use client";

import React from "react";
import { BookOpen, ChevronRight, Play } from "lucide-react";
import styles from "@/styles/StudentDashboard.module.css";

interface Course {
  id: number;
  title: string;
  course_image?: string;
  instructor?: string;
  progress?: number;
}

interface EnrolledCoursesProps {
  courses: Course[];
}

export default function EnrolledCourses({ courses }: EnrolledCoursesProps) {
  return (
    <section className={styles.coursesSection}>
      <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BookOpen size={24} color="var(--primary-yellow)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>My Courses</h2>
        </div>
        <button style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
          View all courses
        </button>
      </div>

      <div className={styles.bentoGrid}>
        {courses.length > 0 ? (
          courses.slice(0, 3).map((course) => (
            <div key={course.id} className={styles.courseCard}>
              <div className={styles.courseInfo}>
                <h4>{course.title}</h4>
                <p>by {course.instructor || "University Faculty"}</p>
              </div>

              <div className={styles.progressWrapper}>
                <div className={styles.progressLabel}>
                  <span>Course Progress</span>
                  <span>{course.progress || 0}%</span>
                </div>
                <div className={styles.progressBarRoot}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${course.progress || 0}%` }}
                  />
                </div>
              </div>

              <div className={styles.courseFooter}>
                <button className={styles.continueBtn}>
                  <Play size={14} fill="currentColor" />
                  Continue
                </button>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', width: '100%' }}>
            No active courses found. Start learning today!
          </div>
        )}
      </div>
    </section>
  );
}
