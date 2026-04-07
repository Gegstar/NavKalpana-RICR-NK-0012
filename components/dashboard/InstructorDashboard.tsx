"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  BookOpen,
  Users,
  Star,
  DollarSign,
  TrendingUp,
  PlusCircle,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "@/styles/InstructorDashboard.module.css";

// Dummy data
const instructorStats = {
  totalCourses: 8,
  totalStudents: 1245,
  averageRating: 4.8,
  totalEarnings: 28450,
  monthlyGrowth: 12,
};

const recentCourses = [
  { id: 1, title: "React Masterclass", students: 320, progress: 75, revenue: 8900 },
  { id: 2, title: "Node.js API Design", students: 245, progress: 60, revenue: 6100 },
  { id: 3, title: "UI/UX Fundamentals", students: 180, progress: 45, revenue: 4500 },
];

const recentSubmissions = [
  { id: 1, student: "Alice Johnson", course: "React Masterclass", assignment: "Project 1", submittedAt: "2025-04-05", status: "pending" },
  { id: 2, student: "Bob Smith", course: "Node.js API Design", assignment: "Auth Module", submittedAt: "2025-04-04", status: "graded" },
  { id: 3, student: "Carol Davis", course: "UI/UX Fundamentals", assignment: "Wireframe", submittedAt: "2025-04-03", status: "pending" },
];

const enrollmentData = [
  { month: "Jan", enrollments: 45 },
  { month: "Feb", enrollments: 52 },
  { month: "Mar", enrollments: 61 },
  { month: "Apr", enrollments: 78 },
  { month: "May", enrollments: 85 },
  { month: "Jun", enrollments: 92 },
];

export default function InstructorDashboard() {
  const router = useRouter();

  return (
    <Box className={styles.dashboardWrapper}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box className={styles.header}>
          <Typography variant="h4" className={styles.title}>
            Instructor Dashboard 👨‍🏫
          </Typography>
          <Typography variant="body2" className={styles.subtitle}>
            Welcome back! Here's your teaching performance.
          </Typography>
        </Box>

        {/* Stats Cards – updated to MUI v6 Grid syntax */}
        <Grid container spacing={3} className={styles.statsGrid}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className={styles.statCard}>
              <BookOpen className={styles.statIcon} />
              <Typography variant="h3">{instructorStats.totalCourses}</Typography>
              <Typography variant="body2">Total Courses</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className={styles.statCard}>
              <Users className={styles.statIcon} />
              <Typography variant="h3">{instructorStats.totalStudents}</Typography>
              <Typography variant="body2">Enrolled Students</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className={styles.statCard}>
              <Star className={styles.statIcon} />
              <Typography variant="h3">{instructorStats.averageRating}</Typography>
              <Typography variant="body2">Avg. Rating</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className={styles.statCard}>
              <DollarSign className={styles.statIcon} />
              <Typography variant="h3">${instructorStats.totalEarnings}</Typography>
              <Typography variant="body2">Total Earnings</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Growth Banner */}
        <Paper className={styles.growthCard}>
          <Box className={styles.growthContent}>
            <TrendingUp size={32} />
            <Box>
              <Typography variant="h6">Monthly Growth</Typography>
              <Typography variant="h4">+{instructorStats.monthlyGrowth}%</Typography>
            </Box>
          </Box>
          <Typography variant="body2">
            Compared to last month, your student enrollments increased by {instructorStats.monthlyGrowth}%.
          </Typography>
        </Paper>

        {/* Recent Courses & Performance Chart */}
        <Grid container spacing={3} className={styles.middleRow}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper className={styles.sectionCard}>
              <Typography variant="h6" gutterBottom>
                Recent Courses
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Course</TableCell>
                      <TableCell>Students</TableCell>
                      <TableCell>Progress</TableCell>
                      <TableCell>Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>{course.title}</TableCell>
                        <TableCell>{course.students}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={course.progress}
                              sx={{ width: 80, height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="caption">{course.progress}%</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>${course.revenue}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                variant="outlined"
                size="small"
                sx={{ mt: 2 }}
                onClick={() => router.push("/instructor/courses")}
              >
                View All Courses
              </Button>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper className={styles.sectionCard}>
              <Typography variant="h6" gutterBottom>
                Enrollment Trend
              </Typography>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="enrollments"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-primary)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Submissions */}
        <Paper className={styles.sectionCard}>
          <Typography variant="h6" gutterBottom>
            Pending Submissions
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Assignment</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentSubmissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.student}</TableCell>
                    <TableCell>{sub.course}</TableCell>
                    <TableCell>{sub.assignment}</TableCell>
                    <TableCell>{new Date(sub.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={sub.status}
                        size="small"
                        color={sub.status === "pending" ? "warning" : "success"}
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined">
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Quick Actions – updated to MUI v6 Grid syntax */}
        <Grid container spacing={2} className={styles.actionsGrid}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<PlusCircle size={18} />}
              onClick={() => router.push("/instructor/courses/new")}
            >
              Create New Course
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Eye size={18} />}
              onClick={() => router.push("/instructor/analytics")}
            >
              View Analytics
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Users size={18} />}
              onClick={() => router.push("/instructor/students")}
            >
              Manage Students
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}