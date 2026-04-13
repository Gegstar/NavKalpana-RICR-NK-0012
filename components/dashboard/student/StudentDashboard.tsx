"use client";

import React, { useState, useEffect } from "react";
import { PlayCircle } from "lucide-react";

// Modular Components
import GreetingHeader from "./futuristic/GreetingHeader";
import ScoreCard from "./futuristic/ScoreCard";
import AssignmentProgress from "./futuristic/AssignmentProgress";
import StreakWidget from "./futuristic/StreakWidget";
import DeadlineList from "./futuristic/DeadlineList";
import EnrolledCourses from "./futuristic/EnrolledCourses";
import ActivityHeatmap from "./futuristic/ActivityHeatmap";
import JobBoard from "./futuristic/JobBoard";
import AlumniNetwork from "./futuristic/AlumniNetwork";
import RightSidePanel from "./futuristic/RightSidePanel";
import ActivityBarChart from "./futuristic/ActivityBarChart";

// Styles
import styles from "@/styles/StudentDashboard.module.css";

// --- REALISTIC DUMMY DATA ---
const STUB_DATA = {
  profile: {
    name: "Alex Thompson",
    role: "Data Science Student",
    avatar: "https://i.pravatar.cc/150?u=alex",
    email: "alex.thompson@university.com",
    academicScore: 92,
    performanceTrend: "+8%",
    streak: 14,
    skills: ["Python", "React", "TensorFlow", "SQL", "UI Design"]
  },
  dashboard: {
    assignments: { completed: 8, total: 12 },
    learningStreak: 14,
    academicScore: 92,
    weeklyActivity: Array.from({ length: 7 }, (_, i) => Math.floor(Math.random() * 100)),
    recentAssignments: [
      { id: 1, title: "Neural Networks Overview", displayTitle: "Neural Networks", dueDate: "Due Today", urgency: "critical" as const },
      { id: 2, title: "Database Normalization", displayTitle: "SQL Mastery", dueDate: "Due Tomorrow", urgency: "high" as const },
      { id: 3, title: "Next.js 14 Fundamentals", displayTitle: "Frontend Mastery", dueDate: "Due Apr 16", urgency: "medium" as const },
      { id: 4, title: "Statistical Analysis Report", displayTitle: "Stats Report", dueDate: "Due Apr 19", urgency: "low" as const },
      { id: 5, title: "UI/UX Design Project", displayTitle: "Design Project", dueDate: "Due Apr 22", urgency: "low" as const }
    ],
    jobPosts: [
      { id: 1, title: "Frontend Developer", company: { name: "TechNova Solutions" }, location: "Remote", type: "Full-time", salary: "$70k - $90k" },
      { id: 2, title: "UI/UX Intern", company: { name: "Creative Pulse" }, location: "San Francisco", type: "Internship", salary: "$3k/mo" },
      { id: 3, title: "Full Stack Engineer", company: { name: "CloudScale Systems" }, location: "New York, NY", type: "Full-time", salary: "$110k - $140k" },
      { id: 4, title: "Data Analyst", company: { name: "Insight Metrics" }, location: "Austin, TX", type: "Contract", salary: "$55/hr" },
      { id: 5, title: "Mobile App Architect", company: { name: "AppForge Labs" }, location: "Remote", type: "Full-time", salary: "$130k - $160k" },
      { id: 6, title: "Security Specialist", company: { name: "Shield Systems" }, location: "London, UK", type: "Full-time", salary: "£60k - £85k" }
    ],
    alumni: [
      { id: 1, name: "Sarah Jenkins", position: "Senior Dev @ Google", batch: "2022", avatar: "https://i.pravatar.cc/150?u=sarah" },
      { id: 2, name: "David Chen", position: "Product Designer @ Meta", batch: "2023", avatar: "https://i.pravatar.cc/150?u=david" },
      { id: 3, name: "Elena Rodriguez", position: "Founder @ AI-Labs", batch: "2021", avatar: "https://i.pravatar.cc/150?u=elena" },
      { id: 4, name: "James Wilson", position: "Data Scientist @ Netlify", batch: "2019", avatar: "https://i.pravatar.cc/150?u=james" },
      { id: 5, name: "Sophia Lee", position: "UX Researcher @ Uber", batch: "2020", avatar: "https://i.pravatar.cc/150?u=sophia" },
      { id: 6, name: "Uttam turkar", }
    ],
    topPerformers: [
      { name: "John Doe", score: 4500 },
      { name: "Jane Smith", score: 4200 },
      { name: "Mike Johnson", score: 3900 }
    ]
  },
  courses: [
    { id: 1, title: "Advanced Data Visualization", instructor: "Dr. Robert Fox", progress: 85 },
    { id: 2, title: "Machine Learning with Python", instructor: "Prof. Linda Blair", progress: 42 },
    { id: 3, title: "Strategic Management", instructor: "Prof. Linda Blair", progress: 15 },
    { id: 4, title: "Strategic Management", instructor: "Prof. Linda Blair", progress: 15}
  ]
};

