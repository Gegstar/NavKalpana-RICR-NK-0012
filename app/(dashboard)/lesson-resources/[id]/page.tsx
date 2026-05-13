'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
  useRouter,
} from 'next/navigation';

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

import {
  lessonResourceService,
} from '@/services/lesson-resourses.service';

import { LessonResourceType} from '@/models/lesson-resources.model'
import {
  lessonService,
} from '@/services/lesson.service';

import {
  fileUploadService,
} from '@/services/fileUpload.service';

import {
  toastService,
} from '@/services/toast.service';

import { Lesson } from '@/models/lessons.model';

import '@/styles/App.css';

export default function LessonResourceDetailPage() {
  const { id } = useParams();

  const router = useRouter();

  const isNew = id === 'new';

  // =====================================================
  // STATES
  // =====================================================

  const [uploading, setUploading] =
    useState(false);

  const [loading, setLoading] =
    useState(!isNew);

  const [lessons, setLessons] =
    useState<Lesson[]>([]);

  const [data, setData] = useState({
    lessonId: '',

    lessonTitle: '',

    title: '',

    resourceType: LessonResourceType.VIDEO,

    resourceUrl: '',

    position: 1,

    metadata: {},
  });

  // =====================================================
  // FETCH LESSONS
  // =====================================================

  const fetchLessons = async () => {
    try {
      const res =
        await lessonService.getAllLessons();

      setLessons(res || []);
    } catch (err) {
      toastService.apiError(err);
    }
  };

  // =====================================================
  // FETCH RESOURCE
  // =====================================================

  const fetchResource = async (
    resourceId: string,
  ) => {
    try {
      const res =
        await lessonResourceService.getResourceById(
          resourceId,
        );

      setData({
        lessonId: res.lessonId || '',

        lessonTitle:
          res.lessonTitle || '',

        title: res.title || '',

        resourceType:
          res.resourceType || 'VIDEO',

        resourceUrl:
          res.resourceUrl || '',

        position:
          res.position || 1,

        metadata:
          res.metadata || {},
      });
    } catch (err) {
      toastService.apiError(err);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // USE EFFECT
  // =====================================================

  useEffect(() => {
    fetchLessons();

    if (!isNew && id) {
      fetchResource(id as string);
    } else {
      setLoading(false);
    }
  }, [id]);

  // =====================================================
  // CHANGE
  // =====================================================

  const handleChange = (
    field: string,
    value: any,
  ) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =====================================================
  // FILE UPLOAD
  // =====================================================

  const handleFileUpload = async (
    file: File,
  ) => {
    try {
      setUploading(true);

      // VIDEO → HLS
      if (
        data.resourceType === 'VIDEO'
      ) {
        const res =
          await fileUploadService.uploadHlsVideo(
            file,
          );

        handleChange(
          'resourceUrl',
          res.playlistUrl,
        );

        toastService.success(
          'Video uploaded successfully',
        );

        return;
      }

      // NORMAL FILE
      const res =
        await fileUploadService.upload(
          file,
          file.name,
          'lesson-resources',
        );

      handleChange(
        'resourceUrl',
        res.url,
      );

      toastService.success(
        'File uploaded successfully',
      );
    } catch (err) {
      toastService.apiError(err);
    } finally {
      setUploading(false);
    }
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    try {
      const payload = {
        lessonId: data.lessonId,

        title: data.title,

        resourceType:
          data.resourceType,

        resourceUrl:
          data.resourceUrl,

        position: Number(
          data.position,
        ),

        metadata: data.metadata,
      };

      if (isNew) {
        await toastService.promise(
          lessonResourceService.createResource(
            payload,
          ),
          {
            loading:
              'Creating resource...',

            success:
              'Resource created successfully',

            error:
              'Failed to create resource',
          },
        );
      } else {
        await toastService.promise(
          lessonResourceService.updateResource(
            id as string,
            payload,
          ),
          {
            loading:
              'Updating resource...',

            success:
              'Resource updated successfully',

            error:
              'Failed to update resource',
          },
        );
      }

      router.push(
        '/lesson-resources',
      );
    } catch (err) {
      console.error(err);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={10}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <Paper className="form-container form-80">
      {/* HEADER */}

      <Box className="form-header">
        <Typography variant="h5">
          {isNew
            ? 'Create Lesson Resource'
            : 'Edit Lesson Resource'}
        </Typography>

        <Box className="form-header-actions">
          <Button
            onClick={() =>
              router.push(
                '/lesson-resources',
              )
            }
            color="error"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="form"
            variant="contained"
            disabled={uploading}
          >
            Save
          </Button>
        </Box>
      </Box>

      {/* FORM */}

      <Box
        component="form"
        id="form"
        onSubmit={handleSubmit}
      >
        <FormGroup className="form-group">
          <Typography variant="h6">
            Resource Info
          </Typography>

          {/* LESSON */}

          <div className="form-row grid-cols-2">
            <TextField
              select
              label="Lesson"
              value={data.lessonId}
              onChange={(e) => {
                const lessonId =
                  e.target.value;

                const lesson =
                  lessons.find(
                    (l) =>
                      l.id ===
                      lessonId,
                  );

                setData((prev) => ({
                  ...prev,

                  lessonId,

                  lessonTitle:
                    lesson?.title ||
                    '',
                }));
              }}
              fullWidth
              required
            >
              {lessons.map(
                (lesson) => (
                  <MenuItem
                    key={lesson.id}
                    value={lesson.id}
                  >
                    {lesson.title}
                  </MenuItem>
                ),
              )}
            </TextField>

            <TextField
              label="Lesson Title"
              value={
                data.lessonTitle
              }
              disabled
              fullWidth
            />
          </div>

          {/* TITLE + TYPE */}

          <div className="form-row grid-cols-2">
            <TextField
              label="Title"
              value={data.title}
              onChange={(e) =>
                handleChange(
                  'title',
                  e.target.value,
                )
              }
              fullWidth
              required
            />

            <TextField
              select
              label="Resource Type"
              value={
                data.resourceType
              }
              onChange={(e) =>
                handleChange(
                  'resourceType',
                  e.target.value,
                )
              }
              fullWidth
            >
              <MenuItem value="VIDEO">
                VIDEO
              </MenuItem>

              <MenuItem value="PDF">
                PDF
              </MenuItem>

              <MenuItem value="IMAGE">
                IMAGE
              </MenuItem>

              <MenuItem value="LINK">
                LINK
              </MenuItem>

              <MenuItem value="AUDIO">
                AUDIO
              </MenuItem>

              <MenuItem value="ZIP">
                ZIP
              </MenuItem>
            </TextField>
          </div>

          {/* FILE */}

          <div className="form-row grid-cols-2">
            <Button
              variant="outlined"
              component="label"
              disabled={uploading}
            >
              {uploading
                ? 'Uploading...'
                : 'Upload File'}

              <input
                type="file"
                hidden
                accept={
                  data.resourceType ===
                  'VIDEO'
                    ? 'video/mp4'
                    : '*'
                }
                onChange={async (
                  e,
                ) => {
                  const file =
                    e.target
                      .files?.[0];

                  if (!file)
                    return;

                  await handleFileUpload(
                    file,
                  );
                }}
              />
            </Button>

            <TextField
              label="Resource URL"
              value={
                data.resourceUrl
              }
              onChange={(e) =>
                handleChange(
                  'resourceUrl',
                  e.target.value,
                )
              }
              fullWidth
            />
          </div>

          {/* POSITION + METADATA */}

          <div className="form-row grid-cols-2">
            <TextField
              label="Position"
              type="number"
              value={
                data.position
              }
              onChange={(e) =>
                handleChange(
                  'position',
                  e.target.value,
                )
              }
              fullWidth
            />

            <TextField
              label="Metadata JSON"
              multiline
              rows={4}
              value={JSON.stringify(
                data.metadata,
                null,
                2,
              )}
              onChange={(e) => {
                try {
                  handleChange(
                    'metadata',
                    JSON.parse(
                      e.target
                        .value,
                    ),
                  );
                } catch {}
              }}
              fullWidth
            />
          </div>
        </FormGroup>
      </Box>
    </Paper>
  );
}