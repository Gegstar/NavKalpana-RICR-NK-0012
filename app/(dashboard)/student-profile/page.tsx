'use client';
import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  Button,
  TextField,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  LinearProgress,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  School,
  EmojiEvents,
  Timeline,
  CheckCircle,
} from '@mui/icons-material';
import styles from '@/styles/StudentProfile.module.css';

// Dummy data – replace with API call
const dummyStudent = {
  id: 1,
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  bio: 'Passionate learner interested in web development, AI, and UI/UX. Always eager to learn new technologies.',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  joinDate: '2025-01-15',
  stats: {
    totalCourses: 4,
    completedCourses: 2,
    totalHours: 128,
    streak: 12,
    certificates: 2,
  },
  enrolledCourses: [
    { id: 1, title: 'Complete Web Development Bootcamp', progress: 75, instructor: 'Dr. Sarah Chen' },
    { id: 2, title: 'Data Science & Machine Learning', progress: 45, instructor: 'Prof. James Wilson' },
    { id: 3, title: 'UI/UX Design Masterclass', progress: 90, instructor: 'Emily Rodriguez' },
  ],
  achievements: [
    { id: 1, title: 'First Course Completed', icon: '🏆', date: '2025-02-10' },
    { id: 2, title: '7-Day Learning Streak', icon: '🔥', date: '2025-03-01' },
    { id: 3, title: 'Quiz Master', icon: '📝', date: '2025-03-15' },
  ],
};

export default function StudentProfile() {
  const [profile, setProfile] = useState(dummyStudent);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    email: profile.email,
    bio: profile.bio,
  });
  const [tabValue, setTabValue] = useState(0);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setProfile({
      ...profile,
      name: editForm.name,
      email: editForm.email,
      bio: editForm.bio,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: profile.name,
      email: profile.email,
      bio: profile.bio,
    });
    setIsEditing(false);
  };

  return (
    <Box className={styles.container}>
      <Container maxWidth="lg">
        <Paper className={styles.paper}>
          {/* Header with Avatar and Basic Info */}
          <Box className={styles.header}>
            <Avatar src={profile.avatar} className={styles.avatar} />
            <Box className={styles.headerInfo}>
              {isEditing ? (
                <TextField
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  variant="outlined"
                  size="small"
                  className={styles.editName}
                />
              ) : (
                <Typography variant="h4">{profile.name}</Typography>
              )}
              {isEditing ? (
                <TextField
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  variant="outlined"
                  size="small"
                  className={styles.editEmail}
                />
              ) : (
                <Typography variant="subtitle1" color="text.secondary">
                  {profile.email}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Member since {new Date(profile.joinDate).toLocaleDateString()}
              </Typography>
            </Box>
            <IconButton
              className={styles.editBtn}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              color="primary"
            >
              {isEditing ? <Save /> : <Edit />}
            </IconButton>
            {isEditing && (
              <IconButton className={styles.editBtn} onClick={handleCancel} color="error">
                <Cancel />
              </IconButton>
            )}
          </Box>

          <Divider />

          {/* Stats Cards – updated to MUI v6 Grid syntax */}
          <Grid container spacing={3} className={styles.statsGrid}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper className={styles.statCard}>
                <Typography variant="h4">{profile.stats.totalCourses}</Typography>
                <Typography variant="body2">Enrolled</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper className={styles.statCard}>
                <CheckCircle className={styles.statIcon} />
                <Typography variant="h4">{profile.stats.completedCourses}</Typography>
                <Typography variant="body2">Completed</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper className={styles.statCard}>
                <Timeline className={styles.statIcon} />
                <Typography variant="h4">{profile.stats.totalHours}</Typography>
                <Typography variant="body2">Hours Learned</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper className={styles.statCard}>
                <EmojiEvents className={styles.statIcon} />
                <Typography variant="h4">{profile.stats.certificates}</Typography>
                <Typography variant="body2">Certificates</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Bio */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              About Me
            </Typography>
            {isEditing ? (
              <TextField
                name="bio"
                value={editForm.bio}
                onChange={handleEditChange}
                multiline
                rows={3}
                fullWidth
                variant="outlined"
              />
            ) : (
              <Typography variant="body1" className={styles.bio}>
                {profile.bio}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Tabs */}
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="My Courses" />
            <Tab label="Achievements" />
          </Tabs>

          <Box sx={{ mt: 3 }}>
            {tabValue === 0 && (
              <Grid container spacing={2}>
                {profile.enrolledCourses.map((course) => (
                  <Grid size={{ xs: 12 }} key={course.id}>
                    <Paper className={styles.courseCard}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {course.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {course.instructor}
                          </Typography>
                        </Box>
                        <Box className={styles.courseProgress}>
                          <Typography variant="body2" className={styles.progressPercent}>
                            {course.progress}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={course.progress}
                            className={styles.progressBar}
                          />
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}

            {tabValue === 1 && (
              <Grid container spacing={2}>
                {profile.achievements.map((achievement) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={achievement.id}>
                    <Paper className={styles.achievementCard}>
                      <Typography variant="h2" className={styles.achievementIcon}>
                        {achievement.icon}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {achievement.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Earned on {new Date(achievement.date).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}