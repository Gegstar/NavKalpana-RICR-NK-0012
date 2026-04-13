"use client";

import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { CheckCircle2 } from "lucide-react";
import styles from "./SkillChips.module.css";

interface SkillChipsProps {
  skills: string[];
}

export default function SkillChips({ skills }: SkillChipsProps) {
  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <CheckCircle2 size={20} className={styles.headerIcon} />
        <Typography variant="h6" className={styles.headerTitle}>
          Professional Skills
        </Typography>
      </Box>

      <Box className={styles.chipsContainer}>
        {skills.map((skill, index) => (
          <Chip
            key={index}
            label={skill}
            variant="outlined"
            className={styles.chip}
          />
        ))}
      </Box>

      <Box className={styles.milestoneBox}>
        <Typography className={styles.milestoneText}>
          Next Milestone: <strong>Cloud Architecture</strong> (85% progress)
        </Typography>
      </Box>
    </Box>
  );
}