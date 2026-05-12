'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Paper,
  FormGroup,
  Typography,
  MenuItem,
} from '@mui/material';

import { lessonResourceService } from '@/services/lesson-resources.service';
import { fileUploadService } from '@/services/fileUpload.service';
import { lessonService } from '@/services/lesson.service';
import {
  LessonResourceType,
} from '@/models/lesson-resources.model';
import { Lesson } from '@/models/lessons.model';
import { toastService } from '@/services/toast.service';
import '@/styles/App.css';

export default function LessonResourceDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [uploading, setUploading] = useState(false);

  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [data, setData] = useState({
    lessonId: '',
    resourceType: LessonResourceType.FILE,
    title: '',
    resourceUrl: '',
    position: 0,
    metadata: {},
  });

  // ================= FETCH LESSONS =================
  const fetchLessons = async () => {
    try {
      const res = await lessonService.getAllLessons();
      setLessons(res || []);
    } catch (err) {
      toastService.apiError(err);
    }
  };

  // ================= FETCH RESOURCE =================
  const fetchLessonResource = async (resourceId: string) => {
    try {
      const res = await lessonResourceService.getLessonResourceById(resourceId);

      setData({
        lessonId: res.lessonId || '',
        resourceType: res.resourceType,
        title: res.title || '',
        resourceUrl: res.resourceUrl || '',
        position: res.position || 0,
        metadata: res.metadata || {},
      });
    } catch (err) {
      toastService.apiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchLessons();

      if (!isNew && id) {
        await fetchLessonResource(id as string);
      } else {
        setLoading(false);
      }
    };

    init();
  }, [id]);

  // ================= CHANGE =================
  const handleChange = (field: string, value: any) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ================= FILE UPLOAD =================
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const uploaded = await toastService.promise(
        fileUploadService.upload(
          file,
          file.name,
          'lesson-resources'
        ),
        {
          loading: 'Uploading file...',
          success: 'File uploaded successfully!',
          error: 'File upload failed',
        }
      );

      handleChange('resourceUrl', uploaded?.url);
    } catch (err) {
      toastService.apiError(err);
    } finally {
      setUploading(false);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.lessonId || !data.resourceUrl) {
      toastService.error(
        'Lesson and resource URL are required'
      );
      return;
    }

    try {
      if (isNew) {
        await toastService.promise(
          lessonResourceService.createLessonResource(data),
          {
            loading: 'Creating lesson resource...',
            success: 'Lesson resource created!',
            error: 'Failed to create lesson resource',
          }
        );
      } else {
        await toastService.promise(
          lessonResourceService.updateLessonResource(
            id as string,
            data
          ),
          {
            loading: 'Updating lesson resource...',
            success: 'Lesson resource updated!',
            error: 'Failed to update lesson resource',
          }
        );
      }

      router.push('/lesson-resources');
    } catch (err) {
      toastService.apiError(err);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
     <Paper className="form-container form-80">
      <Box
        display="flex"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h5">
          {isNew
            ? 'Create Lesson Resource'
            : 'Edit Lesson Resource'}
        </Typography>

        <Box display="flex" gap={1}>
          <Button
            color="error"
            onClick={() =>
              router.push('/lesson-resources')
            }
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="lesson-resource-form"
            variant="contained"
          >
            Save
          </Button>
        </Box>
      </Box>

      <Box
        component="form"
        id="lesson-resource-form"
        onSubmit={handleSubmit}
      >
        <FormGroup>
          <Box
            display="grid"
            gridTemplateColumns="1fr 1fr"
            gap={2}
          >
            <TextField
              select
              label="Lesson"
              value={data.lessonId}
              onChange={(e) =>
                handleChange('lessonId', e.target.value)
              }
              fullWidth
              required
            >
              {lessons.map((lesson) => (
                <MenuItem
                  key={lesson.id}
                  value={lesson.id}
                >
                  {lesson.title}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Resource Type"
              value={data.resourceType}
              onChange={(e) =>
                handleChange(
                  'resourceType',
                  e.target.value
                )
              }
              fullWidth
            >
              {Object.values(LessonResourceType).map(
                (type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                )
              )}
            </TextField>

            <TextField
              label="Title"
              value={data.title}
              onChange={(e) =>
                handleChange('title', e.target.value)
              }
              fullWidth
            />

            <TextField
              label="Position"
              type="number"
              value={data.position}
              onChange={(e) =>
                handleChange(
                  'position',
                  Number(e.target.value)
                )
              }
              fullWidth
            />
          </Box>

          <Box mt={3}>
            <Typography mb={1}>
              Upload File / Video / PDF
            </Typography>

            <input
              type="file"
              onChange={handleFileUpload}
            />

            {uploading && (
              <Box mt={1}>
                <CircularProgress size={20} />
              </Box>
            )}
          </Box>

          <Box mt={2}>
            <TextField
              label="Resource URL"
              value={data.resourceUrl}
              onChange={(e) =>
                handleChange(
                  'resourceUrl',
                  e.target.value
                )
              }
              fullWidth
              required
            />
          </Box>
        </FormGroup>
      </Box>
    </Paper>
  );
}