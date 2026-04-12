"use client";

import React from "react";
import { Box, Typography, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import styles from "@/styles/GreetingSection.module.css";

export default function GreetingSection() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Box className={`${styles.greetingContainer} gsap-reveal`}>
      <Box>
        <Typography variant="h3" className={styles.title}>
          {getGreeting()}, Professor
        </Typography>
        <Typography variant="body1" className={styles.subText}>
          Welcome back! Here's what's happening in your digital classroom today.
        </Typography>
      </Box>

      <Fab
        color="primary"
        variant="extended"
        size="large"
        className={styles.createButton}
      >
        <AddIcon className={styles.addIcon} />
        Create New Course
      </Fab>
    </Box>
  );
}
