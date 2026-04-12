"use client";

import React, { useEffect, useRef } from "react";
import { Card, CardContent, Typography, Box, Badge, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider } from "@mui/material";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import gsap from "gsap";
import styles from "@/styles/SupportQueries.module.css";

export default function SupportQueries() {
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (badgeRef.current) {
      gsap.to(badgeRef.current, {
        scale: 1.2,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        ease: "power1.inOut",
      });
    }
  }, []);

  const queries = [
    { id: 1, name: "Alice Johnson", text: "Stuck on Module 3 assignment...", time: "2m ago" },
    { id: 2, name: "Bob Smith", text: "When is the next live session?", time: "15m ago" },
  ];

  return (
    <Card className={`${styles.queryCard} gsap-reveal`}>
      <CardContent className={styles.cardContent}>
        <Box className={styles.header}>
          <Typography variant="overline" className={styles.label}>
            Pending Doubts
          </Typography>
          <Badge
            badgeContent={queries.length}
            color="error"
            ref={badgeRef}
            classes={{ badge: styles.badgeStyle }}
          >
            <QuestionAnswerIcon sx={{ color: "var(--color-text-secondary)" }} />
          </Badge>
        </Box>

        <List className={styles.queryList}>
          {queries.map((query, index) => (
            <React.Fragment key={query.id}>
              <ListItem alignItems="flex-start" className={styles.listItem}>
                <ListItemAvatar>
                  <Avatar className={styles.avatar}>
                    {query.name[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box className={styles.queryHeader}>
                      <Typography variant="subtitle2" className={styles.queryName}>{query.name}</Typography>
                      <Typography variant="caption" className={styles.queryTime}>{query.time}</Typography>
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      className={styles.queryText}
                    >
                      {query.text}
                    </Typography>
                  }
                />
              </ListItem>
              {index < queries.length - 1 && <Divider className={styles.divider} />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
