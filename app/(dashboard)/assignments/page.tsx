"use client";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { submitAssignment, evaluateAssignment } from '@/store/assignmentsSlice';
import { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import { FilterList, Sort, Visibility } from '@mui/icons-material';
import styles from '@/styles/Assignments.module.css';

type FilterStatus = 'all' | 'Not Submitted' | 'Submitted' | 'Late Submitted' | 'Evaluated';
type SortField = 'dueDate' | 'title';
type SortOrder = 'asc' | 'desc';

export default function AssignmentsPage() {
  const dispatch = useDispatch();
  const assignments = useSelector((state: RootState) => state.assignments.assignments);

  // UI state
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submissionLink, setSubmissionLink] = useState('');
  const [open, setOpen] = useState(false);

  // Filter & sort assignments
  const filteredAssignments = useMemo(() => {
    let filtered = [...assignments];
    if (filterStatus !== 'all') {
      filtered = filtered.filter(a => a.submission?.status === filterStatus);
    }
    // Sort
    filtered.sort((a, b) => {
      if (sortField === 'dueDate') {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (titleA < titleB) return sortOrder === 'asc' ? -1 : 1;
        if (titleA > titleB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
    });
    return filtered;
  }, [assignments, filterStatus, sortField, sortOrder]);

  const handleOpenSubmit = (assignment: any) => {
    setSelectedAssignment(assignment);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!selectedAssignment) return;
    const submissionData: any = {};
    if (submissionText) submissionData.text = submissionText;
    if (submissionFile) submissionData.fileUrl = URL.createObjectURL(submissionFile);
    if (submissionLink) submissionData.link = submissionLink;
    dispatch(submitAssignment({ assignmentId: selectedAssignment.id, submissionData }));
    setOpen(false);
    setSubmissionText('');
    setSubmissionFile(null);
    setSubmissionLink('');
  };

  const handleEvaluate = (assignmentId: number) => {
    const marks = Math.floor(Math.random() * 100);
    const feedback = marks >= 50 ? 'Good job! You passed.' : 'Needs improvement.';
    dispatch(evaluateAssignment({ assignmentId, marks, feedback }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Evaluated': return 'success';
      case 'Submitted': return 'primary';
      case 'Late Submitted': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" className={styles.pageContainer}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Assignments
      </Typography>

      {/* Filter & Sort Bar */}
      <Box className={styles.filterBar}>
        <FormControl size="small" className={styles.filterSelect}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Not Submitted">Not Submitted</MenuItem>
            <MenuItem value="Submitted">Submitted</MenuItem>
            <MenuItem value="Late Submitted">Late Submitted</MenuItem>
            <MenuItem value="Evaluated">Evaluated</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" className={styles.filterSelect}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortField}
            label="Sort by"
            onChange={(e) => setSortField(e.target.value as SortField)}
          >
            <MenuItem value="dueDate">Due Date</MenuItem>
            <MenuItem value="title">Title</MenuItem>
          </Select>
        </FormControl>

        <IconButton
          size="small"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        >
          <Sort />
        </IconButton>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table stickyHeader>
          <TableHead className={styles.tableHeader}>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Marks / Feedback</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments.map((assignment) => {
              const isSubmitted = assignment.submission?.status && ['Submitted', 'Late Submitted', 'Evaluated'].includes(assignment.submission.status);
              const isOverdue = new Date() > new Date(assignment.dueDate);
              const status = assignment.submission?.status || (isOverdue ? 'Late (Not Submitted)' : 'Not Submitted');
              const showEvaluate = isSubmitted && assignment.submission?.status !== 'Evaluated';

              return (
                <TableRow key={assignment.id} className={styles.tableRow}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {assignment.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {assignment.description.length > 60
                        ? `${assignment.description.slice(0, 60)}...`
                        : assignment.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={isOverdue && !isSubmitted ? 'error' : 'text.secondary'}>
                      {new Date(assignment.dueDate).toLocaleDateString()}
                      <br />
                      <Typography variant="caption">{new Date(assignment.dueDate).toLocaleTimeString()}</Typography>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={status}
                      size="small"
                      color={getStatusColor(assignment.submission?.status || '')}
                      className={styles.statusChip}
                    />
                  </TableCell>
                  <TableCell>
                    {assignment.submission?.status === 'Evaluated' ? (
                      <>
                        <Typography variant="body2" fontWeight="medium">
                          Marks: {assignment.submission.marks} / {assignment.totalMarks}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {assignment.submission.feedback}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        {isSubmitted ? 'Awaiting evaluation' : '—'}
                      </Typography>
                    )}
                    {showEvaluate && (
                      <Button
                        size="small"
                        onClick={() => handleEvaluate(assignment.id)}
                        sx={{ mt: 1 }}
                      >
                        Evaluate (Demo)
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    {!isSubmitted ? (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleOpenSubmit(assignment)}
                        className={styles.submitBtn}
                      >
                        Submit
                      </Button>
                    ) : (
                      <Tooltip title="View submission details">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Submission Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Assignment: {selectedAssignment?.title}</DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Text Submission"
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
            margin="normal"
          />
          <Button
            variant="outlined"
            component="label"
            sx={{ mt: 1 }}
          >
            Upload File
            <input
              type="file"
              hidden
              onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
            />
          </Button>
          {submissionFile && (
            <Typography variant="caption" sx={{ ml: 2 }}>
              {submissionFile.name}
            </Typography>
          )}
          <TextField
            fullWidth
            label="External Link"
            value={submissionLink}
            onChange={(e) => setSubmissionLink(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}