'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import {
  People,
  Public,
  AccessTime,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styles from '@/styles/LiveUsers.module.css';

// Dummy data – replace with WebSocket/API
const generateDummyUsers = (count: number) => {
  const names = ['Alex Johnson', 'Maria Garcia', 'David Kim', 'Sarah Lee', 'James Wilson', 'Emily Davis', 'Michael Chen', 'Lisa Rodriguez', 'Robert Brown', 'Jennifer Lee'];
  const countries = ['USA', 'India', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Brazil', 'Spain'];
  const pages = ['Dashboard', 'Course Detail', 'Assignment', 'Quiz', 'Profile', 'Settings'];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length] + (Math.floor(i / names.length) + 1),
    avatar: `https://ui-avatars.com/api/?name=${names[i % names.length].charAt(0)}&background=6366F1&color=fff`,
    country: countries[i % countries.length],
    currentPage: pages[Math.floor(Math.random() * pages.length)],
    lastActive: new Date().toISOString(),
  }));
};

const generateActivityData = (points: number) => {
  return Array.from({ length: points }, (_, i) => ({
    time: `${i * 5} min ago`,
    users: Math.floor(Math.random() * 50) + 20,
  })).reverse();
};

export default function LiveUsers() {
  const [activeCount, setActiveCount] = useState(42);
  const [users, setUsers] = useState(generateDummyUsers(12));
  const [activityData, setActivityData] = useState(generateActivityData(12));
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly change active count (±3)
      setActiveCount(prev => Math.max(10, prev + Math.floor(Math.random() * 7) - 3));
      
      // Update users list (add/remove random users)
      setUsers(prev => {
        const newUsers = [...prev];
        if (Math.random() > 0.7 && newUsers.length < 25) {
          // Add a new user
          const newUser = generateDummyUsers(1)[0];
          newUser.name = `New User ${Math.floor(Math.random() * 100)}`;
          newUsers.unshift(newUser);
        } else if (Math.random() > 0.7 && newUsers.length > 5) {
          // Remove a random user
          const removeIndex = Math.floor(Math.random() * newUsers.length);
          newUsers.splice(removeIndex, 1);
        }
        return newUsers.slice(0, 20);
      });

      // Update activity data (shift and add new point)
      setActivityData(prev => {
        const newData = [...prev.slice(1)];
        const lastValue = prev[prev.length - 1]?.users || 30;
        const newValue = Math.max(10, lastValue + Math.floor(Math.random() * 11) - 5);
        newData.push({
          time: `0 min ago`,
          users: newValue,
        });
        // Rename time labels
        return newData.map((point, idx) => ({
          ...point,
          time: `${(newData.length - 1 - idx) * 5} min ago`,
        }));
      });

      setLastUpdated(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  return (
    <Box className={styles.container}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box className={styles.header}>
          <Typography variant="h4" className={styles.title}>
            Live Users
          </Typography>
          <Typography variant="body2" className={styles.subtitle}>
            Real-time active users on the platform
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} className={styles.statsGrid}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper className={styles.statCard}>
              <People className={styles.statIcon} />
              <Typography variant="h2">{activeCount}</Typography>
              <Typography variant="body2">Active Users</Typography>
              <Chip label={`Last updated: ${formatTime(lastUpdated)}`} size="small" className={styles.timestampChip} />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper className={styles.statCard}>
              <AccessTime className={styles.statIcon} />
              <Typography variant="h2">{Math.floor(activeCount * 2.5)}</Typography>
              <Typography variant="body2">Sessions Today</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper className={styles.statCard}>
              <Public className={styles.statIcon} />
              <Typography variant="h2">{Math.floor(activeCount * 0.8)}</Typography>
              <Typography variant="body2">Countries</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Activity Chart */}
        <Paper className={styles.chartCard}>
          <Typography variant="h6" gutterBottom>
            Activity Trend (Last Hour)
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Active Users List */}
        <Paper className={styles.usersCard}>
          <Typography variant="h6" gutterBottom>
            Currently Active Users
          </Typography>
          <List className={styles.userList}>
            {users.map((user, idx) => (
              <React.Fragment key={user.id}>
                <ListItem className={styles.userItem}>
                  <ListItemAvatar>
                    <Avatar src={user.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    secondary={
                      <Box component="span" className={styles.userMeta}>
                        <Chip label={user.country} size="small" variant="outlined" />
                        <Typography variant="caption">Viewing: {user.currentPage}</Typography>
                      </Box>
                    }
                  />
                  <Chip label="Active now" size="small" color="success" />
                </ListItem>
                {idx < users.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Container>
    </Box>
  );
}