'use client';
import { Container, Box, Typography, TextField, Button, Paper } from '@mui/material';
import styles from '@/styles/StudentLogin.module.css';

export default function LoginPage() {
  return (
    <div className={styles.loginContainer}>
      <Paper elevation={3} className={styles.paperCard}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" className={styles.title}>
            Sign In to SkillVerse
          </Typography>
          <Box component="form" noValidate className={styles.form}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              className={styles.inputField}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              className={styles.inputField}
            />
            <Button className={styles.customButton}>
              Sign In
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
}