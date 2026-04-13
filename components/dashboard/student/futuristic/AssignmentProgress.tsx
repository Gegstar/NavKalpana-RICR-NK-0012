"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Target, ChevronRight } from "lucide-react";
import styles from "@/styles/AssignmentProgress.module.css";

interface AssignmentProgressProps {
  completed: number;
  total: number;
  onViewAll?: () => void;
}

export default function AssignmentProgress({ 
  completed, 
  total, 
  onViewAll 
}: AssignmentProgressProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Box className={styles.container}>
      <Target size={32} className={styles.icon} />
      
      <Typography variant="h3" className={styles.count}>
        {completed} / {total}
      </Typography>
      
      <Typography variant="body2" className={styles.label}>
        Assignments Completed
      </Typography>

      <Box className={styles.progressWrapper}>
        <Box className={styles.progressBar}>
          <Box 
            className={styles.progressFill} 
            style={{ '--progress': `${percentage}%` } as React.CSSProperties}
          />
        </Box>
        <Button className={styles.detailsButton}>
          Details
        </Button>
      </Box>

      <Button
        variant="text"
        size="small"
        className={styles.viewLink}
        endIcon={<ChevronRight size={16} />}
        onClick={onViewAll}
      >
        View Assignments
      </Button>
    </Box>
  );
}