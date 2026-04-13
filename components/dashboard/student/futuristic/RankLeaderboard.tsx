"use client";

import React from "react";
import { Typography, Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Stack } from "@mui/material";
import { Award, Trophy } from "lucide-react";
import styles from "./RankLeaderboard.module.css";

interface Scorer {
  name: string;
  score: number;
  rank: number;
}

export default function RankLeaderboard({ scorers }: { scorers?: Scorer[] }) {
  const defaultScorers = scorers || [
    { name: "John Doe", score: 4500, rank: 1 },
    { name: "Jane Smith", score: 4200, rank: 2 },
    { name: "Mike Johnson", score: 3900, rank: 3 }
  ];

  return (
    <Box className={styles.container}>
      <Stack className={styles.header}>
        <Trophy size={20} className={styles.headerIcon} />
        <Typography variant="h6" className={styles.headerTitle}>
          Leaderboard
        </Typography>
      </Stack>

      <List className={styles.list}>
        {defaultScorers.map((user, i) => (
          <ListItem key={i} className={styles.listItem}>
            <ListItemAvatar className={styles.avatarWrapper}>
              <Box className={styles.avatarContainer}>
                <Avatar 
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=FDE68A&color=000`} 
                  className={styles.avatar}
                />
                {user.rank <= 3 && (
                  <Box className={styles.awardBadge}>
                    <Award 
                      size={12} 
                      className={user.rank === 1 ? styles.goldAward : styles.awardIcon}
                    />
                  </Box>
                )}
              </Box>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography className={styles.primaryText}>{user.name}</Typography>}
              secondary={
                <Typography component="span" className={styles.secondaryText}>
                  Rank #{user.rank} • {user.score} XP
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}