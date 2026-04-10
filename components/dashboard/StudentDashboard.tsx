"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
} from "@mui/material";
import {
  Search,
  Bell,
  Trophy,
  Flame,
  Target,
  CheckCircle2,
  TrendingUp,
  Clock,
  PlayCircle,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  Building,
  Users,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import gsap from "gsap";
import styles from "@/styles/StudentDashboard.module.css";
// import ThreeScene from "./ThreeScene"; // You can re-enable this if you want the 3D background

// -------------------- Dummy Data --------------------
const dummyDashboardData = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  assignments: { completed: 12, total: 15 },
  academicScore: 85,
  learningStreak: 12,
  recentAssignments: [
    { id: 1, title: "React Final Project", submittedAt: "2025-03-20" },
    { id: 2, title: "Build a REST API", submittedAt: "2025-03-18" },
    { id: 3, title: "Normalization Exercise", submittedAt: "2025-03-15" },
  ],
  jobPosts: [
    { id: 1, title: "Frontend Developer", company: "TechCorp" },
    { id: 2, title: "Backend Engineer", company: "DataSoft" },
    { id: 3, title: "Full Stack Intern", company: "StartupHub" },
  ],
  alumni: [
    { id: 1, name: "Sarah Johnson", role: "Senior Frontend Engineer", batch: "2023" },
    { id: 2, name: "Michael Chen", role: "DevOps Lead", batch: "2022" },
    { id: 3, name: "Emily Davis", role: "Product Manager", batch: "2023" },
  ],
  topPerformers: [
    { name: "Sarah Johnson", score: 2450 },
    { name: "Michael Chen", score: 2320 },
    { name: "Emily Davis", score: 2210 },
    { name: "Alex Johnson", score: 2100 },
    { name: "Olivia Martinez", score: 1980 },
  ],
  weeklyActivity: [65, 80, 45, 70, 90, 30, 20],
  enrolledCourses: [
    { id: 1, title: "Complete Web Development Bootcamp", instructor: "Dr. Sarah Chen", progress: 75 },
    { id: 2, title: "Data Science & Machine Learning", instructor: "Prof. James Wilson", progress: 45 },
    { id: 3, title: "UI/UX Design Masterclass", instructor: "Emily Rodriguez", progress: 90 },
  ],
  upcomingQuizzes: [
    { id: 1, title: "React Fundamentals", date: "2025-03-28", time: "10:00 AM", duration: "45 Mins" },
    { id: 2, title: "JavaScript Advanced", date: "2025-04-02", time: "2:00 PM", duration: "60 Mins" },
  ],
  attendance: { totalClasses: 40, present: 34, percentage: 85 },
  skills: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Redux", "Material UI", "REST APIs"],
  totalSkills: 12,
};

