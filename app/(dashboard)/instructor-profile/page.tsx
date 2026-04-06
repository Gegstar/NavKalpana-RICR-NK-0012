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
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  LinkedIn,
  Twitter,
  GitHub,
  Email,
  School,
  BookOpen,
  People,
  Star,
} from '@mui/icons-material';
import styles from '@/styles/InstructorProfile.module.css';

// Dummy data – replace with API call
const dummyInstructor = {
  id: 1,
  name: 'Dr. Sarah Chen',
  email: 'sarah.chen@skillverse.com',
  title: 'Senior AI Research Scientist',
  bio: 'Dr. Sarah Chen is a leading AI researcher with over 10 years of experience in machine learning and deep learning. She has published numerous papers and taught thousands of students worldwide.',
  avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  social: {
    linkedin: 'https://linkedin.com/in/sarahchen',
    twitter: 'https://twitter.com/sarahchen',
    github: 'https://github.com/sarahchen',
  },
  stats: {
    totalStudents: 12500,
    totalCourses: 8,
    averageRating: 4.8,
    totalEarnings: 28450,
  },
  courses: [
    { id: 1, title: 'Complete Web Development Bootcamp', students: 3200, rating: 4.9 },
    { id: 2, title: 'Advanced Machine Learning', students: 2100, rating: 4.8 },
    { id: 3, title: 'Deep Learning Fundamentals', students: 1800, rating: 4.7 },
    { id: 4, title: 'Data Science with Python', students: 2500, rating: 4.9 },
  ],
};

export default function InstructorProfile() {
  const [profile, setProfile] = useState(dummyInstructor);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    title: profile.title,
    bio: profile.bio,
    email: profile.email,
    linkedin: profile.social.linkedin,
    twitter: profile.social.twitter,
    github: profile.social.github,
  });
  const [tabValue, setTabValue] = useState(0);
  const [openAvatarDialog, setOpenAvatarDialog] = useState(false);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setProfile({
      ...profile,
      name: editForm.name,
      title: editForm.title,
      bio: editForm.bio,
      email: editForm.email,
      social: {
        linkedin: editForm.linkedin,
        twitter: editForm.twitter,
        github: editForm.github,
      },
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      email: profile.email,
      linkedin: profile.social.linkedin,
      twitter: profile.social.twitter,
      github: profile.social.github,
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
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  variant="outlined"
                  size="small"
                  className={styles.editTitle}
                />
              ) : (
                <Typography variant="subtitle1" color="text.secondary">
                  {profile.title}
                </Typography>
              )}
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

          {/* Stats Cards */}
          <Grid container spacing={3} className={styles.statsGrid}>
            <Grid item xs={6} sm={3}>
              <Paper className={styles.statCard}>
                <People className={styles.statIcon} />
                <Typography variant="h4">{profile.stats.totalStudents.toLocaleString()}</Typography>
                <Typography variant="body2">Students</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper className={styles.statCard}>
                <BookOpen className={styles.statIcon} />
                <Typography variant="h4">{profile.stats.totalCourses}</Typography>
                <Typography variant="body2">Courses</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper className={styles.statCard}>
                <Star className={styles.statIcon} />
                <Typography variant="h4">{profile.stats.averageRating}</Typography>
                <Typography variant="body2">Rating</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper className={styles.statCard}>
                <School className={styles.statIcon} />
                <Typography variant="h4">${profile.stats.totalEarnings.toLocaleString()}</Typography>
                <Typography variant="body2">Earnings</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Bio and Contact Info */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                About
              </Typography>
              {isEditing ? (
                <TextField
                  name="bio"
                  value={editForm.bio}
                  onChange={handleEditChange}
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                />
              ) : (
                <Typography variant="body1" className={styles.bio}>
                  {profile.bio}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Contact
              </Typography>
              <Box className={styles.contactInfo}>
                <Email fontSize="small" />
                {isEditing ? (
                  <TextField
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    size="small"
                    fullWidth
                  />
                ) : (
                  <Typography variant="body2">{profile.email}</Typography>
                )}
              </Box>
              <Box className={styles.socialLinks}>
                {isEditing ? (
                  <>
                    <TextField
                      name="linkedin"
                      label="LinkedIn URL"
                      value={editForm.linkedin}
                      onChange={handleEditChange}
                      size="small"
                      fullWidth
                      margin="dense"
                    />
                    <TextField
                      name="twitter"
                      label="Twitter URL"
                      value={editForm.twitter}
                      onChange={handleEditChange}
                      size="small"
                      fullWidth
                      margin="dense"
                    />
                    <TextField
                      name="github"
                      label="GitHub URL"
                      value={editForm.github}
                      onChange={handleEditChange}
                      size="small"
                      fullWidth
                      margin="dense"
                    />
                  </>
                ) : (
                  <>
                    <IconButton href={profile.social.linkedin} target="_blank">
                      <LinkedIn />
                    </IconButton>
                    <IconButton href={profile.social.twitter} target="_blank">
                      <Twitter />
                    </IconButton>
                    <IconButton href={profile.social.github} target="_blank">
                      <GitHub />
                    </IconButton>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Tabs for Courses */}
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="My Courses" />
            <Tab label="Analytics" />
          </Tabs>

          <Box sx={{ mt: 3 }}>
            {tabValue === 0 && (
              <Grid container spacing={2}>
                {profile.courses.map((course) => (
                  <Grid item xs={12} sm={6} md={4} key={course.id}>
                    <Paper className={styles.courseCard}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {course.title}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" mt={1}>
                        <Chip icon={<People />} label={`${course.students} students`} size="small" />
                        <Chip icon={<Star />} label={`${course.rating}`} size="small" />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
            {tabValue === 1 && (
              <Paper className={styles.analyticsCard}>
                <Typography variant="body1" color="text.secondary">
                  Analytics dashboard coming soon. Here you can view course performance, student engagement, and revenue trends.
                </Typography>
              </Paper>
            )}
          </Box>
        </Paper>
      </Container>

      {/* Avatar Upload Dialog (optional) */}
      <Dialog open={openAvatarDialog} onClose={() => setOpenAvatarDialog(false)}>
        <DialogTitle>Change Profile Picture</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Upload a new avatar (feature coming soon).</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAvatarDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}