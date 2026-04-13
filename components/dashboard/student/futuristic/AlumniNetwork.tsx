"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Users, UserPlus, GraduationCap } from "lucide-react";
import styles from "@/styles/AlumniNetwork.module.css";

interface Alumni {
  id: number;
  name: string;
  position?: string;
  batch?: string;
  avatar?: string;
}

interface AlumniNetworkProps {
  alumni: Alumni[];
}

export default function AlumniNetwork({ alumni }: AlumniNetworkProps) {
  return (
    <Box component="section" className={styles.section}>
      <Box className={styles.sectionHeader}>
        <Users size={24} className={styles.sectionIcon} />
        <Typography variant="h2" className={styles.sectionTitle}>
          Notable Alumni
        </Typography>
      </Box>

      {alumni.length > 0 ? (
        <Box className={styles.scrollContainer}>
          {alumni.slice(0, 10).map((person) => (
            <Box key={person.id} className={styles.alumniCard}>
              <img
                src={person.avatar}
                className={styles.avatar}
                alt={person.name}
              />
              <Typography className={styles.name}>{person.name}</Typography>
              <Typography className={styles.position}>{person.position}</Typography>

              <Box className={styles.batchWrapper}>
                <GraduationCap size={12} className={styles.batchIcon} />
                <Typography component="span" className={styles.batchText}>
                  Class of {person.batch}
                </Typography>
              </Box>

              <Button className={styles.connectButton} startIcon={<UserPlus size={14} />}>
                Connect
              </Button>
            </Box>
          ))}
        </Box>
      ) : (
        <Box className={styles.emptyState}>
          Your network is growing. Check back soon.
        </Box>
      )}
    </Box>
  );
}