'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Assignment,
  Quiz,
  PlayCircle,
  CalendarToday,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import styles from '@/styles/LearningList.module.css';

interface LearningItem {
  id: number;
  title: string;
  type: 'assignment' | 'quiz' | 'lesson';
  dueDate?: string;
  status: 'pending' | 'completed' | 'overdue';
  courseId: number;
  courseName: string;
}

interface LearningListProps {
  items: LearningItem[];
  onItemClick?: (item: LearningItem) => void;
  onComplete?: (item: LearningItem) => void;
}

export default function LearningList({ items, onItemClick, onComplete }: LearningListProps) {
  const router = useRouter();

  const getIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <Assignment className={styles.iconAssignment} />;
      case 'quiz':
        return <Quiz className={styles.iconQuiz} />;
      case 'lesson':
        return <PlayCircle className={styles.iconLesson} />;
      default:
        return <Schedule />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'overdue':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Pending';
    }
  };

  const handleItemClick = (item: LearningItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else {
      // Default navigation based on type
      if (item.type === 'assignment') {
        router.push(`/student/assignments/${item.id}`);
      } else if (item.type === 'quiz') {
        router.push(`/student/quizzes/${item.id}`);
      } else if (item.type === 'lesson') {
        router.push(`/student/course/${item.courseId}/lesson/${item.id}`);
      }
    }
  };

  const handleComplete = (item: LearningItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onComplete?.(item);
  };

  // Sort: overdue first → pending by due date → completed
  const sortedItems = Array.isArray(items) ? [...items].sort((a, b) => {
    if (a.status === 'overdue' && b.status !== 'overdue') return -1;
    if (a.status !== 'overdue' && b.status === 'overdue') return 1;
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    return 0;
  }) : [];

  return (
    <Paper className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Learning List
      </Typography>
      <List className={styles.list}>
        {sortedItems.map((item) => (
          <ListItem
            key={item.id}
            className={`${styles.listItem} ${item.status === 'completed' ? styles.completed : ''}`}
            onClick={() => handleItemClick(item)}
          >
            <ListItemIcon>{getIcon(item.type)}</ListItemIcon>
            <ListItemText
              primary={
                <Box className={styles.itemPrimary}>
                  <Typography variant="body1" className={styles.itemTitle}>
                    {item.title}
                  </Typography>
                  <Chip
                    label={getStatusLabel(item.status)}
                    size="small"
                    color={getStatusColor(item.status)}
                    className={styles.statusChip}
                  />
                </Box>
              }
              secondary={
                <Box className={styles.itemSecondary}>
                  <Typography variant="caption" color="text.secondary">
                    {item.courseName}
                  </Typography>
                  {item.dueDate && (
                    <Typography variant="caption" color="text.secondary">
                      <CalendarToday fontSize="inherit" /> Due: {new Date(item.dueDate).toLocaleDateString()}
                    </Typography>
                  )}
                </Box>
              }
            />
            {item.status !== 'completed' && onComplete && (
              <IconButton
                edge="end"
                onClick={(e) => handleComplete(item, e)}
                className={styles.completeBtn}
              >
                <CheckCircle />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
