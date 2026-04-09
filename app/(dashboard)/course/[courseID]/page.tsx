"use client";
import { useParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { courseService } from '@/services/course.service';
import { incrementStreak } from '@/store/studentSlice';
import { Course, Module, Lesson } from '@/store/coursesSlice';

export default function CourseDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingLesson, setCompletingLesson] = useState<number | null>(null);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourseById(id as string);
        setCourse(data);
        setError(null);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  // Compute module progress
  const getModuleProgress = (module: Module): number => {
    const total = module.lessons.length;
    const completed = module.lessons.filter((l: Lesson) => l.completed).length;
    return total ? Math.round((completed / total) * 100) : 0;
  };

  const handleMarkLessonComplete = async (lessonId: number) => {
    if (!course) return;
    setCompletingLesson(lessonId);
    try {
      // Call API to mark lesson as complete
      const updatedCourse = await courseService.markLessonComplete(course.id, lessonId);
      // Update local state with the returned course data
      setCourse(updatedCourse);
      // Update streak in Redux
      dispatch(incrementStreak());
    } catch (err: any) {
      console.error('Failed to mark lesson complete', err);
      // Optionally show a toast notification
    } finally {
      setCompletingLesson(null);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading course...</Typography>
      </Container>
    );
  }

  if (error || !course) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Course not found'}</Alert>
        <Button variant="contained" onClick={() => router.push('/student/my-courses')} sx={{ mt: 2 }}>
          Back to My Courses
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button variant="outlined" onClick={() => router.push('/student/my-courses')} sx={{ mb: 2 }}>
        ← Back to My Courses
      </Button>
      <Typography variant="h4" gutterBottom>
        {course.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Instructor: {course.instructor}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={course.progress}
          sx={{ flex: 1, height: 10, borderRadius: 5 }}
        />
        <Typography variant="body2">{course.progress}% Complete</Typography>
      </Box>

      {course.modules.map((module) => (
        <Accordion key={module.id} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Typography variant="h6">{module.title}</Typography>
              <Chip
                label={`${getModuleProgress(module)}%`}
                size="small"
                color={getModuleProgress(module) === 100 ? 'success' : 'default'}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {module.lessons.map((lesson) => (
              <Box
                key={lesson.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box>
                  <Typography variant="body1">{lesson.title}</Typography>
                  <Chip
                    label={lesson.difficulty}
                    size="small"
                    sx={{ mt: 0.5 }}
                    color={lesson.difficulty === 'Beginner' ? 'success' : lesson.difficulty === 'Intermediate' ? 'warning' : 'error'}
                  />
                </Box>
                {!lesson.completed ? (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleMarkLessonComplete(lesson.id)}
                    disabled={completingLesson === lesson.id}
                  >
                    {completingLesson === lesson.id ? <CircularProgress size={20} /> : 'Mark as Complete'}
                  </Button>
                ) : (
                  <Typography variant="caption" color="success.main">
                    Completed ✓
                  </Typography>
                )}
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
}