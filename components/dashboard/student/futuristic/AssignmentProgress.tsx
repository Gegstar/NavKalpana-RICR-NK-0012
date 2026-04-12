"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Target, ChevronRight } from "lucide-react";
import styles from "@/styles/StudentDashboard.module.css";

interface AssignmentProgressProps {
  completed: number;
  total: number;
}

export default function AssignmentProgress({ completed, total }: AssignmentProgressProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Box>
      <Target size={32} color="var(--primary-yellow)" />
      <Typography variant="h3" fontWeight="bold">{completed} / {total}</Typography>
      <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>Assignments Completed</Typography>
      
      <div className={styles.miniProgress}>
        <div 
          className={styles.miniBar} 
          style={{ '--progress': `${percentage}%` } as React.CSSProperties}
        />
        <button className={styles.viewBtn}>
          Details
        </button>
      </div>
      
      <Box sx={{ mt: 2 }}>
        <Button
          variant="text"
          size="small"
          endIcon={<ChevronRight size={16} />}
          sx={{ color: 'var(--primary-yellow)', textTransform: 'none', p: 0, '&:hover': { color: 'var(--primary-yellow-hover)' } }}
        >
          View Assignments
        </Button>
      </Box>
    </Box>
  );
}