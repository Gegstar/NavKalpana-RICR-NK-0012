"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  LinearProgress,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
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
  Briefcase,
  Building,
  Users,
  ExternalLink,
  ChevronLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "@/styles/StudentDashboard.module.css";

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

  // Dummy data references
  const displayName = dummyDashboardData.name;
  const completedAssignments = dummyDashboardData.assignments.completed;
  const totalAssignments = dummyDashboardData.assignments.total;
  const performanceValue = dummyDashboardData.academicScore;
  const learningStreak = dummyDashboardData.learningStreak;
  const attendancePercent = dummyDashboardData.attendance.percentage;
  const skills = dummyDashboardData.skills;
  const totalSkills = dummyDashboardData.totalSkills;
  const weeklyStats = dummyDashboardData.weeklyActivity;

  // Deterministic heatmap data (same on server and client)
  const heatmapData = Array.from({ length: 52 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => ((w * 7 + d) % 4))
  );

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

  // Calendar helpers
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  // Prepare bar chart data with unique keys
  const barChartData = weeklyStats.map((val, i) => ({
    day: ["M", "T", "W", "T", "F", "S", "S"][i],
    value: val,
    key: `${["M", "T", "W", "T", "F", "S", "S"][i]}-${i}`,
  }));

  return (
    <Box className={styles.dashboardWrapper}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box className={styles.header}>
          <Box className={styles.welcomeInfo}>
            <Typography variant="h4" component="h1" className={styles.greetingText}>
              {greeting ? `${greeting}, ${displayName}! 👋` : "Loading..."}
            </Typography>
            <Typography variant="body2" color="text.secondary" className={styles.subText}>
              Email: {dummyDashboardData.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" className={styles.subText}>
              You have completed {completedAssignments} out of {totalAssignments} assignments.
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
              src={`https://ui-avatars.com/api/?name=${displayName}&background=${theme.palette.primary.main.replace("#", "")}&color=000`}
              className={styles.profileImg}
            />
          </Box>
        </Box>

        {/* Bento Stats */}
        <Grid container spacing={3} alignItems="stretch" className={styles.bentoGrid}>
          {/* Academic Score Card */}
          <Grid size={{xs:12,md:4}}  sx={{ display: 'flex' }}>
            <Paper
              className={`${styles.bentoCard} ${styles.scoreCard}`}
              sx={{ 
                height: '100%', 
                width: '100%',
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Box className={styles.scoreInfo}>
                <Typography className={styles.label}>Academic Score</Typography>
                <Typography variant="h3" sx={{ color: theme.palette.primary.main }}>
                  {performanceValue}%
                </Typography>
                <Box className={styles.trendText} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TrendingUp size={14} />
                  <Typography variant="caption">+5% vs last month</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Trophy size={48} color={theme.palette.primary.main} className={styles.iconBg} />
              </Box>
            </Paper>
          </Grid>

          {/* Learning Streak Card */}
          <Grid size={{xs:12,md:4}} sx={{ display: 'flex' }}>
            <Paper
              className={`${styles.bentoCard} ${styles.streakCard}`}
              sx={{ 
                height: '100%', 
                width: '100%',
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Box className={styles.cardHeader} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Flame size={32} color={theme.palette.warning.main} fill={theme.palette.warning.main} />
                <Chip label="Keep it up!" size="small" className={styles.badge} />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h3">
                  {learningStreak} Days
                </Typography>
                <Typography className={styles.label}>Learning Streak</Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Assignments Completed Card */}
          <Grid  size={{xs:12,md:4}} sx={{ display: 'flex' }}>
            <Paper
              className={`${styles.bentoCard} ${styles.assignmentCard}`}
              sx={{ 
                height: '100%', 
                width: '100%',
                display: 'flex', 
                flexDirection: 'column'
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Target size={32} color={theme.palette.primary.main} className={styles.iconBg} />
                <Typography variant="h3" sx={{ mt: 1 }}>
                  {completedAssignments} / {totalAssignments}
                </Typography>
                <Typography className={styles.label}>Assignments Completed</Typography>
              </Box>
              
              <Box className={styles.miniProgress} sx={{ mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={(completedAssignments / totalAssignments) * 100}
                  sx={{ height: 4, borderRadius: 2, mb: 2 }}
                />
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => router.push('/student/assignments')}
                  className={styles.viewBtn}
                  size="small"
                >
                  View Details
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Continue Learning Hero */}
        <Paper className={styles.continueCard}>
          <div className={styles.continueCardContent}>
            <span className={styles.resumeTag}>RESUME</span>
            <Typography variant="h5" gutterBottom>
              {dummyDashboardData.enrolledCourses[0]?.title || "No Active Course"}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              By {dummyDashboardData.enrolledCourses[0]?.instructor || "Instructor"}
            </Typography>
            <button
              className={styles.viewCourseBtn}
              onClick={() => router.push(`/student/course/${dummyDashboardData.enrolledCourses[0]?.id || 1}`)}
            >
              <PlayCircle size={18} /> Resume Lesson
            </button>
          </div>
          <div className={styles.bgDecoration}>
            <PlayCircle size={150} />
          </div>
        </Paper>

        {/* Learning Activity Heatmap */}
        <Paper className={styles.heatmapSection}>
          <div className={styles.heatmapHeader}>
            <Typography variant="h6">Learning Activity</Typography>
            <span className={styles.totalStats}>
              Total: {weeklyStats.reduce((a, b) => a + b, 0)} hours this week
            </span>
          </div>
          <div className={styles.heatmapContainer}>
            {heatmapData.map((week, i) => (
              <div key={i} className={styles.heatmapColumn}>
                {week.map((day, j) => (
                  <div
                    key={j}
                    className={`${styles.heatmapCell} ${styles[`level${day}`]}`}
                    title={`Week ${i + 1}, Day ${j + 1}: Activity Level ${day}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </Paper>

        {/* Middle Row: Recent Submissions & Weekly Activity Chart */}
        <Grid container spacing={3} className={styles.middleRow}>
          <Grid size={{xs:12,md:4}}>
            <Paper className={styles.activitySection}>
              <Typography variant="h6">
                <Clock size={18} /> Recent Submissions
              </Typography>
              <div className={styles.activityList}>
                {dummyDashboardData.recentAssignments.map((item) => (
                  <div
                    key={item.id}
                    className={styles.activityItem}
                    onClick={() => router.push(`/student/assignments/${item.id}`)}
                  >
                    <div className={styles.activityIcon}>
                      <CheckCircle2 size={16} />
                    </div>
                    <div className={styles.activityInfo}>
                      <strong>{item.title}</strong>
                      <span>Submitted on {new Date(item.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Paper>
          </Grid>
          <Grid size={{xs:12,md:4}}>
            <Paper className={styles.activitySection}>
              <Typography variant="h6">Weekly Activity</Typography>
              <div className={styles.barChart}>
                {barChartData.map((data) => (
                  <div key={data.key} className={styles.barContainer}>
                    <div
                      className={styles.barFill}
                      style={{ height: `${data.value}%` }}
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
        <Paper className={styles.coursesSection}>
          <div className={styles.sectionHeader}>
            <Typography variant="h6">My Courses</Typography>
            <button className={styles.viewAllBtn} onClick={() => router.push("/student/courses")}>
              View All
            </button>
          </div>
          <div className={styles.coursesGrid}>
            {dummyDashboardData.enrolledCourses.map((course) => (
              <div key={course.id} className={styles.courseCard}>
                <div className={styles.courseInfo}>
                  <h4>{course.title}</h4>
                  <p>{course.instructor}</p>
                </div>
                <div className={styles.progressContainer}>
                  <div className={styles.progressLabel}>
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                <button
                  className={styles.viewCourseBtn}
                  onClick={() => router.push(`/student/course/${course.id}`)}
                >
                  Continue Learning
                </button>
              </div>
            ))}
          </div>
        </Paper>

        {/* Jobs & Internships */}
        <Paper className={styles.jobSection}>
          <div className={styles.sectionHeader}>
            <Typography variant="h6">
              <Briefcase size={18} /> Jobs & Internships
            </Typography>
            <button className={styles.viewAll} onClick={() => router.push("/student/jobs")}>
              View All →
            </button>
          </div>
          <div className={styles.jobGrid}>
            {dummyDashboardData.jobPosts.map((job) => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.cardHeader}>
                  <Building size={20} />
                  <span className={styles.badge}>Full-time</span>
                </div>
                <h4 className={styles.jobRole}>{job.title}</h4>
                <p className={styles.companyInfo}>{job.company}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.pay}>Not Disclosed</span>
                  <button
                    className={styles.applyBtn}
                    onClick={() => toast.success("Application started!")}
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Paper>

        {/* Alumni Network */}
        <Paper className={styles.alumniSection}>
          <div className={styles.sectionHeader}>
            <Users size={22} />
            <Typography variant="h6">Notable Alumni</Typography>
          </div>
          <div className={styles.alumniContainer}>
            {dummyDashboardData.alumni.map((al) => (
              <div key={al.id} className={styles.alumniCard}>
                <img
                  src={`https://ui-avatars.com/api/?name=${al.name}&background=${theme.palette.primary.main.replace("#", "")}&color=000`}
                  alt={al.name}
                  className={styles.avatar}
                />
                <h4>{al.name}</h4>
                <p className={styles.role}>{al.role}</p>
                <p className={styles.batch}>Batch {al.batch}</p>
                <button className={styles.connectBtn}>
                  Connect <ExternalLink size={12} />
                </button>
              </div>
            ))}
          </div>
        </Paper>
      </Container>

      {/* Right Sidebar */}
      <Container maxWidth="xl" className={styles.sidebarContainer}>
        <Grid container spacing={3}>
          <Grid size={{xs:12,md:8}}></Grid>
          <Grid size={{xs:12,md:4}}>
            {/* Event Calendar */}
            <Paper className={styles.eventCalendarCard}>
              <div className={styles.calendarHeader}>
                <h3 className={styles.sidebarTitle}>
                  <Calendar size={18} /> Event Calendar
                </h3>
                <div className={styles.navActions}>
                  <button onClick={prevMonth} className={styles.navBtn}>
                    <ChevronLeft size={16} />
                  </button>
                  <span className={styles.currentMonth}>
                    {monthNames[selectedMonth]} {selectedYear}
                  </span>
                  <button onClick={nextMonth} className={styles.navBtn}>
                    <ChevronRight size={16} />
                  </button>
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

            {/* Performance */}
            <Paper className={styles.monthlyTracker}>
              <div className={styles.trackerHeader}>
                <h3>Performance</h3>
                <div className={styles.filterGroup}>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className={styles.filterSelect}
                  >
                    {monthNames.map((m, i) => <option key={i} value={i}>{m.slice(0, 3)}</option>)}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className={styles.filterSelect}
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.trackerContent}>
                <div className={styles.progressCircle}>
                  <svg viewBox="0 0 36 36" className={styles.circularChart}>
                    <path
                      className={styles.circleBg}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="var(--color-border)"
                      strokeWidth="3"
                    />
                    <path
                      className={styles.circle}
                      stroke="var(--color-accent)"
                      strokeDasharray={`${performanceValue}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeWidth="3"
                    />
                    <text x="18" y="20.35" className={styles.percentage} textAnchor="middle">
                      {performanceValue}%
                    </text>
                  </svg>
                </div>
                <div className={styles.trackerStats}>
                  <div className={styles.statMini}>
                    <span>Goals</span>
                    <strong>{Math.floor(performanceValue / 6)}/16</strong>
                  </div>
                  <div className={styles.statMini}>
                    <span>Hours</span>
                    <strong>{performanceValue}h</strong>
                  </div>
                </div>
              </div>
            </Paper>

            {/* Upcoming Quizzes */}
            <Paper className={styles.activitySection}>
              <h3 className={styles.sectionHeader}>Upcoming Quizzes</h3>
              {dummyDashboardData.upcomingQuizzes.map((quiz) => (
                <div key={quiz.id} className={styles.quizCard}>
                  <div className={styles.dateBadge}>
                    <span className={styles.month}>
                      {new Date(quiz.date).toLocaleString("default", { month: "short" }).toUpperCase()}
                    </span>
                    <strong className={styles.day}>{new Date(quiz.date).getDate()}</strong>
                  </div>
                  <div className={styles.quizInfo}>
                    <h4>{quiz.title}</h4>
                    <div className={styles.quizMeta}>
                      <span>{quiz.time}</span>
                      <span className={styles.separator}>•</span>
                      <span>{quiz.duration}</span>
                    </div>
                  </div>
                  <div className={styles.arrowIcon}>
                    <ChevronRight size={18} />
                  </div>
                </div>
              ))}
            </Paper>

            {/* Skills Acquired */}
            <Paper className={styles.skillsSection}>
              <div className={styles.skillsHeaderWrapper}>
                <h3>Skills Acquired</h3>
                <span className={styles.skillCount}>{skills.length}/{totalSkills}</span>
              </div>
              <div className={styles.pillsContainer}>
                {skills.slice(0, 5).map((skill) => (
                  <div key={skill} className={styles.skillPill}>
                    <CheckCircle2 size={14} className={styles.checkIcon} />
                    {skill}
                  </div>
                ))}
                {skills.length > 5 && (
                  <div className={`${styles.skillPill} ${styles.morePill}`}>
                    +{skills.length - 5} More
                  </div>
                )}
              </div>
              <div className={styles.skillProgressBar}>
                <div
                  className={styles.skillProgressFill}
                  style={{ width: `${(skills.length / totalSkills) * 100}%` }}
                />
              </div>
            </Paper>

            {/* Attendance */}
            <Paper className={`${styles.bentoCard} ${styles.attendanceCard}`}>
              <div className={styles.cardHeader}>
                <h4>My Attendance</h4>
              </div>
              <div className={styles.attendanceBody}>
                <div className={styles.circularProgress}>
                  <span className={styles.progressValue}>{attendancePercent}%</span>
                </div>
                <div className={styles.attendanceInfo}>
                  <p>Total Classes: <strong>{dummyDashboardData.attendance.totalClasses}</strong></p>
                  <p>Present: <strong>{dummyDashboardData.attendance.present}</strong></p>
                </div>
              </div>
              <p className={styles.statusText}>
                {attendancePercent >= 75 ? "✅ Good Standing" : "⚠️ Low Attendance"}
              </p>
            </Paper>

            {/* Top Performers */}
            <Paper className={styles.leaderboardCard}>
              <h3>Top Performers</h3>
              <div className={styles.leaderList}>
                {dummyDashboardData.topPerformers.map((user, idx) => (
                  <div key={idx} className={styles.leaderItem}>
                    <span className={styles.rank}>#{idx + 1}</span>
                    <span className={styles.userName}>{user.name}</span>
                    <span className={styles.userScore}>{user.score} XP</span>
                  </div>
                ))}
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Event Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>
          {events[`${selectedYear}-${selectedMonth + 1}-${selectedDate}`] ? "Edit Event" : "Add Event"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
            placeholder="What's happening?"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={saveEvent} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}