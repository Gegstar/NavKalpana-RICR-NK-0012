"use client";

import React from "react";
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2, ArrowRight } from "lucide-react";
import styles from "@/styles/StudentDashboard.module.css";

export default function RightSidePanel({ data }: { data: any }) {
  const currentDate = new Date();
  
  // Calculate SVG stroke offset
  const radius = 34; // from 80/2 - strokeWidth/2
  const circumference = 2 * Math.PI * radius;
  const progress = data.academicScore || 75;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={styles.rightPanelInner}>
      
      {/* 📅 Event Calendar */}
      <div className={styles.eventCalendarCard}>
        <div className={styles.calendarHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
            <Calendar size={18} color="var(--primary-yellow)" />
            <span>Schedule</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ChevronLeft size={16} color="var(--text-secondary)" cursor="pointer" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>APR 2026</span>
            <ChevronRight size={16} color="var(--text-secondary)" cursor="pointer" />
          </div>
        </div>
        <div className={styles.calendarGrid}>
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
        </div>
      </div>

      {/* 📊 Monthly Tracker */}
      <div className={styles.monthlyTracker}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Monthly Goals</h3>
        <div className={styles.trackerContent}>
           <div className={styles.circularProgress}>
              <svg className={styles.progressSvg} viewBox="0 0 80 80">
                <circle className={styles.progressCircleBg} cx="40" cy="40" r={radius} />
                <circle 
                  className={styles.progressCircleFill} 
                  cx="40" cy="40" r={radius} 
                  style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
                />
              </svg>
              <div className={styles.progressValue}>{progress}%</div>
           </div>
           
           <div className={styles.trackerStats}>
              <div className={styles.statMini}>
                <span>Lessons</span>
                <strong>12/15</strong>
              </div>
              <div className={styles.statMini}>
                <span>Tests</span>
                <strong>{data.assignments?.completed || 8}/10</strong>
              </div>
              <div className={styles.statMini}>
                <span>Hours</span>
                <strong>42.5h</strong>
              </div>
           </div>
        </div>
        
        <div className={styles.quizCard}>
           <div className={styles.dateBadge}>
              <span className={styles.miniMonth}>APR</span>
              <span className={styles.miniDay}>18</span>
           </div>
           <div className={styles.quizInfo}>
              <h4>Mid-Term Finals</h4>
              <p>10:00 AM • Hall A</p>
           </div>
           <ArrowRight size={16} color="var(--text-muted)" />
        </div>
      </div>

      {/* 🏆 Skills */}
      <div className={styles.skillsSection}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Key Skills</h3>
        <div className={styles.skillsGrid} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {(data.skills || ["Python", "ML", "Azure", "Next.js"]).slice(0, 5).map((skill: string) => (
            <div key={skill} className={styles.skillPill}>
              <CheckCircle2 size={12} color="var(--primary-yellow)" />
              <span>{skill}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 🏅 Leaderboard */}
      <div className={styles.leaderboardCard}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Leaderboard</h3>
        <div className={styles.leaderGrid} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {(data.topPerformers || []).slice(0, 3).map((p: any, i: number) => (
            <div key={i} className={styles.leaderItem}>
               <div style={{ width: '24px', height: '24px', background: 'var(--bg-white)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>{i + 1}</div>
               <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600 }}>{p.name}</span>
               <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 800 }}>{p.score} XP</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
