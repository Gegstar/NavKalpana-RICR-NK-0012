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
  Block,
  CheckCircle,
  Visibility,
  VerifiedUser,
  Pending,
} from '@mui/icons-material';
import styles from '@/styles/ManageTeachers.module.css';

// Dummy data – replace with API call
const dummyTeachers = [
  { id: 1, name: 'Dr. Sarah Chen', email: 'sarah.chen@example.com', expertise: 'Machine Learning', status: 'approved', joinDate: '2025-01-15', students: 1250, courses: 3 },
  { id: 2, name: 'Prof. James Wilson', email: 'james.wilson@example.com', expertise: 'Web Development', status: 'approved', joinDate: '2025-02-10', students: 890, courses: 2 },
  { id: 3, name: 'Emily Rodriguez', email: 'emily.rodriguez@example.com', expertise: 'UI/UX Design', status: 'pending', joinDate: '2025-04-01', students: 0, courses: 0 },
  { id: 4, name: 'Dr. Michael Lee', email: 'michael.lee@example.com', expertise: 'Data Science', status: 'approved', joinDate: '2025-01-20', students: 2100, courses: 4 },
  { id: 5, name: 'Lisa Wang', email: 'lisa.wang@example.com', expertise: 'Mobile Development', status: 'blocked', joinDate: '2025-03-05', students: 450, courses: 1 },
  { id: 6, name: 'Prof. Robert Brown', email: 'robert.brown@example.com', expertise: 'Cloud Computing', status: 'pending', joinDate: '2025-04-05', students: 0, courses: 0 },
];

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState(dummyTeachers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openStatusConfirm, setOpenStatusConfirm] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'block' | 'unblock' | null>(null);

  // Filter teachers
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          teacher.expertise.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || teacher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedTeachers = filteredTeachers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (teacher: any) => {
    setSelectedTeacher(teacher);
    setOpenDetails(true);
  };

  const handleStatusAction = (teacher: any, action: 'approve' | 'reject' | 'block' | 'unblock') => {
    setSelectedTeacher(teacher);
    setActionType(action);
    setOpenStatusConfirm(true);
  };

  const confirmStatusChange = () => {
    if (!selectedTeacher || !actionType) return;

    let newStatus = selectedTeacher.status;
    switch (actionType) {
      case 'approve':
        newStatus = 'approved';
        break;
      case 'reject':
        newStatus = 'rejected';
        break;
      case 'block':
        newStatus = 'blocked';
        break;
      case 'unblock':
        newStatus = 'approved';
        break;
    }

    setTeachers(teachers.map(t => t.id === selectedTeacher.id ? { ...t, status: newStatus } : t));
    setOpenStatusConfirm(false);
    setSelectedTeacher(null);
    setActionType(null);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'approved': return <Chip label="Approved" color="success" size="small" icon={<VerifiedUser />} />;
      case 'pending': return <Chip label="Pending" color="warning" size="small" icon={<Pending />} />;
      case 'blocked': return <Chip label="Blocked" color="error" size="small" icon={<Block />} />;
      case 'rejected': return <Chip label="Rejected" color="default" size="small" />;
      default: return <Chip label={status} size="small" />;
    }
  };

  const getActionButtons = (teacher: any) => {
    if (teacher.status === 'pending') {
      return (
        <>
          <IconButton size="small" color="success" onClick={() => handleStatusAction(teacher, 'approve')}>
            <CheckCircle fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleStatusAction(teacher, 'reject')}>
            <Block fontSize="small" />
          </IconButton>
        </>
      );
    }
    if (teacher.status === 'approved') {
      return (
        <IconButton size="small" color="error" onClick={() => handleStatusAction(teacher, 'block')}>
          <Block fontSize="small" />
        </IconButton>
      );
    }
    if (teacher.status === 'blocked') {
      return (
        <IconButton size="small" color="success" onClick={() => handleStatusAction(teacher, 'unblock')}>
          <CheckCircle fontSize="small" />
        </IconButton>
      );
    }
    return null;
  };

  return (
    <Box className={styles.container}>
      <Container maxWidth="xl">
        <Paper className={styles.paper}>
          <Typography variant="h4" className={styles.title}>
            Manage Teachers
          </Typography>

          {/* Search and Filter Bar */}
          <Box className={styles.filterBar}>
            <TextField
              placeholder="Search by name, email or expertise"
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
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Teachers Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Teacher</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Expertise</TableCell>
                  <TableCell>Students</TableCell>
                  <TableCell>Courses</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTeachers.map((teacher) => (
                  <TableRow key={teacher.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar>{teacher.name.charAt(0)}</Avatar>
                        {teacher.name}
                      </Box>
                    </TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.expertise}</TableCell>
                    <TableCell>{teacher.students.toLocaleString()}</TableCell>
                    <TableCell>{teacher.courses}</TableCell>
                    <TableCell>{new Date(teacher.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusChip(teacher.status)}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleViewDetails(teacher)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                      {getActionButtons(teacher)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTeachers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Teacher Details Dialog */}
        <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Teacher Details</DialogTitle>
          <DialogContent dividers>
            {selectedTeacher && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2">Name</Typography>
                  <Typography variant="body1">{selectedTeacher.name}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography variant="body1">{selectedTeacher.email}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2">Expertise</Typography>
                  <Typography variant="body1">{selectedTeacher.expertise}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2">Total Students</Typography>
                  <Typography variant="body1">{selectedTeacher.students.toLocaleString()}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2">Total Courses</Typography>
                  <Typography variant="body1">{selectedTeacher.courses}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2">Join Date</Typography>
                  <Typography variant="body1">{new Date(selectedTeacher.joinDate).toLocaleDateString()}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2">Status</Typography>
                  {getStatusChip(selectedTeacher.status)}
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
            {actionType === 'approve' && 'Approve Teacher'}
            {actionType === 'reject' && 'Reject Teacher'}
            {actionType === 'block' && 'Block Teacher'}
            {actionType === 'unblock' && 'Unblock Teacher'}
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to {actionType} {selectedTeacher?.name}?
              {actionType === 'block' && ' They will not be able to access the platform.'}
              {actionType === 'approve' && ' They will gain instructor access.'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenStatusConfirm(false)}>Cancel</Button>
            <Button onClick={confirmStatusChange} variant="contained" color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
