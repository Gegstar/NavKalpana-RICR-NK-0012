'use client';
import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  Search,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Block,
} from '@mui/icons-material';
import styles from '@/styles/CourseTracking.module.css';

// Dummy data – replace with API call
const dummyCourses = [
  { id: 1, title: 'React Masterclass', instructor: 'Dr. Sarah Chen', category: 'Development', enrollments: 320, avgProgress: 65, revenue: 15900, status: 'published', rating: 4.8 },
  { id: 2, title: 'Node.js API Design', instructor: 'Prof. James Wilson', category: 'Development', enrollments: 245, avgProgress: 58, revenue: 12250, status: 'published', rating: 4.7 },
  { id: 3, title: 'UI/UX Fundamentals', instructor: 'Emily Rodriguez', category: 'Design', enrollments: 180, avgProgress: 72, revenue: 9000, status: 'published', rating: 4.6 },
  { id: 4, title: 'Python for Data Science', instructor: 'Dr. Michael Lee', category: 'Data Science', enrollments: 210, avgProgress: 48, revenue: 10500, status: 'published', rating: 4.9 },
  { id: 5, title: 'Machine Learning Basics', instructor: 'Dr. Sarah Chen', category: 'Data Science', enrollments: 95, avgProgress: 35, revenue: 4750, status: 'draft', rating: 0 },
  { id: 6, title: 'Advanced CSS', instructor: 'Emily Rodriguez', category: 'Design', enrollments: 150, avgProgress: 70, revenue: 7500, status: 'published', rating: 4.5 },
];

const categories = ['All', 'Development', 'Design', 'Data Science', 'Marketing', 'Business'];

export default function CourseTracking() {
  const [courses, setCourses] = useState(dummyCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openStatusConfirm, setOpenStatusConfirm] = useState(false);
  const [actionType, setActionType] = useState<'publish' | 'unpublish' | 'delete' | null>(null);

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || course.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const paginatedCourses = filteredCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (course: any) => {
    setSelectedCourse(course);
    setOpenDetails(true);
  };

  const handleStatusAction = (course: any, action: 'publish' | 'unpublish' | 'delete') => {
    setSelectedCourse(course);
    setActionType(action);
    setOpenStatusConfirm(true);
  };

  const confirmAction = () => {
    if (!selectedCourse || !actionType) return;

    if (actionType === 'delete') {
      setCourses(courses.filter(c => c.id !== selectedCourse.id));
    } else {
      const newStatus = actionType === 'publish' ? 'published' : 'draft';
      setCourses(courses.map(c => c.id === selectedCourse.id ? { ...c, status: newStatus } : c));
    }
    setOpenStatusConfirm(false);
    setSelectedCourse(null);
    setActionType(null);
  };

  const getStatusChip = (status: string) => {
    return status === 'published' 
      ? <Chip label="Published" color="success" size="small" />
      : <Chip label="Draft" color="warning" size="small" />;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <Box className={styles.container}>
      <Container maxWidth="xl">
        <Paper className={styles.paper}>
          <Typography variant="h4" className={styles.title}>
            Course Tracking
          </Typography>

          {/* Search and Filter Bar */}
          <Box className={styles.filterBar}>
            <TextField
              placeholder="Search by course or instructor"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <Search fontSize="small" /> }}
              className={styles.searchField}
            />
            <FormControl size="small" className={styles.filterSelect}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" className={styles.filterSelect}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Courses Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Instructor</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Enrollments</TableCell>
                  <TableCell>Avg Progress</TableCell>
                  <TableCell>Revenue</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCourses.map((course) => (
                  <TableRow key={course.id} hover>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell>{course.enrollments.toLocaleString()}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LinearProgress
                          variant="determinate"
                          value={course.avgProgress}
                          sx={{ width: 80, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="caption">{course.avgProgress}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatCurrency(course.revenue)}</TableCell>
                    <TableCell>{getStatusChip(course.status)}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleViewDetails(course)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleViewDetails(course)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      {course.status === 'published' ? (
                        <IconButton size="small" color="warning" onClick={() => handleStatusAction(course, 'unpublish')}>
                          <Block fontSize="small" />
                        </IconButton>
                      ) : (
                        <IconButton size="small" color="success" onClick={() => handleStatusAction(course, 'publish')}>
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton size="small" color="error" onClick={() => handleStatusAction(course, 'delete')}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCourses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Course Details Dialog */}
        <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="md" fullWidth>
          <DialogTitle>Course Details</DialogTitle>
          <DialogContent dividers>
            {selectedCourse && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2">Title</Typography>
                  <Typography variant="body1">{selectedCourse.title}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2">Instructor</Typography>
                  <Typography variant="body1">{selectedCourse.instructor}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2">Category</Typography>
                  <Typography variant="body1">{selectedCourse.category}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2">Rating</Typography>
                  <Typography variant="body1">{selectedCourse.rating || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2">Enrollments</Typography>
                  <Typography variant="body1">{selectedCourse.enrollments.toLocaleString()}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2">Revenue</Typography>
                  <Typography variant="body1">{formatCurrency(selectedCourse.revenue)}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2">Average Progress</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={selectedCourse.avgProgress}
                    sx={{ height: 8, borderRadius: 4, mt: 1 }}
                  />
                  <Typography variant="caption">{selectedCourse.avgProgress}%</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2">Status</Typography>
                  {getStatusChip(selectedCourse.status)}
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDetails(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog open={openStatusConfirm} onClose={() => setOpenStatusConfirm(false)}>
          <DialogTitle>
            {actionType === 'publish' && 'Publish Course'}
            {actionType === 'unpublish' && 'Unpublish Course'}
            {actionType === 'delete' && 'Delete Course'}
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to {actionType} "{selectedCourse?.title}"?
              {actionType === 'delete' && ' This action cannot be undone.'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenStatusConfirm(false)}>Cancel</Button>
            <Button onClick={confirmAction} variant="contained" color={actionType === 'delete' ? 'error' : 'primary'}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}