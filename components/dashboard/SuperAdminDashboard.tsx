"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
} from "@mui/material";
import {
  Users,
  Building,
  BookOpen,
  DollarSign,
  TrendingUp,
} from "lucide-react"; // reuse styles
import styles from '@/styles/SuperAdminDashboard.module.css';

// ✅ Dummy Admin Data
const adminData = {
  totalUsers: 1250,
  totalStudents: 980,
  totalAdmins: 45,
  totalInstructors: 60,
  totalBusinessUnits: 12,
  totalCourses: 85,
  revenue: 125000,
  growth: 18,
  recentUsers: [
    { name: "Rahul Sharma", role: "Student" },
    { name: "Amit Das", role: "Instructor" },
    { name: "Priya Singh", role: "Admin" },
  ],
  businessUnits: [
    { name: "Tech Academy", users: 320 },
    { name: "Skill Hub", users: 210 },
    { name: "Dev Institute", users: 150 },
  ],
};

export default function SuperAdminDashboard() {
  return (
    <Box className={styles.dashboardWrapper}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box className={styles.header}>
          <Typography variant="h4">
            Super Admin Dashboard 🚀
          </Typography>
          <Typography variant="body2">
            Manage entire platform from here
          </Typography>
        </Box>

        {/* Top Stats */}
        <Grid container spacing={3}>
          {/* Total Users */}
          <Grid  size={{xs:12,md:3}}>
            <Paper className={styles.bentoCard}>
              <Users size={32} />
              <Typography variant="h4">{adminData.totalUsers}</Typography>
              <Typography>Total Users</Typography>
            </Paper>
          </Grid>

          {/* Business Units */}
          <Grid  size={{xs:12,md:3}}>
            <Paper className={styles.bentoCard}>
              <Building size={32} />
              <Typography variant="h4">
                {adminData.totalBusinessUnits}
              </Typography>
              <Typography>Business Units</Typography>
            </Paper>
          </Grid>

          {/* Courses */}
          <Grid  size={{xs:12,md:3}}>
            <Paper className={styles.bentoCard}>
              <BookOpen size={32} />
              <Typography variant="h4">
                {adminData.totalCourses}
              </Typography>
              <Typography>Courses</Typography>
            </Paper>
          </Grid>

          {/* Revenue */}
          <Grid  size={{xs:12,md:3}}>
            <Paper className={styles.bentoCard}>
              <DollarSign size={32} />
              <Typography variant="h4">
                ₹{adminData.revenue}
              </Typography>
              <Typography>Revenue</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Growth */}
        <Paper className={styles.continueCard} sx={{ mt: 3 }}>
          <Typography variant="h5">
            Platform Growth 📈
          </Typography>
          <Typography variant="h3">
            +{adminData.growth}%
          </Typography>
          <Typography>This month growth</Typography>
        </Paper>

        {/* Users Breakdown */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid  size={{xs:12,md:3}}>
            <Paper className={styles.activitySection}>
              <Typography variant="h6">
                User Distribution
              </Typography>
              <p>Students: {adminData.totalStudents}</p>
              <p>Admins: {adminData.totalAdmins}</p>
              <p>Instructors: {adminData.totalInstructors}</p>
            </Paper>
          </Grid>

          {/* Recent Users */}
          <Grid  size={{xs:12,md:3}}>
            <Paper className={styles.activitySection}>
              <Typography variant="h6">
                Recent Users
              </Typography>

              {adminData.recentUsers.map((user, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                  }}
                >
                  <span>{user.name}</span>
                  <span>{user.role}</span>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>

        {/* Business Units */}
        <Paper className={styles.coursesSection} sx={{ mt: 3 }}>
          <Typography variant="h6">
            Business Units
          </Typography>

          {adminData.businessUnits.map((bu, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <span>{bu.name}</span>
              <span>{bu.users} users</span>
            </Box>
          ))}
        </Paper>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid  size={{xs:12,md:4}}>
            <Button fullWidth variant="contained">
              Manage Users
            </Button>
          </Grid>

          <Grid size={{xs:12,md:4}}>
            <Button fullWidth variant="outlined">
              Manage Courses
            </Button>
          </Grid>

          <Grid size={{xs:12,md:4}}>
            <Button fullWidth variant="outlined">
              Settings
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}