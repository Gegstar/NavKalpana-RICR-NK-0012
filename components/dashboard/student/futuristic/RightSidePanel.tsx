"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2, ArrowRight } from "lucide-react";
import styles from "@/styles/RightSidePanel.module.css";

export default function RightSidePanel({ data }: { data: any }) {
  const currentDate = new Date();

  // Calculate SVG stroke offset
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const progress = data.academicScore || 75;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <Box className={styles.panel}>
      {/* 📅 Event Calendar */}
      <Box className={styles.eventCalendarCard}>
        <Box className={styles.calendarHeader}>
          <Box className={styles.calendarTitle}>
            <Calendar size={18} className={styles.calendarIcon} />
            <span>Schedule</span>
          </Box>
          <Box className={styles.monthNav}>
            <button className={styles.navButton}>
              <ChevronLeft size={16} />
            </button>
            <span className={styles.currentMonth}>APR 2026</span>
            <button className={styles.navButton}>
              <ChevronRight size={16} />
            </button>
          </Box>
        </Box>

        <Box className={styles.calendarGrid}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className={styles.dayLabel}>{d}</div>
          ))}
          {Array.from({ length: 30 }).map((_, i) => {
            const dayNum = i + 1;
            const hasEvent = [12, 18, 25].includes(dayNum);
            const isToday = dayNum === currentDate.getDate();

            return (
              <div
                key={i}
                className={`${styles.calendarDay} ${isToday ? styles.today : ''}`}
              >
                {dayNum}
                {hasEvent && !isToday && <div className={styles.eventDot} />}
              </div>
            );
          })}
        </Box>
      </Box>

      {/* 📊 Monthly Tracker */}
      <Box className={styles.monthlyTracker}>
        <Typography className={styles.trackerTitle}>Monthly Goals</Typography>
        <Box className={styles.trackerContent}>
          <Box className={styles.circularProgress}>
            <svg className={styles.progressSvg} viewBox="0 0 80 80">
              <circle className={styles.progressCircleBg} cx="40" cy="40" r={radius} />
              <circle
                className={styles.progressCircleFill}
                cx="40" cy="40" r={radius}
                style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
              />
            </svg>
            <Box className={styles.progressValue}>{progress}%</Box>
          </Box>

          <Box className={styles.trackerStats}>
            <Box className={styles.statMini}>
              <span>Lessons</span>
              <strong>12/15</strong>
            </Box>
            <Box className={styles.statMini}>
              <span>Tests</span>
              <strong>{data.assignments?.completed || 8}/10</strong>
            </Box>
            <Box className={styles.statMini}>
              <span>Hours</span>
              <strong>42.5h</strong>
            </Box>
          </Box>
        </Box>

        <Box className={styles.quizCard}>
          <Box className={styles.dateBadge}>
            <span className={styles.miniMonth}>APR</span>
            <span className={styles.miniDay}>18</span>
          </Box>
          <Box className={styles.quizInfo}>
            <h4>Mid-Term Finals</h4>
            <p>10:00 AM • Hall A</p>
          </Box>
          <ArrowRight size={16} className={styles.arrowIcon} />
        </Box>
      </Box>

      {/* 🏆 Skills */}
      <Box className={styles.skillsSection}>
        <Typography className={styles.skillsTitle}>Key Skills</Typography>
        <Box className={styles.skillsGrid}>
          {(data.skills || ["Python", "ML", "Azure", "Next.js"]).slice(0, 5).map((skill: string) => (
            <div key={skill} className={styles.skillPill}>
              <CheckCircle2 size={12} className={styles.checkIcon} />
              <span>{skill}</span>
            </div>
          ))}
        </Box>
      </Box>

      {/* 🏅 Leaderboard */}
      <Box className={styles.leaderboardCard}>
        <Typography className={styles.leaderboardTitle}>Leaderboard</Typography>
        <Box className={styles.leaderGrid}>
          {(data.topPerformers || []).slice(0, 3).map((p: any, i: number) => (
            <div key={i} className={styles.leaderItem}>
              <div className={styles.rankBadge}>{i + 1}</div>
              <span className={styles.leaderName}>{p.name}</span>
              <span className={styles.leaderScore}>{p.score} XP</span>
            </div>
          ))}
        </Box>
      </Box>
    </Box>
  );
}