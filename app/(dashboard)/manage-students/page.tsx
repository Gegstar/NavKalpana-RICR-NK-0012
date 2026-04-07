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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
} from '@mui/material';
import {
  Search,
  FilterList,
  Block,
  CheckCircle,
  Visibility,
  Edit,
  Delete,
} from '@mui/icons-material';
import styles from '@/styles/ManageStudents.module.css';

// Dummy data – replace with API call
const dummyStudents = [
  { id: 1, name: 'Alex Johnson', email: 'alex@example.com', status: 'active', enrolledCourses: 3, joinDate: '2025-01-15' },
  { id: 2, name: 'Maria Garcia', email: 'maria@example.com', status: 'active', enrolledCourses: 2, joinDate: '2025-02-10' },
  { id: 3, name: 'David Kim', email: 'david@example.com', status: 'blocked', enrolledCourses: 0, joinDate: '2024-12-01' },
  { id: 4, name: 'Sarah Lee', email: 'sarah@example.com', status: 'active', enrolledCourses: 4, joinDate: '2025-01-20' },
  { id: 5, name: 'James Wilson', email: 'james@example.com', status: 'inactive', enrolledCourses: 1, joinDate: '2025-03-01' },
];

export default function ManageStudents() {
  const [students, setStudents] = useState(dummyStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openBlockConfirm, setOpenBlockConfirm] = useState(false);

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedStudents = filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (student: any) => {
    setSelectedStudent(student);
    setOpenDetails(true);
  };

  const handleBlockToggle = (student: any) => {
    setSelectedStudent(student);
    setOpenBlockConfirm(true);
  };

  const confirmBlockToggle = () => {
    if (selectedStudent) {
      const newStatus = selectedStudent.status === 'active' ? 'blocked' : 'active';
      setStudents(students.map(s => s.id === selectedStudent.id ? { ...s, status: newStatus } : s));
      setOpenBlockConfirm(false);
      setSelectedStudent(null);
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active': return <Chip label="Active" color="success" size="small" />;
      case 'blocked': return <Chip label="Blocked" color="error" size="small" />;
      default: return <Chip label="Inactive" color="warning" size="small" />;
    }
  };

  return (
    <Box className={styles.container}>
      <Container maxWidth="xl">
        <Paper className={styles.paper}>
          <Typography variant="h4" className={styles.title}>
            Manage Students
          </Typography>

          {/* Search and Filter Bar */}
          <Box className={styles.filterBar}>
            <TextField
              placeholder="Search by name or email"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <Search fontSize="small" /> }}
              className={styles.searchField}
            />
            <FormControl size="small" className={styles.filterSelect}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Students Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Enrolled Courses</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedStudents.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar>{student.name.charAt(0)}</Avatar>
                        {student.name}
                      </Box>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.enrolledCourses}</TableCell>
                    <TableCell>{new Date(student.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusChip(student.status)}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleViewDetails(student)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleBlockToggle(student)}>
                        {student.status === 'active' ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
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
            count={filteredStudents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Student Details Dialog */}
        <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Student Details</DialogTitle>
          <DialogContent dividers>
            {selectedStudent && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2">Name</Typography>
                  <Typography variant="body1">{selectedStudent.name}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography variant="body1">{selectedStudent.email}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2">Enrolled Courses</Typography>
                  <Typography variant="body1">{selectedStudent.enrolledCourses}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2">Status</Typography>
                  {getStatusChip(selectedStudent.status)}
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2">Join Date</Typography>
                  <Typography variant="body1">{new Date(selectedStudent.joinDate).toLocaleDateString()}</Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDetails(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Block/Unblock Confirmation Dialog */}
        <Dialog open={openBlockConfirm} onClose={() => setOpenBlockConfirm(false)}>
          <DialogTitle>Confirm {selectedStudent?.status === 'active' ? 'Block' : 'Unblock'}</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to {selectedStudent?.status === 'active' ? 'block' : 'unblock'} {selectedStudent?.name}?
              {selectedStudent?.status === 'active' && ' They will not be able to access the platform.'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBlockConfirm(false)}>Cancel</Button>
            <Button onClick={confirmBlockToggle} color="error" variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}