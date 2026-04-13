"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { Clock, AlertCircle } from "lucide-react";
import styles from "@/styles/DeadlineList.module.css";

interface Deadline {
  id: number;
  title: string;
  displayTitle?: string;
  dueDate?: string;
  urgency?: "critical" | "high" | "medium" | "low";
}

const urgencyConfig = {
  critical: { label: "Today", color: "#DC2626", bg: "rgba(220, 38, 38, 0.08)", border: "rgba(220, 38, 38, 0.2)" },
  high:     { label: "Tomorrow", color: "#D97706", bg: "rgba(217, 119, 6, 0.08)", border: "rgba(217, 119, 6, 0.2)" },
  medium:   { label: "Soon", color: "#6366F1", bg: "rgba(99, 102, 241, 0.08)", border: "rgba(99, 102, 241, 0.2)" },
  low:      { label: "Later", color: "#64748B", bg: "rgba(100, 116, 139, 0.08)", border: "rgba(100, 116, 139, 0.2)" },
};

export default function DeadlineList({ deadlines }: { deadlines: Deadline[] }) {
  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Clock size={20} className={styles.headerIcon} />
        <Typography component="h3" className={styles.headerTitle}>
          Upcoming Deadlines
        </Typography>
        <Typography component="span" className={styles.taskCount}>
          {deadlines.length} tasks
        </Typography>
      </Box>

      <Box className={styles.list}>
        {deadlines.length > 0 ? (
          deadlines.map((item) => {
            const cfg = urgencyConfig[item.urgency ?? "low"];
            return (
              <Box key={item.id} className={styles.item}>
                <Box
                  className={styles.iconWrapper}
                  style={{
                    '--bg-color': cfg.bg,
                    '--color': cfg.color,
                    '--border-color': cfg.border,
                  } as React.CSSProperties}
                >
                  <AlertCircle size={16} />
                </Box>

                <Box className={styles.info}>
                  <h4>{item.displayTitle || item.title}</h4>
                  <p>{item.dueDate ?? "Upcoming"}</p>
                </Box>

                <Box
                  className={styles.badge}
                  style={{
                    '--bg-color': cfg.bg,
                    '--color': cfg.color,
                  } as React.CSSProperties}
                >
                  {cfg.label}
                </Box>
              </Box>
            );
          })
        ) : (
          <Box className={styles.emptyState}>
            🎉 All caught up!
          </Box>
        )}
      </Box>
    </Box>
  );
}