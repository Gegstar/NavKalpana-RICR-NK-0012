"use client";

import React from "react";
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, Chip, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PeopleIcon from "@mui/icons-material/People";
import gsap from "gsap";
import styles from "@/styles/CourseManagementList.module.css";

const courses = [
  { id: 1, title: "Advanced Quantum Mechanics", students: 124, status: "Active" },
  { id: 2, title: "Digital Signal Processing", students: 89, status: "Draft" },
  { id: 3, title: "Neural Networks 101", students: 256, status: "Active" },
];

export default function CourseManagementList() {
  const liftEffect = (e: React.MouseEvent<HTMLLIElement>) => {
    gsap.to(e.currentTarget, {
      y: -8,
      rotationX: 10,
      rotationY: 5,
      scale: 1.02,
      duration: 0.4,
      ease: "power2.out",
      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    });
  };

  const resetEffect = (e: React.MouseEvent<HTMLLIElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      duration: 0.4,
      ease: "power2.inOut",
      boxShadow: "none",
    });
  };

  return (
    <Card className={`${styles.courseCard} gsap-reveal`}>
      <CardContent className={styles.cardContent}>
        <Typography variant="overline" className={styles.label}>
          Active Courses
        </Typography>

        <List className={styles.courseList}>
          {courses.map((course) => (
            <ListItem
              key={course.id}
              onMouseEnter={liftEffect}
              onMouseLeave={resetEffect}
              className={styles.courseItem}
              secondaryAction={
                <IconButton edge="end" size="small" sx={{ color: "var(--text-muted)" }}>
                  <MoreVertIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={<Typography variant="subtitle1" className={styles.courseTitle}>{course.title}</Typography>}
                secondary={
                  <Box className={styles.metaContainer}>
                    <Box className={styles.studentMeta}>
                      <PeopleIcon className={styles.metaIcon} />
                      <Typography variant="caption" className={styles.metaText}>{course.students} students</Typography>
                    </Box>
                    <Chip
                      label={course.status}
                      size="small"
                      className={`${styles.statusChip} ${course.status === "Active" ? styles.activeChip : styles.draftChip}`}
                    />
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
