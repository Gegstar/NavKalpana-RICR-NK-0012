"use client";
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
} from '@mui/material';

export default function AttendancePage() {
  const courses = useSelector((state: RootState) => state.courses.enrolledCourses);
  const attendanceRecords = useSelector((state: RootState) => state.attendance.records);

  // Group by course and compute monthly summary
  const getCourseAttendance = (courseId: number) => {
    const records = attendanceRecords.filter(r => r.courseId === courseId);
    const present = records.filter(r => r.status === 'Present').length;
    const total = records.length;
    const percentage = total ? (present / total) * 100 : 0;
    return { present, total, percentage };
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Attendance
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course) => {
          const stats = getCourseAttendance(course.id);
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{course.title}</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Overall Attendance: {stats.percentage.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2">
                    Present: {stats.present} / {stats.total} days
                  </Typography>
                  <Paper sx={{ mt: 2, overflow: 'auto' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {attendanceRecords
                          .filter(r => r.courseId === course.id)
                          .map((rec, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{new Date(rec.date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Chip
                                  label={rec.status}
                                  size="small"
                                  color={rec.status === 'Present' ? 'success' : 'error'}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}