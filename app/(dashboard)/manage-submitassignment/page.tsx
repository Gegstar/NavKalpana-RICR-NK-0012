'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  CloudUpload,
  Link as LinkIcon,
  Description,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import styles from '@/styles/ManageSubmitAssignment.module.css';

// Dummy data – replace with API call
const getAssignmentById = (id: number) => ({
  id,
  title: 'React Final Project',
  description: 'Build a simple e‑commerce frontend with React and Redux. Include product listing, cart, and checkout page.',
  dueDate: '2025-04-10T23:59:59',
  totalMarks: 100,
  courseName: 'React Masterclass',
  attachments: ['/files/project-rubric.pdf'],
});

export default function SubmitAssignment() {
  const { id } = useParams();
  const router = useRouter();
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionType, setSubmissionType] = useState<'text' | 'file' | 'link'>('text');
  const [textSubmission, setTextSubmission] = useState('');
  const [fileSubmission, setFileSubmission] = useState<File | null>(null);
  const [linkSubmission, setLinkSubmission] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Fetch assignment data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAssignment(getAssignmentById(Number(id)));
      setLoading(false);
    }, 500);
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileSubmission(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (submissionType === 'text' && !textSubmission.trim()) {
      setError('Please enter your submission text.');
      return;
    }
    if (submissionType === 'link' && !linkSubmission.trim()) {
      setError('Please enter a valid link.');
      return;
    }
    if (submissionType === 'file' && !fileSubmission) {
      setError('Please select a file to upload.');
      return;
    }

    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography>Loading assignment...</Typography>
      </Box>
    );
  }

  if (!assignment) {
    return (
      <Container maxWidth="md" className={styles.container}>
        <Alert severity="error">Assignment not found.</Alert>
      </Container>
    );
  }

  const isOverdue = new Date() > new Date(assignment.dueDate);

  if (submitted) {
    return (
      <Container maxWidth="md" className={styles.container}>
        <Paper className={styles.paper}>
          <CheckCircle className={styles.successIcon} />
          <Typography variant="h5" gutterBottom>Submission Successful!</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Your assignment has been submitted. You can view the status in your assignments list.
          </Typography>
          <Button variant="contained" onClick={() => router.push('/student/assignments')}>
            Back to Assignments
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className={styles.container}>
      <Paper className={styles.paper}>
        <Typography variant="h4" gutterBottom>
          {assignment.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {assignment.courseName}
        </Typography>

        <Box className={styles.infoSection}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Due Date</Typography>
              <Typography variant="body1">
                {new Date(assignment.dueDate).toLocaleString()}
                {isOverdue && <Chip label="Overdue" color="error" size="small" sx={{ ml: 1 }} />}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Total Marks</Typography>
              <Typography variant="body1">{assignment.totalMarks}</Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Description</Typography>
        <Typography variant="body1" paragraph>{assignment.description}</Typography>

        {assignment.attachments && assignment.attachments.length > 0 && (
          <>
            <Typography variant="subtitle2" gutterBottom>Attachments</Typography>
            {assignment.attachments.map((file: string, idx: number) => (
              <Button key={idx} size="small" startIcon={<Description />}>
                {file.split('/').pop()}
              </Button>
            ))}
          </>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Your Submission</Typography>

        <Box className={styles.submissionTypeSelector}>
          <Button
            variant={submissionType === 'text' ? 'contained' : 'outlined'}
            onClick={() => setSubmissionType('text')}
          >
            Text
          </Button>
          <Button
            variant={submissionType === 'file' ? 'contained' : 'outlined'}
            onClick={() => setSubmissionType('file')}
          >
            File Upload
          </Button>
          <Button
            variant={submissionType === 'link' ? 'contained' : 'outlined'}
            onClick={() => setSubmissionType('link')}
          >
            External Link
          </Button>
        </Box>

        <Box className={styles.submissionInput}>
          {submissionType === 'text' && (
            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder="Write your answer here..."
              value={textSubmission}
              onChange={(e) => setTextSubmission(e.target.value)}
              disabled={submitting}
            />
          )}
          {submissionType === 'file' && (
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              disabled={submitting}
            >
              Choose File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          )}
          {submissionType === 'link' && (
            <TextField
              fullWidth
              placeholder="https://..."
              value={linkSubmission}
              onChange={(e) => setLinkSubmission(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LinkIcon /></InputAdornment>,
              }}
              disabled={submitting}
            />
          )}
          {fileSubmission && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Selected: {fileSubmission.name}
            </Typography>
          )}
        </Box>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        {isOverdue && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            This assignment is overdue. Late submissions may be penalized.
          </Alert>
        )}

        <Box className={styles.actions}>
          <Button variant="outlined" onClick={() => router.back()}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? 'Submitting...' : 'Submit Assignment'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}