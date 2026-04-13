"use client";

import React from "react";
import { Box, Typography, Stack, Tooltip } from "@mui/material";
import styles from "@/styles/ActivityBarChart.module.css";

interface ActivityBarChartProps {
  activity: number[];
}

export default function ActivityBarChart({ activity }: ActivityBarChartProps) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <Box className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Study Productivity
      </Typography>

      <Stack className={styles.barStack}>
        {activity.map((val, i) => (
          <Box key={i} className={styles.barWrapper}>
            <Tooltip title={`${val} hours`} arrow>
              <Box
                className={styles.bar}
                style={{
                  height: `${val}%`,
                  opacity: 0.6 + val / 150,
                }}
              />
            </Tooltip>
            <Typography variant="caption" className={styles.dayLabel}>
              {days[i]}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}