'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
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
  IconButton,
} from '@mui/material';
import {
  People,
  School,
  MonetizationOn,
  TrendingUp,
  MoreVert,
  Visibility,
  Block,
  CheckCircle,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import styles from '@/styles/AdminDashboard.module.css';

// Dummy data
const adminStats = {
  totalUsers: 2840,
  totalStudents: 2450,
  totalInstructors: 60,
  totalAdmins: 5,
  totalCourses: 85,
  totalRevenue: 284500,
  monthlyGrowth: 12,
  activeUsers: 320,
};

const userDistribution = [
  { name: 'Students', value: 2450, color: '#6366F1' },
  { name: 'Instructors', value: 60, color: '#06B6D4' },
  { name: 'Admins', value: 5, color: '#F59E0B' },
];

const monthlyEnrollments = [
  { month: 'Jan', enrollments: 145 },
  { month: 'Feb', enrollments: 162 },
  { month: 'Mar', enrollments: 189 },
  { month: 'Apr', enrollments: 210 },
  { month: 'May', enrollments: 245 },
  { month: 'Jun', enrollments: 278 },
];

const topCourses = [
  { id: 1, title: 'React Masterclass', students: 320, revenue: 15900, rating: 4.8 },
  { id: 2, title: 'Node.js API Design', students: 245, revenue: 12250, rating: 4.7 },
  { id: 3, title: 'UI/UX Fundamentals', students: 180, revenue: 9000, rating: 4.6 },
  { id: 4, title: 'Python for Data Science', students: 210, revenue: 10500, rating: 4.9 },
];

const recentActivities = [
  { id: 1, user: 'Alice Johnson', action: 'Enrolled in React Masterclass', timestamp: '2025-04-07T10:30:00', type: 'enrollment' },
  { id: 2, user: 'Bob Smith', action: 'Completed Node.js API Design', timestamp: '2025-04-07T09:15:00', type: 'completion' },
  { id: 3, user: 'Carol Davis', action: 'Submitted assignment', timestamp: '2025-04-06T14:45:00', type: 'submission' },
  { id: 4, user: 'David Wilson', action: 'New instructor registered', timestamp: '2025-04-06T11:20:00', type: 'registration' },
];

const pendingInstructors = [
  { id: 1, name: 'Dr. Emily Chen', email: 'emily@example.com', expertise: 'Machine Learning', appliedAt: '2025-04-05' },
  { id: 2, name: 'Prof. Michael Lee', email: 'michael@example.com', expertise: 'Cloud Computing', appliedAt: '2025-04-04' },
];

export default function AdminDashboard() {
  const router = useRouter();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <Box className={styles.container}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box className={styles.header}>
          <Typography variant="h4" className={styles.title}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" className={styles.subtitle}>
            Welcome back! Here's your platform overview.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} className={styles.statsGrid}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className={styles.statCard}>
              <People className={styles.statIcon} />
              <Typography variant="h3">{adminStats.totalUsers.toLocaleString()}</Typography>
              <Typography variant="body2">Total Users</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className={styles.statCard}>
              <School className={styles.statIcon} />
              <Typography variant="h3">{adminStats.totalCourses}</Typography>
              <Typography variant="body2">Total Courses</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className={styles.statCard}>
              <Typography variant="h3">{adminStats.totalStudents.toLocaleString()}</Typography>
              <Typography variant="body2">Students</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className={styles.statCard}>
              <MonetizationOn className={styles.statIcon} />
              <Typography variant="h3">{formatCurrency(adminStats.totalRevenue)}</Typography>
              <Typography variant="body2">Revenue</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Growth Banner */}
        <Paper className={styles.growthCard}>
          <Box className={styles.growthContent}>
            <TrendingUp className={styles.growthIcon} />
            <Box>
              <Typography variant="h6">Monthly Growth</Typography>
              <Typography variant="h4">+{adminStats.monthlyGrowth}%</Typography>
            </Box>
          </Box>
          <Typography variant="body2">
            Platform activity increased by {adminStats.monthlyGrowth}% compared to last month.
          </Typography>
        </Paper>

        {/* Charts Row */}
        <Grid container spacing={3} className={styles.chartsRow}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper className={styles.chartCard}>
              <Typography variant="h6" gutterBottom>
                Enrollment Trends
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyEnrollments}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="enrollments"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      dot={{ fill: 'var(--color-primary)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper className={styles.chartCard}>
              <Typography variant="h6" gutterBottom>
                User Distribution
              </Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {userDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Top Courses Table */}
        <Paper className={styles.sectionCard}>
          <Box className={styles.sectionHeader}>
            <Typography variant="h6">Top Performing Courses</Typography>
            <Button size="small" onClick={() => router.push('/admin/courses')}>
              View All
            </Button>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Course</TableCell>
                  <TableCell>Students</TableCell>
                  <TableCell>Revenue</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.students}</TableCell>
                    <TableCell>{formatCurrency(course.revenue)}</TableCell>
                    <TableCell>
                      <Chip label={course.rating} size="small" color="warning" />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => router.push(`/admin/courses/${course.id}`)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Recent Activity & Pending Approvals */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper className={styles.sectionCard}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Box className={styles.activityList}>
                {recentActivities.map((activity) => (
                  <Box key={activity.id} className={styles.activityItem}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      {activity.user.charAt(0)}
                    </Avatar>
                    <Box className={styles.activityContent}>
                      <Typography variant="body2">
                        <strong>{activity.user}</strong> {activity.action}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimeAgo(activity.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper className={styles.sectionCard}>
              <Typography variant="h6" gutterBottom>
                Pending Instructor Approvals
              </Typography>
              {pendingInstructors.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No pending approvals
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Expertise</TableCell>
                        <TableCell>Applied</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingInstructors.map((instructor) => (
                        <TableRow key={instructor.id}>
                          <TableCell>{instructor.name}</TableCell>
                          <TableCell>{instructor.expertise}</TableCell>
                          <TableCell>{formatDate(instructor.appliedAt)}</TableCell>
                          <TableCell>
                            <IconButton size="small" color="success">
                              <CheckCircle fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <Block fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Box className={styles.actionsGrid}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => router.push('/admin/users')}
          >
            Manage Users
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => router.push('/admin/courses')}
          >
            Manage Courses
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => router.push('/admin/analytics')}
          >
            View Analytics
          </Button>
        </Box>
      </Container>
    </Box>
  );
}