"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { Flame } from "lucide-react";
import styles from "@/styles/StreakWidget.module.css";

interface StreakWidgetProps {
  days: number;
}

export default function StreakWidget({ days }: StreakWidgetProps) {
  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Flame size={32} className={styles.flameIcon} />
        <Typography component="span" className={styles.activeBadge}>
          ACTIVE
        </Typography>
      </Box>
      <Typography variant="h3" className={styles.streakCount}>
        {days} Days
      </Typography>
      <Typography variant="body2" className={styles.streakLabel}>
        Learning Streak
      </Typography>
    </Box>
  );
}