export default function StudentDashboard() {
  const router = useRouter();
  const theme = useTheme();

  const [events, setEvents] = useState<Record<string, { title: string }>>({});
  const [newEventName, setNewEventName] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [greeting, setGreeting] = useState("");

  // Refs for GSAP Entrance Animations
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const animateRefs = useRef<(HTMLElement | null)[]>([]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !animateRefs.current.includes(el)) {
      animateRefs.current.push(el);
    }
  };

  // Refs for Counter Animations
  const scoreRef = useRef<HTMLSpanElement>(null);
  const streakRef = useRef<HTMLSpanElement>(null);
  const assignmentsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("calendarEvents");
    if (saved) setEvents(JSON.parse(saved));
  }, []);

  // --- GSAP ANIMATIONS ---
  useEffect(() => {
    if (!containerRef.current) return;
    
    gsap.killTweensOf("*");
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Header fade down
    if (headerRef.current) {
      tl.fromTo(headerRef.current, 
        { y: -30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8 }
      );
    }

    // 2. Stagger all major cards and sections up
    if (animateRefs.current.length > 0) {
      tl.fromTo(animateRefs.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05 },
        "-=0.4"
      );
    }

    // 3. Counter Animations (Score, Streak, Assignments)
    const scoreObj = { val: 0 };
    gsap.to(scoreObj, {
      val: dummyDashboardData.academicScore,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        if (scoreRef.current) scoreRef.current.innerText = Math.floor(scoreObj.val).toString();
      }
    });

    const streakObj = { val: 0 };
    gsap.to(streakObj, {
      val: dummyDashboardData.learningStreak,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        if (streakRef.current) streakRef.current.innerText = Math.floor(streakObj.val).toString();
      }
    });

    const assignObj = { val: 0 };
    gsap.to(assignObj, {
      val: dummyDashboardData.assignments.completed,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        if (assignmentsRef.current) assignmentsRef.current.innerText = Math.floor(assignObj.val).toString();
      }
    });

  }, []);

  const saveEvent = () => {
    if (newEventName.trim() && selectedDate !== null) {
      const dateKey = `${selectedYear}-${selectedMonth + 1}-${selectedDate}`;
      const updated = { ...events, [dateKey]: { title: newEventName } };
      setEvents(updated);
      localStorage.setItem("calendarEvents", JSON.stringify(updated));
      setNewEventName("");
      setShowModal(false);
      toast.success("Event saved!");
    }
  };

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const displayName = dummyDashboardData.name;
  const heatmapData = Array.from({ length: 52 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => ((w * 7 + d) % 4))
  );

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const barChartData = dummyDashboardData.weeklyActivity.map((val, i) => ({
    day: ["M", "T", "W", "T", "F", "S", "S"][i],
    value: val,
    key: `bar-${i}`,
  }));

  return (
    <Box className={styles.dashboardWrapper} ref={containerRef}>
      {/* <ThreeScene /> */}
      <Box sx={{ position: "relative", zIndex: 1, width: "100%" }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box className={styles.header} ref={headerRef}>
            <Box className={styles.welcomeInfo}>
              <Typography variant="h4" component="h1" className={styles.greetingText}>
                {greeting ? `${greeting}, ${displayName}! 👋` : "Loading..."}
              </Typography>
              <Typography variant="body2" color="text.secondary" className={styles.subText}>
                Email: {dummyDashboardData.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" className={styles.subText}>
                You have completed {dummyDashboardData.assignments.completed} out of {dummyDashboardData.assignments.total} assignments.
              </Typography>
            </Box>
            <Box className={styles.headerActions}>
              <div className={styles.searchBox}>
                <Search size={18} />
                <input type="text" placeholder="Search lessons, assignments..." />
              </div>
              <button className={styles.notifBadge}>
                <Bell size={22} />
              </button>
              <Avatar
                src={`https://ui-avatars.com/api/?name=${displayName}&background=${theme.palette.primary.main.replace("#", "")}&color=fff`}
                className={styles.profileImg}
              />
            </Box>
          </Box>

          {/* Bento Stats */}
          <Grid container spacing={3} alignItems="stretch" className={styles.bentoGrid} sx={{ mb: 4 }}>
            {/* Academic Score Card */}
            <Grid size={{xs:12,md:4}} sx={{ display: 'flex' }}>
              <Paper className={`${styles.bentoCard} ${styles.glassCard}`} ref={addToRefs} sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box className={styles.scoreInfo}>
                  <Typography className={styles.label}>Academic Score</Typography>
                  <Typography variant="h3" sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}>
                    <span ref={scoreRef}>0</span>%
                  </Typography>
                  <Box className={styles.trendText} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                    <TrendingUp size={14} color="#10b981" />
                    <Typography variant="caption" sx={{ color: "#10b981" }}>+5% vs last month</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Trophy size={48} color={theme.palette.primary.main} style={{ opacity: 0.2 }} />
                </Box>
              </Paper>
            </Grid>

            {/* Learning Streak Card */}
            <Grid size={{xs:12,md:4}} sx={{ display: 'flex' }}>
              <Paper className={`${styles.bentoCard} ${styles.glassCard}`} ref={addToRefs} sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box className={styles.cardHeader} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Flame size={32} color={theme.palette.warning.main} fill={theme.palette.warning.main} />
                  <Chip label="Keep it up!" size="small" sx={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: theme.palette.warning.main }} />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                    <span ref={streakRef}>0</span> Days
                  </Typography>
                  <Typography className={styles.label}>Learning Streak</Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Assignments Completed Card */}
            <Grid size={{xs:12,md:4}} sx={{ display: 'flex' }}>
              <Paper className={`${styles.bentoCard} ${styles.glassCard}`} ref={addToRefs} sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Target size={32} color={theme.palette.secondary.main} style={{ opacity: 0.8 }} />
                  <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1 }}>
                     <span ref={assignmentsRef}>0</span> / {dummyDashboardData.assignments.total}
                  </Typography>
                  <Typography className={styles.label}>Assignments Completed</Typography>
                </Box>
                <Box className={styles.miniProgress} sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(dummyDashboardData.assignments.completed / dummyDashboardData.assignments.total) * 100}
                    sx={{ height: 6, borderRadius: 3, mb: 2 }}
                  />
                  <Button fullWidth variant="outlined" onClick={() => router.push('/student/assignments')} className={styles.viewBtn} size="small">
                    View Details
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Continue Learning Hero */}
          <Paper className={styles.continueCard} ref={addToRefs} sx={{ mb: 4 }}>
            <div className={styles.continueCardContent}>
              <span className={styles.resumeTag}>RESUME</span>
              <Typography variant="h5" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
                {dummyDashboardData.enrolledCourses[0]?.title || "No Active Course"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: "rgba(255,255,255,0.8)" }}>
                By {dummyDashboardData.enrolledCourses[0]?.instructor || "Instructor"}
              </Typography>
              <button className={styles.viewCourseBtn} onClick={() => router.push(`/student/course/${dummyDashboardData.enrolledCourses[0]?.id || 1}`)}>
                <PlayCircle size={18} /> Resume Lesson
              </button>
            </div>
            <div className={styles.bgDecoration}>
              <PlayCircle size={150} opacity={0.1} />
            </div>
          </Paper>

          {/* Learning Activity Heatmap */}
          <Paper className={`${styles.heatmapSection} ${styles.glassCard}`} ref={addToRefs} sx={{ mb: 4 }}>
            <div className={styles.heatmapHeader} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <Typography variant="h6">Learning Activity</Typography>
              <span className={styles.totalStats} style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                Total: {dummyDashboardData.weeklyActivity.reduce((a, b) => a + b, 0)} hours this week
              </span>
            </div>
            <div className={styles.heatmapContainer} style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '8px' }}>
              {heatmapData.map((week, i) => (
                <div key={i} className={styles.heatmapColumn} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {week.map((day, j) => (
                    <div
                      key={j}
                      className={`${styles.heatmapCell} ${styles[`level${day}`]}`}
                      style={{ width: '12px', height: '12px', borderRadius: '4px', 
                        backgroundColor: day === 0 ? 'var(--color-border)' : day === 1 ? 'var(--color-primary-light)' : day === 2 ? 'var(--color-primary)' : 'var(--color-accent)' 
                      }}
                      title={`Week ${i + 1}, Day ${j + 1}: Activity Level ${day}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </Paper>

          {/* Middle Row: Recent Submissions & Weekly Activity Chart */}
          <Grid container spacing={3} className={styles.middleRow} sx={{ mb: 4 }}>
            <Grid size={{xs:12,md:6}}>
              <Paper className={`${styles.activitySection} ${styles.glassCard}`} ref={addToRefs}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Clock size={18} /> Recent Submissions
                </Typography>
                <div className={styles.activityList} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {dummyDashboardData.recentAssignments.map((item) => (
                    <div key={item.id} className={styles.activityItem} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--color-background)', borderRadius: '8px', cursor: 'pointer' }} onClick={() => router.push(`/student/assignments/${item.id}`)}>
                      <div className={styles.activityIcon} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-surface)', borderRadius: '8px' }}>
                        <CheckCircle2 size={16} />
                      </div>
                      <div className={styles.activityInfo} style={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
                        <Typography variant="caption" color="text.secondary">Submitted on {new Date(item.submittedAt).toLocaleDateString()}</Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </Paper>
            </Grid>
            <Grid size={{xs:12,md:6}}>
              <Paper className={`${styles.activitySection} ${styles.glassCard}`} ref={addToRefs}>
                <Typography variant="h6" sx={{ mb: 2 }}>Weekly Activity</Typography>
                <div className={styles.barChart}>
                  {barChartData.map((data, index) => (
                    <div key={data.key} className={styles.barContainer}>
                      <div
                        className={styles.barFillGsap}
                        style={{ height: `${data.value}%`, transitionDelay: `${index * 0.1}s` }}
                        title={`${data.value}%`}
                      />
                      <span className={styles.barLabel}>{data.day}</span>
                    </div>
                  ))}
                </div>
              </Paper>
            </Grid>
          </Grid>

          {/* My Courses */}
          <Paper className={`${styles.coursesSection} ${styles.glassCard}`} ref={addToRefs} sx={{ mb: 4 }}>
            <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Typography variant="h6">My Courses</Typography>
              <Button size="small" variant="outlined" onClick={() => router.push("/student/courses")}>View All</Button>
            </div>
            <Grid container spacing={3}>
              {dummyDashboardData.enrolledCourses.map((course) => (
                <Grid size={{xs:12,sm:6,md:4}} key={course.id}>
                  <Box className={styles.courseCard} style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>{course.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{course.instructor}</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Progress</Typography>
                        <Typography variant="caption" color="text.secondary">{course.progress}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={course.progress} sx={{ height: 6, borderRadius: 3 }} />
                    </Box>
                    <Button fullWidth variant="contained" sx={{ bgcolor: 'var(--color-accent)' }} onClick={() => router.push(`/student/course/${course.id}`)}>
                      Continue Learning
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Jobs & Internships */}
          <Paper className={`${styles.jobSection} ${styles.glassCard}`} ref={addToRefs} sx={{ mb: 4 }}>
            <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Briefcase size={18} /> Jobs & Internships
              </Typography>
              <Button size="small" onClick={() => router.push("/student/jobs")}>View All →</Button>
            </div>
            <Grid container spacing={2}>
              {dummyDashboardData.jobPosts.map((job) => (
                <Grid size={{xs:12,sm:6,md:4}} key={job.id}>
                  <Box className={styles.jobCard} style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Building size={20} color="var(--color-text-secondary)" />
                      <Chip label="Full-time" size="small" />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{job.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{job.company}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Not Disclosed</Typography>
                      <Button size="small" variant="outlined" onClick={() => toast.success("Application started!")}>Apply</Button>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Alumni Network */}
          <Paper className={`${styles.alumniSection} ${styles.glassCard}`} ref={addToRefs} sx={{ mb: 4 }}>
            <div className={styles.sectionHeader} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Users size={22} color="var(--color-primary)" />
              <Typography variant="h6">Notable Alumni</Typography>
            </div>
            <Grid container spacing={3}>
              {dummyDashboardData.alumni.map((al) => (
                <Grid size={{xs:12,sm:4}} key={al.id}>
                  <Box className={styles.alumniCard} style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                    <Avatar 
                      src={`https://ui-avatars.com/api/?name=${al.name}&background=${theme.palette.primary.main.replace("#", "")}&color=fff`} 
                      sx={{ width: 64, height: 64, mx: 'auto', mb: 2 }} 
                    />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{al.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{al.role}</Typography>
                    <Chip label={`Batch ${al.batch}`} size="small" sx={{ mb: 2 }} />
                    <Button fullWidth variant="outlined" size="small" endIcon={<ExternalLink size={14} />}>Connect</Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>

        {/* Right Sidebar Elements appended into the same layout context or grid if we want. Originally the sidebar was in a Container alongside an empty 8 grid. We can just place them linearly or structured. */}
        <Container maxWidth="xl" className={styles.sidebarContainer} sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {/* Performance & Calendar */}
            <Grid size={{xs:12,md:4}}>
              <Paper className={`${styles.glassCard}`} ref={addToRefs} sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Performance</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{ position: 'relative', width: 120, height: 120 }}>
                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="var(--color-border)"
                        strokeWidth="3"
                      />
                      <path
                        stroke="var(--color-accent)"
                        strokeDasharray={`${dummyDashboardData.academicScore}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        strokeWidth="3"
                      />
                    </svg>
                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{dummyDashboardData.academicScore}%</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Goals</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{Math.floor(dummyDashboardData.academicScore / 6)}/16</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Hours</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{dummyDashboardData.academicScore}h</Typography>
                  </Box>
                </Box>
              </Paper>


              <Paper className={`${styles.eventCalendarCard} ${styles.glassCard}`} ref={addToRefs}>
                <div className={styles.calendarHeader}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={18} /> 
                    <Typography variant="h6">Calendar</Typography>
                  </Box>
                  <div className={styles.navActions}>
                    <button onClick={prevMonth} className={styles.navBtn}><ChevronLeft size={16} /></button>
                    <span className={styles.currentMonth}>{monthNames[selectedMonth]} {selectedYear}</span>
                    <button onClick={nextMonth} className={styles.navBtn}><ChevronRight size={16} /></button>
                  </div>
                </div>
                <div className={styles.calendarGrid}>
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
                    <div key={`${d}-${idx}`} className={styles.weekdayLabel}>{d}</div>
                  ))}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className={styles.emptySlot}></div>
                  ))}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((date) => {
                     const dateStr = `${selectedYear}-${selectedMonth + 1}-${date}`;
                     const hasEvent = !!events[dateStr];
                     const isToday = new Date().toDateString() === new Date(selectedYear, selectedMonth, date).toDateString();
                     return (
                       <div
                         key={date}
                         onClick={() => { setSelectedDate(date); setShowModal(true); }}
                         className={`${styles.calendarDay} ${isToday ? styles.today : ""} ${hasEvent ? styles.hasEvent : ""}`}
                       >
                         {date}
                         {hasEvent && <span className={styles.eventDot}></span>}
                       </div>
                     );
                  })}
                </div>
              </Paper>
            </Grid>

            {/* Attendance & Skills */}
            <Grid size={{xs:12,md:4}}>
              <Paper className={`${styles.skillsSection} ${styles.glassCard}`} ref={addToRefs} sx={{ mb: 3 }}>
                <div className={styles.skillsHeaderWrapper}>
                  <Typography variant="h6">Skills Acquired</Typography>
                  <span className={styles.skillCount}>{dummyDashboardData.skills.length}/{dummyDashboardData.totalSkills}</span>
                </div>
                <div className={styles.pillsContainer} style={{ marginTop: "16px" }}>
                  {dummyDashboardData.skills.slice(0, 5).map((skill) => (
                    <div key={skill} className={styles.skillPill} style={{ padding: '6px 12px', border: '1px solid var(--color-border)', borderRadius: '20px', fontSize: '0.875rem' }}>
                      <CheckCircle2 size={14} className={styles.checkIcon} color={theme.palette.primary.main} />
                      {skill}
                    </div>
                  ))}
                  {dummyDashboardData.skills.length > 5 && (
                    <div className={styles.skillPill} style={{ padding: '6px 12px', border: '1px dashed var(--color-border)', borderRadius: '20px', fontSize: '0.875rem' }}>
                      +{dummyDashboardData.skills.length - 5} More
                    </div>
                  )}
                </div>
                <div className={styles.skillProgressBar} style={{ marginTop: "24px" }}>
                  <div className={styles.skillProgressFillGsap} style={{ width: `${(dummyDashboardData.skills.length / dummyDashboardData.totalSkills) * 100}%` }} />
                </div>
              </Paper>

              <Paper className={`${styles.glassCard}`} ref={addToRefs}>
                <Typography variant="h6" sx={{ mb: 2 }}>My Attendance</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontWeight: 'bold' }}>
                    {dummyDashboardData.attendance.percentage}%
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total Classes: {dummyDashboardData.attendance.totalClasses}</Typography>
                    <Typography variant="body2" color="text.secondary">Present: {dummyDashboardData.attendance.present}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Upcoming Quizzes & Leaderboard */}
            <Grid size={{xs:12,md:4}}>
               <Paper className={`${styles.glassCard}`} ref={addToRefs} sx={{ mb: 3 }}>
                 <Typography variant="h6" sx={{ mb: 2 }}>Upcoming Quizzes</Typography>
                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                   {dummyDashboardData.upcomingQuizzes.map((quiz) => (
                     <Box key={quiz.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: 'var(--color-background)', borderRadius: 2, border: '1px solid var(--color-border)' }}>
                       <Box sx={{ textAlign: 'center', minWidth: 45 }}>
                         <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                           {new Date(quiz.date).toLocaleString("default", { month: "short" })}
                         </Typography>
                         <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: 'bold', color: 'var(--color-primary)' }}>
                           {new Date(quiz.date).getDate()}
                         </Typography>
                       </Box>
                       <Box sx={{ flexGrow: 1 }}>
                         <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{quiz.title}</Typography>
                         <Typography variant="caption" color="text.secondary">
                           {quiz.time} • {quiz.duration}
                         </Typography>
                       </Box>
                       <ChevronRight size={18} color="var(--color-text-secondary)" />
                     </Box>
                   ))}
                 </Box>
               </Paper>

               <Paper className={`${styles.leaderboardCard} ${styles.glassCard}`} ref={addToRefs}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Trophy size={18} color={theme.palette.primary.main} /> Leaderboard
                </Typography>
                <div className={styles.leaderList}>
                  {dummyDashboardData.topPerformers.map((user, idx) => (
                    <div key={idx} className={styles.leaderItem}>
                      <span className={styles.rank} style={{ color: idx === 0 ? '#fbbf24' : idx === 1 ? '#9ca3af' : idx === 2 ? '#b45309' : 'inherit', fontWeight: idx < 3 ? 'bold' : 'normal' }}>#{idx + 1}</span>
                      <Avatar src={`https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`} sx={{ width: 28, height: 28, mr: 1.5 }} />
                      <span className={styles.userName} style={{ flexGrow: 1 }}>{user.name}</span>
                      <span className={styles.userScore} style={{ fontWeight: 'bold' }}>{user.score} XP</span>
                    </div>
                  ))}
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Event Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>
          {events[`${selectedYear}-${selectedMonth + 1}-${selectedDate}`] ? "Edit Event" : "Add Custom Event"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
            placeholder="Event Title..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} sx={{ color: "text.secondary" }}>Cancel</Button>
          <Button onClick={saveEvent} variant="contained" sx={{ bgcolor: "primary.main" }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
