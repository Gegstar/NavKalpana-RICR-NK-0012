"use client";

import React from "react";
import { Clock, AlertCircle } from "lucide-react";
import styles from "@/styles/StudentDashboard.module.css";

interface Deadline {
  id: number;
  title: string;
  displayTitle?: string;
  dueDate?: string;
  urgency?: "critical" | "high" | "medium" | "low";
}

const urgencyConfig = {
  critical: { label: "Today",    color: "#DC2626", bg: "rgba(220, 38, 38, 0.08)" },
  high:     { label: "Tomorrow", color: "#D97706", bg: "rgba(217, 119, 6, 0.08)" },
  medium:   { label: "Soon",     color: "#6366F1", bg: "rgba(99, 102, 241, 0.08)" },
  low:      { label: "Later",    color: "#64748B", bg: "rgba(100, 116, 139, 0.08)" },
};

export default function DeadlineList({ deadlines }: { deadlines: Deadline[] }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className={styles.deadlineHeader}>
        <Clock size={20} color="var(--primary-yellow)" />
        <h3>Upcoming Deadlines</h3>
        <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>
          {deadlines.length} tasks
        </span>
      </div>

      <div className={styles.deadlineList}>
        {deadlines.length > 0 ? (
          deadlines.map((item) => {
            const cfg = urgencyConfig[item.urgency ?? "low"];
            return (
              <div key={item.id} className={styles.deadlineItem}>
                <div
                  className={styles.deadlineIcon}
                  style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.color + "33" }}
                >
                  <AlertCircle size={16} />
                </div>

                <div className={styles.deadlineInfo}>
                  <h4>{item.displayTitle || item.title}</h4>
                  <p>{item.dueDate ?? "Upcoming"}</p>
                </div>

                <span
                  className={styles.urgencyBadge}
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {cfg.label}
                </span>
              </div>
            );
          })
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
            }}
          >
            🎉 All caught up!
          </div>
        )}
      </div>
    </div>
  );
}
