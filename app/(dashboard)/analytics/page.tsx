'use client';
import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  School,
  AttachMoney,
  People,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import styles from '@/styles/Analytics.module.css';

// Dummy data
const userGrowthData = [
  { month: 'Jan', users: 1240 },
  { month: 'Feb', users: 1450 },
  { month: 'Mar', users: 1680 },
  { month: 'Apr', users: 1920 },
  { month: 'May', users: 2250 },
  { month: 'Jun', users: 2840 },
];

const enrollmentData = [
  { month: 'Jan', enrollments: 145 },
  { month: 'Feb', enrollments: 162 },
  { month: 'Mar', enrollments: 189 },
  { month: 'Apr', enrollments: 210 },
  { month: 'May', enrollments: 245 },
  { month: 'Jun', enrollments: 278 },
];

const revenueData = [
  { month: 'Jan', revenue: 14500 },
  { month: 'Feb', revenue: 16200 },
  { month: 'Mar', revenue: 18900 },
  { month: 'Apr', revenue: 21000 },
  { month: 'May', revenue: 24500 },
  { month: 'Jun', revenue: 28450 },
];

const categoryDistribution = [
  { name: 'Development', value: 45, color: '#6366F1' },
  { name: 'Data Science', value: 25, color: '#06B6D4' },
  { name: 'Design', value: 15, color: '#F59E0B' },
  { name: 'Business', value: 10, color: '#10B981' },
  { name: 'Marketing', value: 5, color: '#EF4444' },
];

const topCourses = [
  { id: 1, title: 'React Masterclass', students: 320, revenue: 15900, growth: 12 },
  { id: 2, title: 'Node.js API Design', students: 245, revenue: 12250, growth: 8 },
  { id: 3, title: 'UI/UX Fundamentals', students: 180, revenue: 9000, growth: 15 },
  { id: 4, title: 'Python for Data Science', students: 210, revenue: 10500, growth: 10 },
];

const summaryStats = {
  totalUsers: 2840,
  userGrowth: 18,
  totalCourses: 85,
  courseGrowth: 12,
  totalRevenue: 284500,
  revenueGrowth: 22,
  totalEnrollments: 1450,
  enrollmentGrowth: 15,
};

export default function Analytics() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <Box className={styles.container}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box className={styles.header}>
          <Typography variant="h4" className={styles.title}>
            Analytics Dashboard
          </Typography>
          <Typography variant="body2" className={styles.subtitle}>
            Platform performance and insights
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} className={styles.summaryGrid}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className={styles.summaryCard}>
              <Box className={styles.summaryIcon}>
                <People />
              </Box>
              <Box>
                <Typography variant="h3">{summaryStats.totalUsers.toLocaleString()}</Typography>
                <Typography variant="body2">Total Users</Typography>
                <Chip
                  icon={<TrendingUp />}
                  label={`+${summaryStats.userGrowth}%`}
                  size="small"
                  color="success"
                  className={styles.growthChip}
                />
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className={styles.summaryCard}>
              <Box className={styles.summaryIcon}>
                
              </Box>
              <Box>
                <Typography variant="h3">{summaryStats.totalCourses}</Typography>
                <Typography variant="body2">Total Courses</Typography>
                <Chip
                  icon={<TrendingUp />}
                  label={`+${summaryStats.courseGrowth}%`}
                  size="small"
                  color="success"
                  className={styles.growthChip}
                />
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className={styles.summaryCard}>
              <Box className={styles.summaryIcon}>
                <AttachMoney />
              </Box>
              <Box>
                <Typography variant="h3">{formatCurrency(summaryStats.totalRevenue)}</Typography>
                <Typography variant="body2">Revenue</Typography>
                <Chip
                  icon={<TrendingUp />}
                  label={`+${summaryStats.revenueGrowth}%`}
                  size="small"
                  color="success"
                  className={styles.growthChip}
                />
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper className={styles.summaryCard}>
              <Box className={styles.summaryIcon}>
                <School />
              </Box>
              <Box>
                <Typography variant="h3">{summaryStats.totalEnrollments.toLocaleString()}</Typography>
                <Typography variant="body2">Enrollments</Typography>
                <Chip
                  icon={<TrendingUp />}
                  label={`+${summaryStats.enrollmentGrowth}%`}
                  size="small"
                  color="success"
                  className={styles.growthChip}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Charts Row 1 */}
        <Grid container spacing={3} className={styles.chartsRow}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper className={styles.chartCard}>
              <Typography variant="h6" gutterBottom>
                User Growth
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="var(--color-primary)"
                      fill="var(--color-primary)"
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper className={styles.chartCard}>
              <Typography variant="h6" gutterBottom>
                Monthly Enrollments
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="enrollments" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Charts Row 2 */}
        <Grid container spacing={3} className={styles.chartsRow}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper className={styles.chartCard}>
              <Typography variant="h6" gutterBottom>
                Revenue Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
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
                Course Distribution by Category
              </Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {categoryDistribution.map((entry, index) => (
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
        <Paper className={styles.tableCard}>
          <Typography variant="h6" gutterBottom>
            Top Performing Courses
          </Typography>
          <Grid container spacing={2}>
            {topCourses.map((course) => (
              <Grid size={{ xs: 12, md: 6 }} key={course.id}>
                <Card className={styles.courseCard}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {course.title}
                    </Typography>
                    <Box className={styles.courseStats}>
                      <Typography variant="body2">
                        Students: {course.students}
                      </Typography>
                      <Typography variant="body2">
                        Revenue: {formatCurrency(course.revenue)}
                      </Typography>
                      <Chip
                        icon={<TrendingUp />}
                        label={`+${course.growth}%`}
                        size="small"
                        color="success"
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(course.students / 350) * 100}
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}