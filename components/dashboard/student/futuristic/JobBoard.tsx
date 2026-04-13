"use client";

import React, { useRef } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import {
  Briefcase,
  Building,
  MapPin,
  Globe,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import styles from "@/styles/JobBoard.module.css";

interface Job {
  id: number;
  title: string;
  company?: { name: string };
  location?: string;
  type?: string;
  salary?: string;
}

interface JobBoardProps {
  jobs: Job[];
}

export default function JobBoard({ jobs }: JobBoardProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth =
        scrollContainerRef.current.querySelector(`.${styles.card}`)?.clientWidth || 320;
      const scrollAmount = cardWidth + 24; // card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box component="section" className={styles.section}>
      <Box className={styles.sectionHeader}>
        <Box className={styles.titleWrapper}>
          <Briefcase size={24} className={styles.icon} />
          <Typography variant="h2" className={styles.title}>
            Opportunities for You
          </Typography>
        </Box>
        <Box className={styles.scrollControls}>
          <IconButton
            onClick={() => scroll("left")}
            className={styles.scrollButton}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </IconButton>
          <IconButton
            onClick={() => scroll("right")}
            className={styles.scrollButton}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </IconButton>
        </Box>
      </Box>

      <Box className={styles.grid} ref={scrollContainerRef}>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Box key={job.id} className={styles.card}>
              <Box className={styles.cardHeader}>
                <Box className={styles.companyBadge}>
                  <Building size={20} />
                </Box>
                <Typography component="span" className={styles.typeTag}>
                  {job.type || "Full-time"}
                </Typography>
              </Box>

              <Box className={styles.cardBody}>
                <Typography variant="h4" className={styles.jobTitle}>
                  {job.title}
                </Typography>
                <Box className={styles.meta}>
                  <MapPin size={14} />
                  <Typography variant="body2">{job.location || "Remote"}</Typography>
                </Box>
                <Box className={styles.meta}>
                  <Globe size={14} />
                  <Typography variant="body2">
                    {job.company?.name || "Tech Solutions"}
                  </Typography>
                </Box>
              </Box>

              <Box className={styles.cardFooter}>
                <Typography className={styles.salary}>
                  {job.salary || "$45k - $60k"}
                </Typography>
                <Button className={styles.applyBtn}>Quick Apply</Button>
              </Box>
            </Box>
          ))
        ) : (
          <Box className={styles.emptyState}>
            <Typography>Stay tuned! New opportunities are coming your way.</Typography>
          </Box>
        )}
      </Box>

    </Box>
  );
}