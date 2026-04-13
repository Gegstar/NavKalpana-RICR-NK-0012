"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { Trophy, TrendingUp } from "lucide-react";
import styles from "@/styles/ScoreCard.module.css";

interface ScoreCardProps {
  score: number;
  trend: string;
}

export default function ScoreCard({ score, trend }: ScoreCardProps) {
  return (
    <Box className={styles.scoreInfo}>
      <Typography variant="caption" className={styles.label}>
        Academic Score
      </Typography>
      <Typography variant="h3" className={styles.score}>
        {score}%
      </Typography>
      <Box className={styles.trendWrapper}>
        <TrendingUp size={16} className={styles.trendIcon} />
        <Typography variant="caption" className={styles.trendText}>
          {trend} vs last month
        </Typography>
      </Box>
      <Trophy size={48} className={styles.iconBg} />
    </Box>
  );
}