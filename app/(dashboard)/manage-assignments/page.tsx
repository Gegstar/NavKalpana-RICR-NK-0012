'use client';
import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Grid,
  Alert,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Assignment,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import styles from '@/styles/ManageAssignments.module.css';

// Dummy data – replace with API calls
interface Submission {
  id: number;
  studentId: number;
  studentName: string;
  studentAvatar: string;
  submittedAt: string;
  status: 'submitted' | 'late' | 'graded';
  marks?: number;
  feedback?: string;
  text?: string;
  fileUrl?: string;
  link?: string;
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  courseId: number;
  courseName: string;
  dueDate: string;
  totalMarks: number;
  attachments?: string[];
  submissions: Submission[];
}

const dummyCourses = [
  { id: 1, name: 'React Masterclass' },
  { id: 2, name: 'Node.js API Design' },
  { id: 3, name: 'UI/UX Fundamentals' },
];

const dummyAssignments: Assignment[] = [
  {
    id: 1,
    title: 'React Final Project',
    description: 'Build a simple e‑commerce frontend with React and Redux.',
    courseId: 1,
    courseName: 'React Masterclass',
    dueDate: '2025-04-10T23:59:59',
    totalMarks: 100,
    submissions: [
      {
        id: 1,
        studentId: 101,
        studentName: 'Alice Johnson',
        studentAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        submittedAt: '2025-04-05T10:30:00',
        status: 'submitted',
      },
      {
        id: 2,
        studentId: 102,
        studentName: 'Bob Smith',
        studentAvatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        submittedAt: '2025-04-11T09:15:00',
        status: 'late',
      },
    ],
  },
  {
    id: 2,
    title: 'Node.js API Assignment',
    description: 'Create a REST API with authentication.',
    courseId: 2,
    courseName: 'Node.js API Design',
    dueDate: '2025-04-15T23:59:59',
    totalMarks: 100,
    submissions: [],
  },
];

