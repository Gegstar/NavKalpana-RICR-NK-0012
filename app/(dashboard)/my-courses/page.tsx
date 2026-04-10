"use client";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { markCourseComplete } from '@/store/coursesSlice';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  LinearProgress,
  Box,
} from '@mui/material';
import { useRouter } from 'next/navigation';

export default function MyCourses() {
  const dispatch = useDispatch();
  const router = useRouter();
  const courses = useSelector((state: RootState) => state.courses.enrolledCourses);

  const handleMarkComplete = (courseId: number) => {
    dispatch(markCourseComplete(courseId));
    // Optionally show toast
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Courses
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid size={{xs:12,md:4,lg:4}} key={course.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {course.thumbnail && (
                <CardMedia
                  component="img"
                  height="140"
                  image={course.thumbnail}
                  alt={course.title}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {course.instructor}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">Progress</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={course.progress}
                    sx={{ height: 8, borderRadius: 4, mt: 0.5 }}
                  />
                  <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                    {course.progress}% Complete
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Attendance: {course.attendancePercentage || 85}%
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={() => handleMarkComplete(course.id)}
                  disabled={course.progress === 100}
                >
                  {course.progress === 100 ? 'Completed' : 'Mark Course as Complete'}
                </Button>
              </CardContent>
              <Button
                variant="contained"
                sx={{ m: 2 }}
                onClick={() => router.push(`/student/course/${course.id}`)}
              >
                Continue Learning
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
