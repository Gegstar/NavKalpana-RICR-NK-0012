"use client";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { submitDoubt, requestBackupClass } from '@/store/learningSupportSlice';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Alert,
} from '@mui/material';

export default function LearningSupportPage() {
  const dispatch = useDispatch();
  const courses = useSelector((state: RootState) => state.courses.enrolledCourses);
  const [doubtCourse, setDoubtCourse] = useState('');
  const [doubtTopic, setDoubtTopic] = useState('');
  const [doubtDesc, setDoubtDesc] = useState('');
  const [doubtFile, setDoubtFile] = useState<File | null>(null);
  const [backupCourse, setBackupCourse] = useState('');
  const [backupTopic, setBackupTopic] = useState('');
  const [backupReason, setBackupReason] = useState('');

  const handleSubmitDoubt = () => {
    if (!doubtCourse || !doubtTopic || !doubtDesc) return;
    dispatch(submitDoubt({
      courseId: parseInt(doubtCourse),
      topic: doubtTopic,
      description: doubtDesc,
      attachmentUrl: doubtFile ? URL.createObjectURL(doubtFile) : undefined,
    }));
    // Reset form
    setDoubtCourse('');
    setDoubtTopic('');
    setDoubtDesc('');
    setDoubtFile(null);
    alert('Doubt submitted!');
  };

  const handleRequestBackup = () => {
    if (!backupCourse || !backupTopic || !backupReason) return;
    dispatch(requestBackupClass({
      courseId: parseInt(backupCourse),
      topic: backupTopic,
      reason: backupReason,
    }));
    setBackupCourse('');
    setBackupTopic('');
    setBackupReason('');
    alert('Backup class request sent!');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Learning Support
      </Typography>
      <Grid container spacing={4}>
        <Grid size={{xs:12,md:6}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Submit a Doubt</Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>Course</InputLabel>
                <Select
                  value={doubtCourse}
                  onChange={(e) => setDoubtCourse(e.target.value)}
                  label="Course"
                >
                  {courses.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Topic"
                margin="normal"
                value={doubtTopic}
                onChange={(e) => setDoubtTopic(e.target.value)}
              />
              <TextField
                fullWidth
                label="Describe your doubt"
                multiline
                rows={3}
                margin="normal"
                value={doubtDesc}
                onChange={(e) => setDoubtDesc(e.target.value)}
              />
              <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                Attach File (optional)
                <input type="file" hidden onChange={(e) => setDoubtFile(e.target.files?.[0] || null)} />
              </Button>
              {doubtFile && <Typography variant="caption" sx={{ ml: 2 }}>{doubtFile.name}</Typography>}
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleSubmitDoubt}
                disabled={!doubtCourse || !doubtTopic || !doubtDesc}
              >
                Submit Doubt
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{xs:12,md:6}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Request Backup Class</Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>Course</InputLabel>
                <Select
                  value={backupCourse}
                  onChange={(e) => setBackupCourse(e.target.value)}
                  label="Course"
                >
                  {courses.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Topic"
                margin="normal"
                value={backupTopic}
                onChange={(e) => setBackupTopic(e.target.value)}
              />
              <TextField
                fullWidth
                label="Reason for request"
                multiline
                rows={2}
                margin="normal"
                value={backupReason}
                onChange={(e) => setBackupReason(e.target.value)}
              />
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleRequestBackup}
                disabled={!backupCourse || !backupTopic || !backupReason}
              >
                Request Backup Class
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}