export default function ManageAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>(dummyAssignments);
  const [selectedCourse, setSelectedCourse] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    courseId: 0,
    dueDate: '',
    totalMarks: 100,
  });
  const [openSubmissionsDialog, setOpenSubmissionsDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [openGradeDialog, setOpenGradeDialog] = useState(false);
  const [gradeForm, setGradeForm] = useState({ marks: 0, feedback: '' });

  // Filter assignments by course
  const filteredAssignments = selectedCourse === 0
    ? assignments
    : assignments.filter(a => a.courseId === selectedCourse);

  // Open create/edit dialog
  const handleOpenDialog = (assignment?: Assignment) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setAssignmentForm({
        title: assignment.title,
        description: assignment.description,
        courseId: assignment.courseId,
        dueDate: assignment.dueDate.slice(0, 16),
        totalMarks: assignment.totalMarks,
      });
    } else {
      setEditingAssignment(null);
      setAssignmentForm({
        title: '',
        description: '',
        courseId: 0,
        dueDate: '',
        totalMarks: 100,
      });
    }
    setOpenDialog(true);
  };

  const handleSaveAssignment = () => {
    if (editingAssignment) {
      // Update
      setAssignments(assignments.map(a => a.id === editingAssignment.id ? {
        ...editingAssignment,
        ...assignmentForm,
        courseName: dummyCourses.find(c => c.id === assignmentForm.courseId)?.name || '',
      } : a));
    } else {
      // Create
      const newAssignment: Assignment = {
        id: Date.now(),
        ...assignmentForm,
        courseName: dummyCourses.find(c => c.id === assignmentForm.courseId)?.name || '',
        submissions: [],
      };
      setAssignments([...assignments, newAssignment]);
    }
    setOpenDialog(false);
  };

  const handleDeleteAssignment = (id: number) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(assignments.filter(a => a.id !== id));
    }
  };

  // View submissions
  const handleViewSubmissions = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setOpenSubmissionsDialog(true);
  };

  // Grade submission
  const handleOpenGrade = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGradeForm({
      marks: submission.marks || 0,
      feedback: submission.feedback || '',
    });
    setOpenGradeDialog(true);
  };

  const handleSaveGrade = () => {
    if (selectedAssignment && selectedSubmission) {
      const updatedAssignments = assignments.map(a => {
        if (a.id === selectedAssignment.id) {
          return {
            ...a,
            submissions: a.submissions.map(s => s.id === selectedSubmission.id ? {
              ...s,
              marks: gradeForm.marks,
              feedback: gradeForm.feedback,
              status: 'graded',
            } : s),
          };
        }
        return a;
      });
      setAssignments(updatedAssignments);
      setOpenGradeDialog(false);
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'submitted': return <Chip label="Submitted" color="info" size="small" icon={<Assignment />} />;
      case 'late': return <Chip label="Late" color="warning" size="small" icon={<Warning />} />;
      case 'graded': return <Chip label="Graded" color="success" size="small" icon={<CheckCircle />} />;
      default: return null;
    }
  };

  return (
    <Box className={styles.container}>
      <Container maxWidth="xl">
        <Paper className={styles.paper}>
          <Box className={styles.header}>
            <Typography variant="h4">Assignments</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Create Assignment
            </Button>
          </Box>

          {/* Course Filter */}
          <Box className={styles.filterBar}>
            <FormControl size="small" className={styles.filterSelect}>
              <InputLabel>Course</InputLabel>
              <Select
                value={selectedCourse}
                label="Course"
                onChange={(e) => setSelectedCourse(Number(e.target.value))}
              >
                <MenuItem value={0}>All Courses</MenuItem>
                {dummyCourses.map(course => (
                  <MenuItem key={course.id} value={course.id}>{course.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Assignments Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Total Marks</TableCell>
                  <TableCell>Submissions</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>{assignment.title}</TableCell>
                    <TableCell>{assignment.courseName}</TableCell>
                    <TableCell>{new Date(assignment.dueDate).toLocaleString()}</TableCell>
                    <TableCell>{assignment.totalMarks}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => handleViewSubmissions(assignment)}
                      >
                        {assignment.submissions.length} submissions
                      </Button>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenDialog(assignment)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteAssignment(assignment.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Assignment Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>{editingAssignment ? 'Edit Assignment' : 'Create Assignment'}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  fullWidth
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={assignmentForm.courseId}
                    label="Course"
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, courseId: Number(e.target.value) })}
                  >
                    {dummyCourses.map(course => (
                      <MenuItem key={course.id} value={course.id}>{course.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Due Date"
                  type="datetime-local"
                  fullWidth
                  value={assignmentForm.dueDate}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Total Marks"
                  type="number"
                  fullWidth
                  value={assignmentForm.totalMarks}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, totalMarks: Number(e.target.value) })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveAssignment} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Submissions Dialog */}
        <Dialog open={openSubmissionsDialog} onClose={() => setOpenSubmissionsDialog(false)} maxWidth="lg" fullWidth>
          <DialogTitle>Submissions for {selectedAssignment?.title}</DialogTitle>
          <DialogContent dividers>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Submitted At</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Marks</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedAssignment?.submissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar src={sub.studentAvatar} sx={{ width: 30, height: 30 }} />
                          {sub.studentName}
                        </Box>
                      </TableCell>
                      <TableCell>{new Date(sub.submittedAt).toLocaleString()}</TableCell>
                      <TableCell>{getStatusChip(sub.status)}</TableCell>
                      <TableCell>{sub.marks ? `${sub.marks}/${selectedAssignment.totalMarks}` : 'Not graded'}</TableCell>
                      <TableCell>
                        <Button size="small" onClick={() => handleOpenGrade(sub)}>
                          {sub.status === 'graded' ? 'Edit Grade' : 'Grade'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {selectedAssignment?.submissions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No submissions yet</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSubmissionsDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Grade Dialog */}
        <Dialog open={openGradeDialog} onClose={() => setOpenGradeDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Grade Submission</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Marks"
                  type="number"
                  fullWidth
                  value={gradeForm.marks}
                  onChange={(e) => setGradeForm({ ...gradeForm, marks: Number(e.target.value) })}
                  InputProps={{ inputProps: { min: 0, max: selectedAssignment?.totalMarks } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Feedback"
                  fullWidth
                  multiline
                  rows={3}
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenGradeDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveGrade} variant="contained">Save Grade</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}