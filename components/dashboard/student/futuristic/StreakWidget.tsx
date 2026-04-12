"use client";

import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { Flame } from "lucide-react";
import styles from "@/styles/StudentDashboard.module.css";

interface StreakWidgetProps {
  days: number;
}

export default function StreakWidget({ days }: StreakWidgetProps) {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Flame size={32} color="var(--color-accent)" fill="var(--color-accent)" />
        <Typography 
          variant="caption" 
          sx={{ 
            bgcolor: 'var(--bg-light)', 
            px: 1, 
            py: 0.5, 
            borderRadius: 1, 
            color: 'var(--text-secondary)',
            fontWeight: 'bold'
          }}
        >
          ACTIVE
        </Typography>
      </Stack>
      <Typography variant="h3" fontWeight="bold">{days} Days</Typography>
      <Typography variant="body2" color="text.secondary">Learning Streak</Typography>
    </Box>
  );
}