'use client';
import React, { useState } from 'react';
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  LinearProgress,
  IconButton,
  Chip,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import styles from '@/styles/ModuleList.module.css';

interface Lesson {
  id: number;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  videoUrl?: string;
  notes?: string;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface ModuleListProps {
  modules: Module[];
  isInstructor?: boolean; // if true, show edit/delete buttons
  onLessonComplete?: (moduleId: number, lessonId: number) => void;
  onEditModule?: (moduleId: number) => void;
  onDeleteModule?: (moduleId: number) => void;
  onEditLesson?: (moduleId: number, lessonId: number) => void;
  onDeleteLesson?: (moduleId: number, lessonId: number) => void;
}

export default function ModuleList({
  modules,
  isInstructor = false,
  onLessonComplete,
  onEditModule,
  onDeleteModule,
  onEditLesson,
  onDeleteLesson,
}: ModuleListProps) {
  const [expanded, setExpanded] = useState<number | false>(modules[0]?.id || false);

  const handleChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const calculateModuleProgress = (lessons: Lesson[]) => {
    const total = lessons.length;
    const completed = lessons.filter(l => l.completed).length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  return (
    <div className={styles.container}>
      {modules.map((module) => (
        <Accordion
          key={module.id}
          expanded={expanded === module.id}
          onChange={handleChange(module.id)}
          className={styles.accordion}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div className={styles.summaryContent}>
              <Typography variant="h6" className={styles.moduleTitle}>
                {module.title}
              </Typography>
              <div className={styles.moduleMeta}>
                <Chip
                  label={`${module.lessons.length} lessons`}
                  size="small"
                  className={styles.lessonCount}
                />
                <div className={styles.progressWrapper}>
                  <LinearProgress
                    variant="determinate"
                    value={calculateModuleProgress(module.lessons)}
                    className={styles.progressBar}
                  />
                  <Typography variant="caption">
                    {calculateModuleProgress(module.lessons)}%
                  </Typography>
                </div>
                {isInstructor && (
                  <div className={styles.actions}>
                    <IconButton size="small" onClick={() => onEditModule?.(module.id)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => onDeleteModule?.(module.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                )}
              </div>
            </div>
          </AccordionSummary>

          <AccordionDetails>
            <div className={styles.lessonsList}>
              {module.lessons.map((lesson) => (
                <div key={lesson.id} className={styles.lessonItem}>
                  <div className={styles.lessonInfo}>
                    <Typography variant="body1" className={styles.lessonTitle}>
                      {lesson.title}
                    </Typography>
                    <Chip
                      label={lesson.difficulty}
                      size="small"
                      className={`${styles.difficultyChip} ${styles[lesson.difficulty.toLowerCase()]}`}
                    />
                  </div>
                  <div className={styles.lessonActions}>
                    {!isInstructor && onLessonComplete && (
                      <IconButton
                        size="small"
                        onClick={() => onLessonComplete(module.id, lesson.id)}
                        color={lesson.completed ? 'success' : 'default'}
                      >
                        {lesson.completed ? (
                          <CheckCircleIcon />
                        ) : (
                          <RadioButtonUncheckedIcon />
                        )}
                      </IconButton>
                    )}
                    {isInstructor && (
                      <>
                        <IconButton
                          size="small"
                          onClick={() => onEditLesson?.(module.id, lesson.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => onDeleteLesson?.(module.id, lesson.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {isInstructor && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<span>+</span>}
                  className={styles.addLessonBtn}
                  onClick={() => {/* open add lesson modal */}}
                >
                  Add Lesson
                </Button>
              )}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}