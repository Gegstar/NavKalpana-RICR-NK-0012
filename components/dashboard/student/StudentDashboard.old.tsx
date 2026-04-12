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
import ThreeBackground from "@/components/ui/ThreeBackground";
import ThreeScoreGauge from "@/components/ui/ThreeScoreGauge";

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
  const [assignmentValue, setAssignmentValue] = useState(0);

  // Refs for GSAP Entrance Animations
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const animateRefs = useRef<(HTMLElement | null)[]>([]);
  const greetingRef = useRef<HTMLHeadingElement>(null);
  const flameRef = useRef<HTMLDivElement>(null);
  const chipsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !animateRefs.current.includes(el)) {
      animateRefs.current.push(el);
    }
  };

  const addToChipsRefs = (el: HTMLDivElement | null) => {
    if (el && !chipsRefs.current.includes(el)) {
      chipsRefs.current.push(el);
    }
  };

  const addToBarRefs = (el: HTMLDivElement | null) => {
    if (el && !barRefs.current.includes(el)) {
      barRefs.current.push(el);
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

    // 2. Greeting split letters stagger
    if (greetingRef.current && greetingRef.current.children.length > 0) {
      tl.fromTo(greetingRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.5 },
        "-=0.6"
      );
    }

    // 3. Stagger all major cards and sections up (Reveal & Slide)
    if (animateRefs.current.length > 0) {
      tl.fromTo(animateRefs.current,
        { y: 50, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.08, ease: "back.out(1.5)" },
        "-=0.3"
      );
    }

    // 4. Counter Animations (Score & Streak)
    const scoreObj = { val: 0 };
    gsap.to(scoreObj, {
      val: dummyDashboardData.academicScore,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        if (scoreRef.current) scoreRef.current.innerText = Math.floor(scoreObj.val).toString();
      }
    });

    const streakObj = { val: 0 };
    gsap.to(streakObj, {
      val: dummyDashboardData.learningStreak,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        if (streakRef.current) streakRef.current.innerText = Math.floor(streakObj.val).toString();
      }
    });

    const assignObj = { val: 0 };
    gsap.to(assignObj, {
      val: dummyDashboardData.assignments.completed,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        if (assignmentsRef.current) assignmentsRef.current.innerText = Math.floor(assignObj.val).toString();
      }
    });

    // 5. Assignment Progress Bar Automation
    gsap.to({ value: 0 }, {
      value: (dummyDashboardData.assignments.completed / dummyDashboardData.assignments.total) * 100,
      duration: 2,
      ease: "power2.out",
      onUpdate: function() {
        setAssignmentValue(this.targets()[0].value);
      }
    });

    // 6. Flame Pulsing Glow
    if (flameRef.current) {
      gsap.to(flameRef.current, {
        scale: 1.15,
        filter: "drop-shadow(0px 0px 12px rgba(245, 158, 11, 0.8))",
        yoyo: true,
        repeat: -1,
        duration: 1.2,
        ease: "sine.inOut"
      });
    }

    // 7. Weekly Activity Bars Stagger
    if (barRefs.current.length > 0) {
      gsap.fromTo(barRefs.current,
        { scaleY: 0, transformOrigin: "bottom" },
        { scaleY: 1, duration: 1, stagger: 0.1, ease: "back.out(1.2)", delay: 1 }
      );
    }

  }, [greeting]); // Trigger after greeting state is set

  // Mouse leave/enter for Magnetic Skills Chips
  const handleChipMouseMove = (e: React.MouseEvent<HTMLDivElement>, ref: HTMLDivElement | null) => {
    if (!ref) return;
    const { left, top, width, height } = ref.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    gsap.to(ref, {
      x: x * 0.4,
      y: y * 0.4,
      rotation: x * 0.1,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleChipMouseLeave = (ref: HTMLDivElement | null) => {
    if (!ref) return;
    gsap.to(ref, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.3)"
    });
  };

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

  const fullGreetingText = greeting ? `${greeting}, ${displayName}!` : "Loading...";

  return (
    <Box className={styles.dashboardWrapper} ref={containerRef} sx={{ position: "relative", minHeight: "100vh" }}>
      {/* 3D Interactive Background */}
      <ThreeBackground />

      <Box sx={{ position: "relative", zIndex: 1, width: "100%", pt: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box className={styles.header} ref={headerRef} sx={{ mb: 4 }}>
            <Box className={styles.welcomeInfo}>
              <Typography variant="h4" component="h1" className={styles.greetingText} ref={greetingRef}>
                {fullGreetingText.split("").map((char, index) => (
                  <span key={index} style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}>
                    {char}
                  </span>
                ))}
              </Typography>
              <Typography variant="body2" color="text.secondary" className={styles.subText}>
                Email: {dummyDashboardData.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" className={styles.subText}>
                You have completed {dummyDashboardData.assignments.completed} out of {dummyDashboardData.assignments.total} assignments.
              </Typography>
            </Box>
            <Box className={styles.headerActions}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2, px: 2, py: 1 }}>
                <Search size={18} />
                <input type="text" placeholder="Search lessons..." style={{ border: 'none', background: 'transparent', outline: 'none', color: 'inherit' }} />
              </Box>
              <Button sx={{ minWidth: "auto", p: 1, border: "1px solid", borderColor: "divider", borderRadius: "50%", color: "text.secondary", bgcolor: "background.paper" }}>
                <Bell size={22} />
              </Button>
              <Avatar
                src={`https://ui-avatars.com/api/?name=${displayName}&background=${theme.palette.primary.main.replace("#", "")}&color=fff`}
                className={styles.profileImg}
              />
            </Box>
          </Box>

          {/* Bento Stats */}
          <Grid container spacing={3} alignItems="stretch" sx={{ mb: 4 }}>
            {/* Academic Score Card (3D) */}
           <Grid size={{ xs: 12, md: 4 }}>
              <Paper 
                ref={addToRefs} 
                sx={{ 
                  height: '100%', 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  backdropFilter: 'blur(16px)', 
                  backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 4
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Academic Score</Typography>
                  <Typography variant="h3" sx={{ color: theme.palette.primary.main, fontWeight: "bold", display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <span ref={scoreRef}>0</span><Typography variant="h5" component="span">%</Typography>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                    <TrendingUp size={14} color="#10b981" />
                    <Typography variant="caption" sx={{ color: "#10b981" }}>+5% vs last month</Typography>
                  </Box>
                </Box>
                <Box sx={{ flexGrow: 1, position: 'relative', minHeight: '150px', mt: 2 }}>
                  {/* 3D Torus Gauge */}
                  <ThreeScoreGauge score={dummyDashboardData.academicScore} />
                  <Trophy size={20} color={theme.palette.primary.main} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.8 }} />
                </Box>
              </Paper>
            </Grid>

            {/* Learning Streak Card */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper 
                ref={addToRefs} 
                sx={{ 
                  height: '100%', 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  backdropFilter: 'blur(16px)', 
                  backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 4
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box ref={flameRef} sx={{ display: 'inline-block' }}>
                    <Flame size={48} color={theme.palette.warning.main} strokeWidth={1} style={{ fill: "rgba(245, 158, 11, 0.3)" }} />
                  </Box>
                  <Chip label="Keep it up!" size="small" sx={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: theme.palette.warning.main, fontWeight: 'bold' }} />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h2" sx={{ fontWeight: "900", letterSpacing: "-1px" }}>
                    <span ref={streakRef}>0</span>
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">Learning Streak Days</Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Assignments Completed Card */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper 
                ref={addToRefs} 
                sx={{ 
                  height: '100%', 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column',
                  backdropFilter: 'blur(16px)', 
                  backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 4
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Target size={32} color={theme.palette.secondary.main} style={{ opacity: 0.8 }} />
                  <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1 }}>
                     <span ref={assignmentsRef}>0</span> / {dummyDashboardData.assignments.total}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">Assignments Completed</Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={assignmentValue}
                    sx={{ height: 8, borderRadius: 4, mb: 2, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  />
                  <Button fullWidth variant="outlined" onClick={() => router.push('/student/assignments')} size="small" sx={{ borderRadius: 2 }}>
                    View Details
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Middle Row: Recent Submissions & Weekly Activity Chart */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Weekly Activity Box Elements Bar Chart */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper ref={addToRefs} sx={{ p: 3, height: '100%', backdropFilter: 'blur(16px)', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 4 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Weekly Activity</Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 200, pt: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  {barChartData.map((data, index) => (
                    <Box key={data.key} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '10%', height: '100%' }}>
                      <Box sx={{ flexGrow: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                         <Box
                           ref={addToBarRefs}
                           sx={{
                             width: '60%',
                             height: `${data.value}%`,
                             backgroundColor: theme.palette.primary.main,
                             background: `linear-gradient(180deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                             borderRadius: '4px 4px 0 0',
                             boxShadow: `0 0 10px ${theme.palette.primary.main}40`,
                           }}
                           title={`${data.value}%`}
                         />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>{data.day}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Events Calendar */}
           <Grid size={{ xs: 12, md: 6 }}>
              <Paper ref={addToRefs} sx={{ p: 3, height: '100%', backdropFilter: 'blur(16px)', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={20} color={theme.palette.primary.main} /> Events Calendar
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button onClick={prevMonth} size="small" variant="outlined" sx={{ minWidth: 0, p: 0.5 }}><ChevronLeft size={16} /></Button>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>{monthNames[selectedMonth]} {selectedYear}</Typography>
                    <Button onClick={nextMonth} size="small" variant="outlined" sx={{ minWidth: 0, p: 0.5 }}><ChevronRight size={16} /></Button>
                  </Box>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, textAlign: 'center' }}>
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
                    <Typography key={`${d}-${idx}`} variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1 }}>{d}</Typography>
                  ))}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <Box key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((date) => {
                     const dateStr = `${selectedYear}-${selectedMonth + 1}-${date}`;
                     const hasEvent = !!events[dateStr];
                     const isToday = new Date().toDateString() === new Date(selectedYear, selectedMonth, date).toDateString();
                     return (
                       <Box
                         key={date}
                         onClick={() => { setSelectedDate(date); setShowModal(true); }}
                         sx={{
                           p: 1,
                           borderRadius: 2,
                           cursor: 'pointer',
                           position: 'relative',
                           border: isToday ? `1px solid ${theme.palette.primary.main}` : '1px solid transparent',
                           backgroundColor: isToday ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                           boxShadow: isToday ? `0 0 10px ${theme.palette.primary.main}40` : 'none',
                           '&:hover': { borderColor: theme.palette.primary.main }
                         }}
                       >
                         <Typography variant="body2" sx={{ color: isToday ? theme.palette.primary.main : 'inherit', fontWeight: isToday ? 'bold' : 'normal' }}>{date}</Typography>
                         {hasEvent && <Box sx={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, bgcolor: 'error.main', borderRadius: '50%' }} />}
                       </Box>
                     );
                  })}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 6 }}>
            {/* Skills Acquired */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper ref={addToRefs} sx={{ p: 3, height: '100%', backdropFilter: 'blur(16px)', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Skills Acquired</Typography>
                  <Typography variant="subtitle2" color="primary">{dummyDashboardData.skills.length}/{dummyDashboardData.totalSkills}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
                  {dummyDashboardData.skills.map((skill, i) => (
                    <Box
                      key={skill}
                      ref={(el) => { addToChipsRefs(el as HTMLDivElement | null); }}
                      onMouseMove={(e) => handleChipMouseMove(e, chipsRefs.current[i])}
                      onMouseLeave={() => handleChipMouseLeave(chipsRefs.current[i])}
                      sx={{
                        p: '6px 12px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 20,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'default',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <CheckCircle2 size={14} color={theme.palette.primary.main} />
                      <Typography variant="body2">{skill}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Leaderboard */}
            <Grid size={{ xs: 12, md: 6 }}>
               <Paper ref={addToRefs} sx={{ p: 3, height: '100%', backdropFilter: 'blur(16px)', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Trophy size={20} color={theme.palette.primary.main} /> Global Leaderboard
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {dummyDashboardData.topPerformers.slice(0, 4).map((user, idx) => {
                    // GSAP Float class logic could be added using classes, doing inline simple float for the top rank might be cleaner, 
                    // but we will do CSS animation or a simple map for rank colors.
                    const isTop = idx === 0;
                    return (
                      <Box 
                        key={idx} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2, 
                          p: 1.5, 
                          borderRadius: 2, 
                          backgroundColor: isTop ? 'rgba(251, 191, 36, 0.05)' : 'rgba(255,255,255,0.02)',
                          border: isTop ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid transparent',
                          transform: isTop ? 'translateY(-2px)' : 'none',
                          boxShadow: isTop ? '0 4px 12px rgba(251, 191, 36, 0.1)' : 'none',
                          transition: 'transform 0.3s'
                        }}
                      >
                        <Box sx={{ width: 24, textAlign: 'center' }}>
                          {idx === 0 ? <Trophy size={18} color="#fbbf24" /> :
                           idx === 1 ? <Trophy size={18} color="#9ca3af" /> :
                           idx === 2 ? <Trophy size={18} color="#b45309" /> :
                           <Typography variant="subtitle2" color="text.secondary">#{idx + 1}</Typography>}
                        </Box>
                        <Avatar src={`https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`} sx={{ width: 32, height: 32 }} />
                        <Typography variant="subtitle2" sx={{ flexGrow: 1, fontWeight: isTop ? 'bold' : 'normal', color: isTop ? '#fbbf24' : 'inherit' }}>{user.name}</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{user.score} XP</Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Event Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} PaperProps={{ sx: { backdropFilter: 'blur(16px)', backgroundColor: 'rgba(20, 20, 20, 0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}}>
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
            variant="outlined"
            InputProps={{ style: { color: "#fff" } }}
            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
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
