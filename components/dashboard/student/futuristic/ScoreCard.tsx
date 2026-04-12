"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { Trophy, TrendingUp } from "lucide-react";
import styles from "@/styles/StudentDashboard.module.css";

interface ScoreCardProps {
  score: number;
  trend: string;
}

export default function ScoreCard({ score, trend }: ScoreCardProps) {
  return (
    <Box className={styles.scoreInfo}>
      <Typography variant="caption" className={styles.label}>Academic Score</Typography>
      <Typography variant="h3" className={styles.yellowText}>
        {score}%
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <TrendingUp size={16} color="var(--color-success)" />
        <Typography variant="caption" className={styles.trendText} sx={{ color: "var(--color-success)" }}>
          {trend} vs last month
        </Typography>
      </Box>
      <Trophy size={48} className={styles.iconBg} style={{ position: 'absolute', right: 20, top: 20 }} />
    </Box>
  );
}
