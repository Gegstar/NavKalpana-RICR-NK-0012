"use client";
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { markLessonComplete } from '@/store/coursesSlice';
import { incrementStreak } from '@/store/studentSlice';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Lesson, Module } from '@/store/coursesSlice';

export default function CourseDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const course = useSelector((state: RootState) =>
    state.courses.enrolledCourses.find(c => c.id === parseInt(id as string))
  );

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5">Course not found</Typography>
        <Button variant="contained" onClick={() => router.push('/student/my-courses')}>
          Back to My Courses
        </Button>
      </Container>
    );
  }

  // Compute module progress
  const getModuleProgress = (module: Module): number => {
    const total = module.lessons.length;
    const completed = module.lessons.filter(l => l.completed).length;
    return total ? Math.round((completed / total) * 100) : 0;
  };

  const handleMarkLessonComplete = (lessonId: number) => {
    dispatch(markLessonComplete({ courseId: course.id, lessonId }));
    dispatch(incrementStreak()); // update streak
    // The dashboard will automatically reflect changes via selectors
  };

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
                  >
                    Mark as Complete
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