const DashboardSkeleton = () => (
  <div className={styles.loadingState}>
    <div className={`${styles.skeleton} ${styles.skeletonHeader}`} style={{ width: '300px', marginBottom: '2rem' }} />
    
    <div className={styles.bentoGrid}>
      {[1, 2, 3].map(i => (
        <div key={i} className={`${styles.skeleton} ${styles.skeletonCard}`} />
      ))}
    </div>

    <div className={`${styles.skeleton} ${styles.skeletonHero}`} />

    <div className={`${styles.skeleton}`} style={{ height: '180px', borderRadius: '12px', marginBottom: '2rem' }} />

    <div className={styles.middleRow}>
      <div className={`${styles.skeleton}`} style={{ height: '300px', borderRadius: '12px' }} />
      <div className={`${styles.skeleton}`} style={{ height: '300px', borderRadius: '12px' }} />
    </div>
  </div>
);

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // 1.5s for skeleton demo
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <DashboardSkeleton />;

  const { profile, dashboard, courses } = STUB_DATA;

  return (
    <div className={styles.dashboardWrapper}>
      <main className={styles.mainContent}>
        {/* --- 1. Header Section --- */}
        <GreetingHeader name={profile.name} avatar={profile.avatar} />

        {/* --- 2. Bento Grid Stats --- */}
        <div className={styles.bentoGrid}>
          <div className={styles.bentoCard}>
            <ScoreCard score={dashboard.academicScore} trend={profile.performanceTrend} />
          </div>
          <div className={styles.bentoCard}>
            <StreakWidget days={dashboard.learningStreak} />
          </div>
          <div className={styles.bentoCard}>
            <AssignmentProgress completed={dashboard.assignments.completed} total={dashboard.assignments.total} />
          </div>
        </div>

        {/* --- 3. Continue Learning Hero --- */}
        <section className={styles.continueSection}>
          <div className={styles.continueCard}>
            <div className={styles.continueCardContent}>
              <span className={styles.resumeTag}>RESUME</span>
              <h2>{courses[0].title}</h2>
              <p className={styles.subText}>Module 4: Advanced Predictive Modeling • Dr. Robert Fox</p>
              <button className={styles.viewCourseBtn}>
                <PlayCircle size={20} fill="currentColor" />
                Continue Lesson
              </button>
            </div>
            <div className={styles.bgDecoration}>
              <PlayCircle size={260} />
            </div>
          </div>
        </section>

        {/* --- 4. Activity Heatmap --- */}
        <div className={styles.heatmapSection}>
           <ActivityHeatmap activityData={dashboard.weeklyActivity} />
        </div>

        {/* --- 5. Middle Row --- */}
        <div className={styles.middleRow}>
          <div className={styles.activitySection}>
            <DeadlineList deadlines={dashboard.recentAssignments} />
          </div>
          <div className={styles.activitySection}>
            <ActivityBarChart activity={dashboard.weeklyActivity} />
          </div>
        </div>

        {/* --- Row Fragments --- */}
        <EnrolledCourses courses={courses} />
        <JobBoard jobs={dashboard.jobPosts} />
        <AlumniNetwork alumni={dashboard.alumni} />
      </main>

      {/* --- Right Panel --- */}
      <aside className={styles.rightPanel}>
        <RightSidePanel data={{ ...dashboard, skills: profile.skills }} />
      </aside>
    </div>
  );
}
