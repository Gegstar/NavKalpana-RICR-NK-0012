"use client";

import React from "react";
import { Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import styles from "@/styles/CompletionMetrics.module.css";

export default function CompletionMetrics() {
  const percentage = 78;

  return (
    <Card className={`${styles.metricsCard} gsap-reveal`}>
      <CardContent className={styles.cardContent}>
        <Typography variant="overline" className={styles.label}>
          Average Course Completion
        </Typography>
        
        <Box className={styles.progressContainer}>
          {/* Background track */}
          <CircularProgress
            variant="determinate"
            value={100}
            size={120}
            thickness={6}
            className={styles.track}
          />
          {/* Active progress */}
          <CircularProgress
            variant="determinate"
            value={percentage}
            size={120}
            thickness={6}
            className={styles.activeProgress}
          />
          <Box className={styles.percentageCenter}>
            <Typography variant="h4" component="div" className={styles.percentageText}>
              {percentage}%
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" className={styles.subText}>
          Students are completing <span className={styles.highlight}>15% more</span> assignments than last week.
        </Typography>
      </CardContent>
    </Card>
  );
}
