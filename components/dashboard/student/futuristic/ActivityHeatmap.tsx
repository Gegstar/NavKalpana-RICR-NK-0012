"use client";

import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import styles from "@/styles/ActivityHeatmap.module.css";

interface ActivityHeatmapProps {
  activityData: number[]; // Array of intensity levels
}

export default function ActivityHeatmap({ activityData }: ActivityHeatmapProps) {
  // Generate mock data for 50 weeks
  const heatmapData = Array.from({ length: 50 }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => {
      const idx = weekIndex * 7 + dayIndex;
      const val = activityData?.[idx % activityData.length] ?? 0;
      return Math.floor(val / 25); // 0-4
    })
  );

  // Helper to get CSS class for intensity level
  const getLevelClass = (level: number) => {
    switch (level) {
      case 1: return styles.level1;
      case 2: return styles.level2;
      case 3: return styles.level3;
      case 4: return styles.level4;
      default: return styles.level0;
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h6" className={styles.title}>
          Learning Activity
        </Typography>
        <Typography variant="caption" className={styles.consistency}>
          Yearly consistency: 84%
        </Typography>
      </Box>

      <Box className={styles.heatmapGrid}>
        {heatmapData.map((week, i) => (
          <Box key={i} className={styles.weekColumn}>
            {week.map((level, j) => (
              <Tooltip key={j} title={`Activity Level: ${level}`} arrow>
                <Box className={`${styles.cell} ${getLevelClass(level)}`} />
              </Tooltip>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}