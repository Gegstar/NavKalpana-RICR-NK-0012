"use client";

import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from "@mui/lab";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import BackupIcon from "@mui/icons-material/Backup";
import EventIcon from "@mui/icons-material/Event";
import styles from "@/styles/UpcomingSchedule.module.css";

const schedule = [
  { id: 1, title: "Live Class: Quantum Field Theory", time: "10:00 AM", type: "live", icon: <LiveTvIcon fontSize="small" /> },
  { id: 2, title: "Content Release: Module 5", time: "02:00 PM", type: "release", icon: <BackupIcon fontSize="small" /> },
  { id: 3, title: "Webinar: The Future of AI", time: "05:00 PM", type: "webinar", icon: <EventIcon fontSize="small" /> },
];

export default function UpcomingSchedule() {
  return (
    <Card className={`${styles.scheduleCard} gsap-reveal`}>
      <CardContent className={styles.cardContent}>
        <Typography variant="overline" className={styles.label}>
          Upcoming Schedule
        </Typography>

        <Timeline position="right" className={styles.timeline}>
          {schedule.map((item) => (
            <TimelineItem key={item.id} sx={{ '&:before': { display: 'none' } }}>
              <TimelineSeparator>
                <TimelineDot 
                  className={
                    item.type === "live" ? styles.dotLive : 
                    item.type === "release" ? styles.dotRelease : 
                    styles.dotWebinar
                  } 
                  sx={{ boxShadow: "none" }}
                >
                  {item.icon}
                </TimelineDot>
                <TimelineConnector className={styles.connector} />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "12px", px: 2 }}>
                <Typography variant="subtitle2" className={styles.title}>
                  {item.title}
                </Typography>
                <Typography variant="caption" className={styles.time}>
                  Today at {item.time}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}
