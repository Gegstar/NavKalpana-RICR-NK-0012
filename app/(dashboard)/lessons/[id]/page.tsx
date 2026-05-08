'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  CircularProgress,
  Paper,
  FormGroup,
  Typography,
} from '@mui/material';
import { lessonService } from '@/services/lesson.service';
import { toastService } from '@/services/toast.service';
import '@/styles/App.css';

export default function LessonDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const isNew = id === 'new';

  const [data, setData] = useState({
    moduleId: '',
    moduleTitle: '',
    title: '',
    position: 1,
    isPreview: false,
    isPublished: false,
  });

  const [loading, setLoading] = useState(!isNew);

  // ================= VALIDATION =================
  const isFormValid = () => {
    if (!data.moduleId?.trim()) return false;
    if (!data.title?.trim()) return false;
    if (!data.position || Number(data.position) < 1) return false;

    return true;
  };

  // ================= FETCH =================
  const fetchLesson = async (lessonId: string) => {
    try {
      const res = await lessonService.getLessonById(lessonId);

      setData({
        moduleId: res.moduleId || '',
        moduleTitle: res.moduleTitle || '',
        title: res.title || '',
        position: res.position || 1,
        isPreview: res.isPreview || false,
        isPublished: res.isPublished || false,
      });
    } catch (error) {
      console.error('Error fetching lesson:', error);
      toastService.apiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNew && id) {
      fetchLesson(id as string);
    } else {
      setLoading(false);
    }
  }, [id]);

  // ================= CHANGE =================
  const handleChange = (field: string, value: any) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toastService.error('Please fill all required fields');
      return;
    }

    const payload = {
      moduleId: data.moduleId,
      title: data.title,
      position: Number(data.position),
      isPreview: data.isPreview,
      isPublished: data.isPublished,
    };

    try {
      if (isNew) {
        await toastService.promise(
          lessonService.createLesson(payload),
          {
            loading: 'Creating lesson...',
            success: 'Lesson created successfully!',
            error: (err) =>
              err?.response?.data?.message || 'Failed to create lesson',
          }
        );
      } else {
        await toastService.promise(
          lessonService.updateLesson(id as string, payload),
          {
            loading: 'Updating lesson...',
            success: 'Lesson updated successfully!',
            error: (err) =>
              err?.response?.data?.message || 'Failed to update lesson',
          }
        );
      }

      router.push('/lessons');
    } catch (err) {
      console.error(err);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper className="form-container form-80">
      {/* HEADER */}
      <Box className="form-header">
        <Typography variant="h5">
          {isNew ? 'Create Lesson' : 'Edit Lesson'}
        </Typography>

        <Box className="form-header-actions">
          <Button onClick={() => router.push('/lessons')} color="error">
            Cancel
          </Button>

          <Button
            type="submit"
            form="form"
            variant="contained"
            className="btn-primary"
            disabled={!isFormValid()}
          >
            Save
          </Button>
        </Box>
      </Box>

      {/* FORM */}
      <Box id="form" component="form" onSubmit={handleSubmit}>
        <FormGroup className="form-group">
          <Typography variant="h6">Lesson Info</Typography>

          <div className="form-row grid-cols-2">
            <TextField
              label="Module ID"
              value={data.moduleId}
              onChange={(e) => handleChange('moduleId', e.target.value)}
              error={!data.moduleId}
              helperText={!data.moduleId ? 'Module ID is required' : ''}
              fullWidth
              required
            />

            <TextField
              label="Module Title"
              value={data.moduleTitle}
              disabled
              fullWidth
            />
          </div>

          <div className="form-row grid-cols-2">
            <TextField
              label="Title"
              value={data.title}
              onChange={(e) => handleChange('title', e.target.value)}
              error={!data.title}
              helperText={!data.title ? 'Title is required' : ''}
              fullWidth
              required
            />

            <TextField
              label="Position"
              type="number"
              value={data.position}
              onChange={(e) => handleChange('position', e.target.value)}
              error={!data.position || Number(data.position) < 1}
              helperText={
                !data.position || Number(data.position) < 1
                  ? 'Position must be greater than 0'
                  : ''
              }
              fullWidth
              required
            />
          </div>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Settings
          </Typography>

          <div className="form-row grid-cols-2">
            <FormControlLabel
              control={
                <Switch
                  checked={data.isPreview}
                  onChange={(e) =>
                    handleChange('isPreview', e.target.checked)
                  }
                />
              }
              label="Preview"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={data.isPublished}
                  onChange={(e) =>
                    handleChange('isPublished', e.target.checked)
                  }
                />
              }
              label="Published"
            />
          </div>
        </FormGroup>
      </Box>
    </Paper>
  );
}